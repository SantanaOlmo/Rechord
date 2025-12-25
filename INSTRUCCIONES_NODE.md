# Cómo ejecutar ReChord con Node.js

¡La migración a Node.js está lista! Ahora tu aplicación funciona con una arquitectura moderna de **Backend (Node.js)** + **Frontend (Estático)**.

Aquí tienes los pasos para ejecutarla correctamente, ya que cambia un poco respecto a tu flujo anterior con solo XAMPP.

## 1. Base de Datos (MySQL) 🗄️
**Sigues necesitando XAMPP** (o cualquier servidor MySQL) para la base de datos.
1. Abre **XAMPP Control Panel**.
2. Inicia el módulo **MySQL**.
   * *Nota: No es obligatorio iniciar Apache para que funcione la API, pero sí lo necesitarás si quieres ver la web a través de `localhost/rechordb`.*

## 2. Backend (Node.js) 🚀
Este es el nuevo servidor que reemplaza a PHP para la lógica de negocio.
1. Abre una terminal en la carpeta del proyecto.
2. Entra en la carpeta del backend:
   ```bash
   cd backend
   ```
3. Inicia el servidor:
   ```bash
   npm start
   ```
   Deberías ver:
   > `Database Pool Created`
   > `Server running on http://localhost:3000`

*Mantén esta terminal abierta mientras uses la aplicación.*

## 3. Frontend (Cliente Web) 🌐
El frontend (tus archivos HTML, CSS y JS) necesita ser "servido" por un servidor web para cargar correctamente.

### Opción A: Usar XAMPP (Tu flujo habitual)
Esta es la forma más fácil porque ya tienes los archivos en `htdocs`.
1. En XAMPP, inicia también el módulo **Apache**.
2. Abre tu navegador y ve a:
   👉 **http://localhost/rechordb/**

**¿Qué está pasando?**
- **Apache** (puerto 80) te entrega los archivos visuales (`index.html`, css, js).
- Tu navegador lee `frontend/config.js` y sabe que debe pedir los datos (canciones, usuarios) a **Node.js** (puerto 3000).

### Opción B: VS Code Live Server
Si prefieres no usar Apache:
1. Instala la extensión **Live Server** en VS Code.
2. Haz clic derecho en `index.html` y elige "Open with Live Server".

## Resumen de Arquitectura Actual

| Componente | Tecnología | Dirección | Función |
|------------|------------|-----------|---------|
| **Frontend** | HTML/JS | `http://localhost/rechordb` | Lo que ves en el navegador |
| **Backend** | **Node.js** | `http://localhost:3000` | Procesa datos, login, archivos |
| **Base de Datos** | MySQL | `localhost:3306` | Guarda la información |

> **Importante**: Si quieres volver a usar PHP (backend antiguo), solo tienes que editar `frontend/config.js` y cambiar la `API_BASE_URL`.
