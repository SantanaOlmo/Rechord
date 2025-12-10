[ Volver al �ndice](index.md)

# 🏗️ Estructura del Backend

El backend de Rechord está construido en PHP nativo, siguiendo un patrón MVC (Modelo-Vista-Controlador) adaptado para una API REST.

## 📂 Directorios Principales

### `backend/api/`
Contiene los "puntos de entrada" públicos (endpoints) de la API.
- **Función**: Recibir las peticiones HTTP (GET, POST), instanciar los controladores necesarios y devolver la respuesta en formato JSON.
- **Archivos Clave**:
    - `canciones.php`: Endpoints para gestión de canciones.
    - `usuarios.php`: Endpoints para usuarios y autenticación.
    - `home_config.php`: Endpoint para configuración de la Home (admin).

### `backend/controllers/`
Contiene la lógica de negocio y orquestación.
- **Función**: Validar datos de entrada, llamar a los modelos o servicios apropiados y preparar la respuesta.
- **Archivos Clave**:
    - `CancionController.php`: Lógica de canciones.
    - `UsuarioController.php`: Lógica de usuarios (login, registro).
    - `HeroController.php`: Gestión de videos hero.

### `backend/models/`
Representación de datos y acceso a Base de Datos (DAO).
- **Función**: Ejecutar consultas SQL directas contra la base de datos. Cada clase corresponde a una entidad (tabla).
- **Archivos Clave**:
    - `Cancion.php`: Modelo de la tabla `canciones`.
    - `Usuario.php`: Modelo de la tabla `usuarios`.
    - `HeroVideo.php`: Modelo para videos de portada.

### `backend/services/`
Lógica compleja o utilidades de negocio reutilizables.
- **Función**: Encapsular lógica que excede a un simple controlador o que se reutiliza en varios sitios.
- **Archivos Clave**:
    - `CancionManager.php`: Lógica avanzada de gestión de archivos de canciones.

### `backend/utils/`
Herramientas transversales.
- **Archivos Clave**:
    - `Response.php`: Helper para estandarizar respuestas JSON.
    - `AuthMiddleware.php`: Verificación de tokens JWT/Sesión.

### `backend/uploads/`
Almacenamiento de archivos subidos por los usuarios.
- **Estructura**:
    - `/music`: Archivos MP3/Audio.
    - `/images`: Avatares y portadas.
    - `/videos`: Videos de fondo (Hero).

