# Guía de Despliegue para Rechord

Este documento detalla las opciones para "desplegar" tu aplicación web (Rechord) y permitir que otras personas (amigos) accedan a ella desde fuera de tu red local. Basado en tu configuración actual (XAMPP con Apache en Windows + WebSockets en PHP).

---

## 1. La Opción Instantánea: Ngrok (Recomendada para pruebas rápidas)

Si solo quieres enseñar la web a un amigo *ahora mismo* sin configurar tu router, esta es la mejor opción.

**¿Qué hace?**
Crea un túnel seguro desde internet directamente a tu localhost. Te da una URL pública (ej: `https://micodigo.ngrok-free.app`) que apunta a tu ordenador.

**Pasos:**
1.  Descarga **Ngrok** desde su web oficial y crea una cuenta gratuita.
2.  Abre una terminal y ejecuta:
    ```bash
    ngrok http 80
    ```
    *(Esto expone tu Apache puerto 80 a internet)*.
3.  Copia la URL `https` que te da y pásasela a tus amigos.
4.  **Importante para WebSockets**: Como usas websockets en el puerto `8080`, necesitarás otro túnel para eso O configurar ngrok para redirigir ambos (requiere configuración extra).
    *   *Solución rápida:* Abre otra terminal y ejecuta `ngrok http 8080` para obtener otra dirección para el socket, y actualiza tu `frontend/js/config.js` (o donde definas la URL del socket) con esa nueva dirección temporal.

**Pros:**
*   Cero configuración de router.
*   HTTPS automático.
*   Seguro (cierras la terminal y se acaba el acceso).

**Contras:**
*   La URL cambia cada vez que reinicias (en la versión gratis).
*   Ligeramente más lento.

---

## 2. La Opción "Casera": Apache + Port Forwarding (Tu setup actual)

Si quieres usar tu ordenador como servidor y que la IP sea siempre la misma (o usar un dominio tipo `miweb.ddns.net`), esta es la forma clásica.

**Requisitos:**
1.  **IP Estática Local:** Tu PC debe tener siempre la misma IP en tu casa (ej: `192.168.1.50`).
2.  **Acceso al Router:** Tienes que entrar en la config del router (generalmente `192.168.1.1`).

**Pasos:**
1.  **Abrir Puertos (Port Forwarding):**
    *   Entra en tu router.
    *   Busca la sección "Port Forwarding", "NAT" o "Servidores Virtuales".
    *   Abre el puerto **80** (HTTP) y redirígelo a la IP local de tu PC.
    *   Abre el puerto **8080** (WebSockets) y redirígelo también a tu PC.
2.  **Firewall de Windows:**
    *   Asegúrate de que el Firewall de Windows permita conexiones entrantes a "Apache HTTP Server" y a "PHP".
3.  **Probar:**
    *   Averigua tu **IP Pública** (busca "cuál es mi ip" en Google).
    *   Tus amigos deben entrar a `http://TU_IP_PUBLICA/rechordb`.

**Sobre Nginx vs Apache aquí:**
*   Ya usas **Apache** (XAMPP). Para este uso, **no necesitas instalar Nginx**. Apache es perfectamente capaz de servir la web a tus amigos.
*   Nginx se suele poner *delante* de Apache solo si tienes un tráfico muy alto o necesidades complejas de caché, cosa que ahora no tienes.

---

## 3. La Opción "Pro": VPS (Servidor Privado Virtual)

Si quieres que la web esté disponible 24/7 sin dejar tu PC encendido, necesitas un servidor real.

**Proveedores:** DigitalOcean, Hetzner, Linode, AWS (Lightsail). (Coste: ~4-6€/mes).

**El Setup Típico (Aquí sí entra Nginx):**
En un servidor Linux (Ubuntu), lo estándar hoy en día es:
1.  **Nginx** como servidor web principal (Reverse Proxy).
2.  **PHP-FPM** para procesar los archivos PHP (más eficiente que el módulo de Apache tradicional).
3.  **Systemd** para mantener tu script de WebSockets (`run_ws.sh`) siempre corriendo.

**¿Por qué Nginx aquí?**
*   Maneja mejor muchas conexiones simultáneas (útil para WebSockets).
*   Configuración más limpia para "Reverse Proxy" (puedes hacer que `tudominio.com/api` vaya a PHP y `tudominio.com/ws` vaya a tu puerto 8080 internamente, ocultando los puertos al usuario).

---

## Notas sobre tus WebSockets (La parte de "servlets")

Mencionaste "servlets" pero vi que usas `Ratchet` con PHP (`WebSocketServer.php`) que se ejecuta con `run_ws.sh`.

**Para que funcionen desde fuera:**
1.  El cliente (JS) intenta conectarse a `ws://localhost:8080`.
2.  Si despliegas, debes cambiar esa línea en tu JavaScript para que apunte a `ws://TU_IP_PUBLICA:8080` (o `wss://` si usas SSL).
3.  **Archivo clave:** Revisa dónde defines la URL de conexión en el frontend (probablemente `frontend/services/socketService.js` o similar) y prepáralo para cambiar según el entorno (dev vs prod).

---

## Resumen: ¿Qué hago hoy?

1.  **¿Solo para enseñar un momento?** Usa **Ngrok**.
2.  **¿Para jugar una tarde con amigos?** Configura los puertos de tu router (**Opción 2**). Es gratis y aprendes de redes.
3.  **¿Para dejarlo fijo?** Alquila un VPS barato e instala **Ubuntu + Nginx + PHP**.

Si te decides por la Opción 2 o 3 y necesitas ayuda con la configuración específica (el archivo `.conf` de Apache o Nginx), ¡dímelo!
