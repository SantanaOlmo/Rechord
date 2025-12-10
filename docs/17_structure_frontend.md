[ Volver al �ndice](index.md)

# 🎨 Estructura del Frontend

El frontend es una Single Page Application (SPA) construida con JavaScript moderno (Vanilla JS con módulos ES6) y Tailwind CSS.

## 📂 Directorios Principales

### `frontend/core/`
El núcleo de la aplicación SPA.
- **Archivos Clave**:
    - `Router.js`: Maneja la navegación (basada en hash `#/ruta`) y renderiza la "Página" correspondiente.
    - `StateStore.js`: (Si existe) Manejo de estado global simple.

### `frontend/pages/`
Componentes de alto nivel que representan una vista completa.
- **Función**: Estructurar el layout de una pantalla e inicializar los controladores necesarios. Son "contenedores" tontos.
- **Archivos Clave**:
    - `HomePage.js`: Pantalla principal.
    - `Sincronizador.js`: Pantalla del editor de sincronización.
    - `PlayerPage.js`: Pantalla del reproductor inmersivo.
    - `AdminDashboard.js`: Panel de administración.

### `frontend/components/`
Piezas reutilizables de la interfaz.
- **Subdirectorios**:
    - `/layout`: Header, Sidebar, Footer.
    - `/player`: Controles de reproducción, barra de progreso (`PlayerControls.js`, `PlayerController.js`).
    - `/synchronizer`: Lógica y UI específica del editor (`rendering.js`, `SyncController.js`).
    - `/admin`: Pestañas del panel admin (`AdminHomeTab.js`, `AdminUsersTab.js`).
    - `/messages`: Chat y mensajería (`ChatRenderer.js`).

### `frontend/logic/`
Lógica de negocio del frontend separada de la UI.
- **Función**: Manejar eventos complejos, transformaciones de datos y orquestación de UI para módulos grandes.
- **Archivos Clave**:
    - `adminHomeConfig.js`: Lógica principal del configurador de Home.
    - `uiRenderer.js`: Renderizado del configurador.
    - `eventHandlers.js`: Manejo de eventos del configurador.

### `frontend/services/`
Capa de comunicación con el Backend (API Client).
- **Función**: Realizar peticiones `fetch()` y manejar errores de red.
- **Archivos Clave**:
    - `authService.js`: Login, registro, gestión de tokens.
    - `cancionService.js`: CRUD de canciones.
    - `homeService.js`: Obtención de datos públicos.
    - `homeAdminService.js`: Configuración administrativa.
    - `socketService.js`: Comunicación WebSocket.

### `frontend/styles/`
Estilos CSS.
- Se usa principalmente Tailwind CSS via clases en JS/HTML, pero aquí residen estilos personalizados o globales.

