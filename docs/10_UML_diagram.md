[![back](assets/icons/back.png)](00_project_overview.md)

# Diagramas UML

## 1. Diagrama de Clases (Backend)

Representación de la arquitectura MVC del backend, mostrando la relación entre Controladores y Modelos.

```mermaid
classDiagram
    %% Controllers
    class UsuarioController {
        +crearUsuario(data)
        +login(data)
        +getUsuarios()
        +eliminarUsuario(id)
        +actualizarPerfil(postData, files)
        +actualizarConfiguracion(data)
        +getUsuario(id)
        +impersonate(data)
        +search(term)
    }

    class CancionController {
        +subirCancion(data, files)
        +getCanciones()
        +getCancion(id)
        +eliminarCancion(id)
        +actualizarCancion(id, data)
    }

    class EstrofaController {
        +agregarEstrofa(data)
        +getEstrofas(idCancion)
        +actualizarEstrofa(id, data)
        +eliminarEstrofa(id)
    }
    
    class CarpetaController {
        +crearCarpeta(data)
        +getCarpetasUser(idUsuario)
        +agregarCancion(idCarpeta, idCancion)
    }

    class ChatController {
        +getConversaciones(idUsuario)
        +getMensajes(idConversacion)
        +enviarMensaje(data)
    }

    %% Models
    class Usuario {
        -pdo
        +registrar(nombre, email, password)
        +login(email, password)
        +obtenerTodos()
        +obtenerPorId(id)
        +actualizarFoto(id, ruta)
        +actualizarDatos(id, nombre, email, bio)
        +eliminar(id)
        +buscarUsuario(term)
        +contarSeguidores(id)
    }

    class Cancion {
        -pdo
        +crear(data)
        +obtenerTodas()
        +obtenerPorId(id)
        +eliminar(id)
    }

    class Estrofa {
        -pdo
        +crear(data)
        +obtenerPorCancion(idCancion)
    }

    class Carpeta {
        -pdo
        +crear(data)
        +obtenerPorUsuario(idUsuario)
    }

    class Chat {
        -pdo
        +obtenerConversaciones(idUsuario)
        +guardarMensaje(data)
    }

    %% Relationships
    UsuarioController ..> Usuario : usa
    CancionController ..> Cancion : usa
    EstrofaController ..> Estrofa : usa
    CarpetaController ..> Carpeta : usa
    ChatController ..> Chat : usa

    Usuario "1" --> "*" Cancion : tiene
    Usuario "1" --> "*" Carpeta : tiene
    Cancion "1" -- "*" Estrofa : contiene
    Carpeta "1" -- "*" Cancion : agrupa
```

## 2. Diagrama de Base de Datos (ER)

Esquema relacional de la base de datos `rechord`, incluyendo tablas principales y de relación.

```mermaid
erDiagram
    USUARIO ||--o{ CANCION : sube
    USUARIO ||--o{ CARPETA : crea
    USUARIO ||--o{ LIKE_CANCION : "da like"
    USUARIO ||--o{ SEGUIR_USUARIO : "sigue a"
    USUARIO ||--o{ NOTIFICACIONES : recibe
    USUARIO ||--o{ CHAT_PARTICIPANTES : participa
    
    CANCION ||--o{ ESTROFA : tiene
    CANCION ||--o{ LIKE_CANCION : recibe
    CANCION ||--o{ CANCION_CARPETA : "esta en"
    CANCION ||--o{ CONFIGURACION_TEMPORAL : tiene
    CANCION ||--o{ ACORDE_SINCRONIZADO : tiene

    CARPETA ||--o{ CANCION_CARPETA : contiene
    CARPETA ||--o{ LIKE_CARPETA : recibe

    ACORDE ||--o{ ACORDE_CEJILLA : tiene
    ACORDE ||--o{ ACORDE_DIGITACION : tiene
    ACORDE ||--o{ ACORDE_SINCRONIZADO : se_usa_en

    CHAT_CONVERSACIONES ||--o{ CHAT_MENSAJES : contiene
    CHAT_CONVERSACIONES ||--o{ CHAT_PARTICIPANTES : tiene

    USUARIO {
        int id_usuario PK
        string nombre
        string email
        string password_hash
        string rol
        string foto_perfil
    }

    CANCION {
        int id_cancion PK
        int id_usuario FK
        string titulo
        string artista
        string ruta_mp3
        string nivel
    }

    ESTROFA {
        int id_estrofa PK
        int id_cancion FK
        text contenido
        float tiempo_inicio
        float tiempo_fin
    }

    ACORDE {
        int id_acorde PK
        string nombre
        string color_hex
    }

    ACORDE_SINCRONIZADO {
        int id_sincronia_acorde PK
        int id_cancion FK
        int id_acorde FK
        float tiempo_inicio
        float tiempo_fin
    }

    CARPETA {
        int id_carpeta PK
        int id_usuario FK
        string nombre
    }

    SALAS {
        int id_sala PK
        string codigo_sala
        int id_maestro FK
        enum estado
    }
```