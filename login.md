# Documentación del Sistema de Login y Registro

Este documento explica el funcionamiento técnico del sistema de autenticación en el proyecto **Rechord**.

## Estructura General

El sistema utiliza una arquitectura **Frontend-Backend** desacoplada:

- **Frontend**: SPA (Single Page Application) en Vanilla JavaScript.
- **Backend**: API REST en PHP.
- **Persistencia**: MySQL (gestionado por modelos en PHP).

## Flujo de Datos

### 1. Frontend (Cliente)

La lógica de autenticación reside principalmente en `frontend/services/authService.js`.

#### Componentes Clave:
- **`authService.js`**: Centraliza todas las llamadas a la API relacionadas con usuarios.
  - Gestión de `localStorage`: Guarda el token (`rechord_token`) y datos del usuario (`rechord_user`).
  - Métodos principales: `login()`, `register()`, `logout()`, `isAuthenticated()`, `getCurrentUser()`.
- **Pages & Components**: 
  - `pages/Login.js` y `pages/Register.js`: Controladores de vista que gestionan eventos del formulario.
  - `components/LoginForm.js` y `components/RegisterForm.js`: Renderizan el HTML de los formularios.

#### Proceso de Login (Código):
1. El usuario introduce credenciales en `/login`.
2. `Login.js` captura el evento `submit`.
3. Se llama a `authService.login(email, password)`.
4. Se realiza una petición `POST` a `backend/api/usuarios.php?action=login`.
5. Si es exitoso:
   - Se guarda el token y usuario en `localStorage`.
   - Se redirige al home (`/`).

### 2. Backend (Servidor)

El punto de entrada es `backend/api/usuarios.php` que actúa como router.

#### Estructura:
- **Router (`api/usuarios.php`)**:
  - Recibe las peticiones HTTP.
  - Determina la acción basada en el parámetro `action` (GET/POST) o el método HTTP.
  - Instancia `UsuarioController`.

- **Controlador (`controllers/UsuarioController.php`)**:
  - **`login($data)`**: 
    - Verifica email y contraseña contra la base de datos (usando `UsuarioModel`).
    - Si es válido, genera un token aleatorio (simulado con `random_bytes`).
    - Devuelve JSON con `{ token, user, message }`.
  - **`crearUsuario($data)`** (Registro):
    - Valida datos recibidos.
    - Llama al modelo para insertar el nuevo usuario.
    - Devuelve éxito o error (ej. email duplicado).

## Seguridad y Almacenamiento

- **Token**: El backend genera un token hexadecimal de 32 bytes al iniciar sesión.
- **Frontend Storage**: El token se almacena en `localStorage`. Es persistente entre recargas de página.
- **Validación de Sesión**: El frontend verifica la autenticación comprobando la existencia del token (`authService.isAuthenticated()`).

## Archivos Relevantes

| Archivo | Ruta | Responsabilidad |
|---------|------|-----------------|
| **Servicio** | `frontend/services/authService.js` | Lógica de negocio frontend y fetch API. |
| **API Router** | `backend/api/usuarios.php` | Enrutamiento de peticiones de usuario. |
| **Controlador** | `backend/controllers/UsuarioController.php` | Lógica de login, registro y validación. |
| **Modelo** | `backend/models/Usuario.php` | Consultas SQL a la tabla de usuarios. |
