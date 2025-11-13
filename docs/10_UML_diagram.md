[![back](assets/icons/back.png)](00_project_overview.md)

# UML
## Class diagrams

````mermaid
classDiagram
    class Cancion {
        +int id_cancion
        +int id_usuario
        +string titulo
        +string artista
        +string nivel
        +string archivo_mp3
        +datetime fecha_creacion
        +agregarEstrofa()
        +sincronizar()
    }

    class Usuario {
        +int id_usuario
        +string nombre
        +string email
        +string contraseña
        +datetime fecha_registro
        +string bio
        +crearCancion()
        +seguirUsuario()
        +likeCancion()
        +crearCarpeta()
    }

    class Estrofa {
        +int id_estrofa
        +int id_cancion
        +string texto
        +int orden
        +agregarAcorde()
    }

    class Acorde {
        +int id_acorde
        +string nombre
        +string imagen_svg
        +string descripcion
    }

    class EstrofaAcorde {
        +int id_estrofa_acorde
        +int id_estrofa
        +int id_acorde
        +int posicion_en_texto
    }

    class Carpeta {
        +int id_carpeta
        +int id_usuario
        +string nombre
    }

    class CancionCarpeta {
        +int id_cancion_carpeta
        +int id_carpeta
        +int id_cancion
    }

    class LikeCancion {
        +int id_like
        +int id_usuario
        +int id_cancion
    }

    class SeguirUsuario {
        +int id_seguir
        +int id_usuario_seguidor
        +int id_usuario_seguido
    }

    %% Relaciones
    Usuario "1" --> "*" Cancion : "crea"
    Usuario "1" --> "*" Carpeta : "tiene"
    Usuario "1" --> "*" LikeCancion : "da like"
    Usuario "1" --> "*" SeguirUsuario : "sigue"

    Cancion "1" --> "*" Estrofa : "tiene"
    Cancion "1" --> "*" LikeCancion : "recibe"
    Cancion "1" --> "*" CancionCarpeta : "pertenece a"

    Estrofa "1" --> "*" EstrofaAcorde : "tiene"
    Acorde "1" --> "*" EstrofaAcorde : "es usado en"

    Carpeta "1" --> "*" CancionCarpeta : "contiene"

````