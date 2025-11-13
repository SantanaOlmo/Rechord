[![back](assets/icons/back.png)](00_project_overview.md)

# DataBase

## Class diagrams

````mermaid
erDiagram
    USUARIO {
        int id_usuario PK
        string nombre
        string email
        string contraseña
        datetime fecha_registro
        string bio
    }

    CANCION {
        int id_cancion PK
        int id_usuario FK
        string titulo
        string artista
        string nivel
        string archivo_mp3
        datetime fecha_creacion
    }

    ESTROFA {
        int id_estrofa PK
        int id_cancion FK
        string texto
        int orden
    }

    %% Tabla ACORDE modificada
    ACORDE {
        int id_acorde PK
        string nombre
        string descripcion
    }
    
    %% Nuevas tablas para digitación dinámica
    ACORDE_DIGITACION {
        int id_digitacion PK
        int id_acorde FK
        int cuerda_6 
        int cuerda_5
        int cuerda_4
        int cuerda_3
        int cuerda_2
        int cuerda_1
        int traste_inicial
    }
    
    ACORDE_CEJILLA {
        int id_cejilla PK
        int id_acorde FK
        int traste
        int cuerda_inicio
        int cuerda_fin
    }

    ESTROFA_ACORDE {
        int id_estrofa_acorde PK
        int id_estrofa FK
        int id_acorde FK
        int posicion_en_texto
    }

    CARPETA {
        int id_carpeta PK
        int id_usuario FK
        string nombre
    }

    CANCION_CARPETA {
        int id_cancion_carpeta PK
        int id_carpeta FK
        int id_cancion FK
    }

    LIKE_CANCION {
        int id_like PK
        int id_usuario FK
        int id_cancion FK
    }

    SEGUIR_USUARIO {
        int id_seguir PK
        int id_usuario_seguidor FK
        int id_usuario_seguido FK
    }

    %% Relaciones
    USUARIO ||--o{ CANCION : "crea"
    USUARIO ||--o{ CARPETA : "tiene"
    USUARIO ||--o{ LIKE_CANCION : "da like"
    USUARIO ||--o{ SEGUIR_USUARIO : "sigue"

    CANCION ||--o{ ESTROFA : "tiene"
    CANCION ||--o{ LIKE_CANCION : "recibe"
    CANCION ||--o{ CANCION_CARPETA : "pertenece a"

    ESTROFA ||--o{ ESTROFA_ACORDE : "tiene"
    
    %% Relaciones de Acordes Dinámicos
    ACORDE ||--o{ ACORDE_DIGITACION : "tiene"
    ACORDE ||--o{ ACORDE_CEJILLA : "tiene"
    ACORDE ||--o{ ESTROFA_ACORDE : "es usado en"

    CARPETA ||--o{ CANCION_CARPETA : "contiene"
````