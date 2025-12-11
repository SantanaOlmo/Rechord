# ![Rechord Banner](docs/assets/images/RECHORD_HEADER.png) 

**La plataforma definitiva para músicos.**

Rechord es mucho más que un reproductor. Es tu estudio de ensayo, tu biblioteca personal y tu escenario virtual. Sincroniza letras y acordes con tus canciones favoritas, personaliza tu experiencia y comparte tu música con el mundo.

![gif](docs/assets/gif/2025-12-10%2017-05-02.gif)

##  ¿Qué ofrece Rechord?

*   **Sincronización Perfecta:** Nuestro editor te permite alinear letras y acordes milimétricamente con el audio. ¡Como un karaoke profesional, pero mejor!
*   **Tu Biblioteca en la Nube:** Sube tus MP3, organiza tus carpetas y ten tus canciones siempre a mano.
*   **Comunidad Vibrante:** Sigue a otros músicos, descubre nuevas canciones y comparte tus creaciones.
*   **Reproductor Inmersivo:** Disfruta de una experiencia visual única mientras practicas con tu instrumento.

---

## 🚀 Cómo Empezar (Instalación)

Si eres desarrollador y quieres correr Rechord en tu máquina local, sigue estos sencillos pasos:

### Prerrequisitos
*   **XAMPP** (o cualquier servidor LAMP/WAMP con PHP 8.2+ y MySQL).
*   **Git**.

### Pasos
1.  **Clonar el repositorio:**
    Descarga el código en tu carpeta `htdocs` (normalmente `C:\xampp\htdocs`).
    ```bash
    git clone https://github.com/SantanaOlmo/Rechord.git rechordb
    ```

2.  **Preparar la Base de Datos:**
    *   Abre **phpMyAdmin** (`http://localhost/phpmyadmin`).
    *   Crea una base de datos llamada `rechord`.
    *   Importa el archivo `rechord.sql` que encontrarás en la raíz del proyecto.

3.  **Configurar conexión:**
    Edita el archivo `backend/db/config.php` (si es necesario) para ajustar tu usuario y contraseña de MySQL.

4.  **¡A rockear!**
    Abre tu navegador y entra en:
    `http://localhost/rechordb/frontend/index.html`

---

## 📖 Documentación Técnica

¿Quieres saber cómo funciona Rechord por dentro?
Tenemos una documentación detallada explicando la arquitectura, la base de datos y cada componente del sistema.

👉 **[Ir a la Documentación Técnica](docs/index.md)** 👈

---

© 2025 Rechord Team - Proyecto Intermodular
