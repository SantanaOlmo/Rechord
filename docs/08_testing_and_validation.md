# Testing y Validación

## ✅ Estrategias de Pruebas

Actualmente, el proyecto se basa principalmente en **pruebas manuales** y validación de flujo de usuario, dado su estado de desarrollo activo.

### Pruebas Manuales (Checklist)
Antes de cada deploy o commit importante, se verifican los siguientes flujos:
1.  **Auth**: Login, Registro, Logout.
2.  **Reproducción**: Play/Pause, cambio de canción, persistencia de volumen.
3.  **Perfil**: Edición de datos, carga de avatar/banner.
4.  **Admin**:
    *   Gestión de Home Page (Drag & Drop, CRUD).
    *   Roles de usuario.
5.  **Sockets**: Sincronización en "Modo Fiesta" entre dos pestañas de navegador.

## 🔍 Herramientas de Calidad

*   **Linting**: Se utiliza ESLint (configuración básica) o el linter integrado del IDE para detectar errores de sintaxis en JS.
*   **DevTools**: Uso extensivo de Chrome DevTools para:
    *   Inspección de red (Fetch/XHR/WS).
    *   Depuración de tiempos de ejecución JS (`console.log`, breakpoints).
    *   Validación de layout CSS.

## 🚧 Deuda Técnica y Futuro Testing
Para futuras iteraciones se planea incorporar:
*   **Unit Tests**: PHPUnit para el backend (Modelos y Servicios).
*   **E2E Tests**: Cypress o Playwright para flujos críticos del frontend.

[⬅️ Volver al Índice](index.md)
