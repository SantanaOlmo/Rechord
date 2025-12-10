[ Volver al �ndice](index.md)

# 🗄️ Estructura de Base de Datos

La persistencia de datos se maneja mediante MySQL/MariaDB.

## 📂 Directorios y Archivos

### Raíz del Proyecto
- **`rechord.sql`**: Dump completo de la base de datos (Estructura + Datos de prueba). Es la fuente de la verdad para restaurar el entorno.

### `db/`
Scripts auxiliares de base de datos.
- **`config.php`**: Credenciales de conexión (Host, User, Pass). Evitar subir credenciales reales al repo.
- **`conexion.php`**: Clase PHP (Singleton) que provee la instancia PDO para conectar a la DB.

## 📊 Tablas Principales (Resumen)

| Tabla | Descripción |
|-------|-------------|
| `usuarios` | Almacena credenciales, perfil y roles (admin/user). |
| `canciones` | Metadatos de canciones (título, artista, rutas de archivos). |
| `acordes_sincronizados` | Datos de sincronización (tiempo, acorde, sílaba) para el editor. |
| `home_config` | Configuración dinámica de las secciones de la Home Page. |
| `hero_videos` | Videos configurables para el carrusel principal. |
| `shared_sessions` | Sesiones de escucha compartida (WebSocket). |
| `likes` | Relación N:M de canciones favoritas por usuario. |
| `follows` | Relación N:M de seguidores entre usuarios. |

