# Documentación del Proyecto Rechord

## 1. Resumen de la Aplicación
**Rechord** es una plataforma web de streaming y gestión de música construida como una **Single Page Application (SPA)**. Permite a los usuarios subir canciones, organizarlas en carpetas, reproducirlas en un reproductor persistente, y sincronizar letras/acordes con el audio.

- **Frontend**: JavaScript Vanilla (ES6+), HTML5, TailwindCSS.
- **Backend**: PHP 8 (sin frameworks pesados), MySQL/MariaDB.
- **Arquitectura**: Modelo-Vista-Controlador (MVC) en el backend, Component-based en el frontend.

## 2. Flujo Principal del Usuario
1.  **Autenticación**: El usuario se registra (`/auth/register`) o inicia sesión (`/auth/login`). Recibe un Token JWT (simulado o real) almacenado en `localStorage`.
2.  **Home (`/`)**: El usuario navega por secciones de música ("Novedades", "Top Likes") y ve su barra lateral de biblioteca.
3.  **Biblioteca**: Puede crear carpetas, buscar canciones con el botón (+) y arrastrar canciones (Drag & Drop) para organizarlas.
4.  **Reproducción**: Al hacer clic en una canción, esta se carga en el `PlayerPage` o en la barra de reproducción global. El estado se mantiene entre navegaciones.
5.  **Edición (`/songeditor/:id`)**: Los usuarios (o admins) pueden sincronizar la letra y los acordes con el tiempo de la canción.

---

## 3. Estructura del Backend (`backend/`)

El backend expone una API RESTful que consume el frontend.

### **Modelos (`models/`)**
Encargados de la interacción directa con la base de datos (SQL).
-   `Cancion.php`: CRUD de canciones (crear, leer todas, buscar, populares, hashtags).
-   `Carpeta.php`: Gestión de carpetas y relacion N:M con canciones (`cancion_carpeta`).
-   `Usuario.php`: Registro, login, validación de credenciales.
-   `HomeConfig.php`: Configuración dinámica de las secciones del Home.
-   `Estrofa.php`: Gestión de letras sincronizadas.

### **Controladores (`controllers/`)**
Reciben las peticiones de la API, validan inputs y llaman a los modelos.
-   `CancionController.php`: Maneja subida de archivos (audio/imagen), toggle de likes, y búsquedas.
-   `UsuarioController.php`: Login, registro y perfil de usuario.
-   `CarpetaController.php`: API para crear carpetas, añadir canciones, reordenar.
-   `AcordeSincronizadoController.php` / `EstrofaController.php`: Lógica para el editor de sincronización.

### **API (`api/`)**
Puntos de entrada (routers) que reciben las peticiones HTTP y las despachan al controlador correspondiente.
-   `canciones.php` -> `CancionController`
-   `carpetas.php` -> `CarpetaController`
-   `auth.php` -> `UsuarioController`

---

## 4. Estructura del Frontend (`frontend/`)

El frontend maneja toda la lógica de vista y estado sin recargar la página.

### **Core (`/`)**
-   `app.js`: **Router Principal**. Escucha cambios en el hash (`#`) de la URL y renderiza la página correspondiente. Maneja el layout global (Header, Player).
-   `config.js`: Constantes globales (API URL).

### **Servicios (`services/`)**
Capa de comunicación con la API (Fetch wrappers).
-   `authService.js`: Manejo de tokens y sesión de usuario.
-   `cancionService.js`: `getCanciones`, `search`, `upload`.
-   `carpetaService.js`: `getFolders`, `addSong`, `reorder`.
-   `likeService.js`: Toggle likes.

### **Páginas (`pages/`)**
Vistas completas que se inyectan en el contenedor principal.
-   `HomePage.js`: Tablero principal. Renderiza `FolderSidebar` y secciones de canciones.
-   `PlayerPage.js`: Vista detallada de reproducción y cola.
-   `Sincronizador.js` / `LyricsEditor`: Editor de letras y acordes.
-   `Profile.js`: Perfil de usuario y estadísticas.

### **Componentes (`components/`)**
Piezas de UI reutilizables.
-   `FolderSidebar.js`: Barra lateral con acordeón de carpetas, búsqueda y Drop zone.
-   `SongCard.js`: Tarjeta de canción con imagen, botón de play y drag handle.
-   `PlayerControls.js`: Barra de reproducción (play/pause, seek).
-   `NewSongModal.js`: Formulario para subir música.

---

## 5. Interconexión y Flujo de Datos

Ejemplo: **Usuario busca y añade una canción a una carpeta.**

1.  **Frontend (UI)**: El usuario escribe en el input de búsqueda dentro de una carpeta en `FolderSidebar.js`.
2.  **Frontend (Event)**: El evento `input` llama a `window.handleFolderSearch`.
3.  **Frontend (Service)**: Se invoca `cancionService.search(term)`.
4.  **Network**: Se hace un `GET /api/canciones.php?search=term`.
5.  **Backend (Router)**: `canciones.php` detecta el parámetro y llama a `CancionController->getCanciones()`.
6.  **Backend (Controller)**: El controlador verifica el parámetro y llama a `CancionModel->buscar($term)`.
7.  **Backend (Model)**: Ejecuta `SELECT * FROM ... WHERE titulo LIKE %term%`.
8.  **Respuesta**: Los datos viajan de vuelta (DB -> Model -> Controller -> JSON -> Frontend).
9.  **Frontend (Update)**: `FolderSidebar.js` recibe el JSON y renderiza la lista de resultados.
10. **Acción**: El usuario hace clic en (+). Se llama a `carpetaService.addSong()`, que envía un `POST` a `carpetas.php`, cerrando el ciclo.
