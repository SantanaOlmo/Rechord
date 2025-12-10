[ Volver al �ndice](index.md)

# Arquitectura Frontend

Rechordb utiliza una arquitectura de **Single Page Application (SPA)** construida con **Vanilla JavaScript** (ES6+), sin depender de frameworks pesados como React o Vue. Esto garantiza un rendimiento máximo y un control total sobre el DOM.

## 🧩 Componentes y Estructura

El frontend está modularizado para mantener el código limpio y mantenible.

### 1. Núcleo (`core/`)
*   **`Store.js` / `StateStore.js`**: Implementa un patrón Pub/Sub para la gestión del estado global. Maneja eventos como cambios de canción, actualizaciones de socket y notificaciones de usuario.
*   **`router.js`**: un enrutador basado en Hash (`#/route`) que carga dinámicamente las vistas sin recargar la página.

### 2. Servicios (`services/`)
Encapsulan la lógica de comunicación con el backend (API Fetch y WebSockets).
*   **`api.js`**: Cliente HTTP base.
*   **`authService.js`**: Login, registro, manejo de tokens JWT y cierre de sesión.
*   **`cancionService.js`**: CRUD de canciones, likes, y configuración de Home.
*   **`usuarioService.js`**: Perfiles de usuario y gestión de seguidores.
*   **`socketService.js`**: Gestión de conexiones en tiempo real.

### 3. Vistas (`pages/`)
Componentes de alto nivel que representan páginas completas.
*   **`HomePage.js`**: Dashboard principal.
*   **`Profile.js`**: Perfil de usuario (ahora modularizado con lógica separada).
*   **`Login.js` / `Register.js`**: Autenticación.

### 4. Lógica de Negocio (`logic/`)
**(Nuevo)** Separación de la lógica compleja de las vistas para mejorar la legibilidad.
*   **`profileLogic.js`**: Eventos de usuario estándar.
*   **`adminHomeLogic.js`**: Lógica compleja de Drag & Drop y CRUD para el panel de administración.

### 5. Componentes UI (`components/`)
Piezas reutilizables de interfaz.
*   **`FolderSidebar.js`**: Barra lateral de navegación redimensionable.
*   **`PlayerControls.js`**: Barra de reproducción persistente.
*   **`ProfileHeader.js`**: Cabecera de perfil con estadísticas.

## ⚡ Flujo de la Aplicación

1.  **Inicio**: `app.js` inicializa el enrutador y comprueba la autenticación.
2.  **Navegación**: El usuario cambia la URL (`#/profile`), el router detecta el cambio, limpia el contenedor principal (`#app-root`) e inyecta el HTML de la nueva página.
3.  **Hidratación**: Después de inyectar el HTML, se llama a una función de "attach events" (ej: `attachProfileEvents`) para añadir listeners y funcionalidad dinámica.

[⬅️ Volver al Índice](index.md)

