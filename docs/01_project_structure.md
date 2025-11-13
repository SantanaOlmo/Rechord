[![back](assets/icons/back.png)](00_project_overview.md)

# Project structure

````
rechord/
│
├─ backend/                           # Servidor PHP (API REST)
│  ├─ api/                            # Endpoints PHP (usuarios, canciones, etc.)
│  │   ├─ usuarios.php
│  │   ├─ canciones.php
│  │   ├─ acordes.php
│  │   └─ ...
│  ├─ config/                         # Configuración general
│  │   ├─ db.php                      # Conexión PDO/MySQL
│  │   ├─ session.php                 # Manejo de sesiones
│  │   └─ constants.php
│  ├─ models/                         # Clases del modelo de datos (MVC)
│  │   ├─ Usuario.php
│  │   ├─ Cancion.php
│  │   ├─ Acorde.php
│  │   └─ ...
│  ├─ controllers/                    # Controladores que gestionan la lógica
│  │   ├─ UsuarioController.php
│  │   ├─ CancionController.php
│  │   ├─ AcordeController.php
│  │   └─ ...
│  ├─ utils/                          # Funciones auxiliares (validaciones, etc.)
│  │   └─ helpers.php
│  ├─ index.php                       # Punto de entrada (puede servir como router)
│  └─ .htaccess                       # Para redirecciones / URLs limpias
│
├─ frontend/                          # Aplicación cliente (SPA en JS nativo)
│  ├─ assets/                         # Imágenes, iconos, audios, fuentes
│  │   ├─ img/
│  │   ├─ icons/
│  │   ├─ audio/
│  │   └─ fonts/
│  ├─ components/                     # Componentes reutilizables (como si fuera React)
│  │   ├─ Player.js                   # Reproductor de audio + lyrics
│  │   ├─ SongCard.js                 # Tarjeta de canción
│  │   ├─ ChordDiagram.js             # Visualización de acordes
│  │   ├─ Modal.js                    # Ventanas modales
│  │   └─ ...
│  ├─ pages/                          # “Vistas” o pantallas (SPA)
│  │   ├─ Home.js
│  │   ├─ Profile.js
│  │   ├─ SongEditor.js
│  │   ├─ Login.js
│  │   └─ Register.js
│  ├─ services/                       # Comunicación con la API REST
│  │   ├─ api.js                      # Métodos fetch() (GET, POST, PUT, DELETE)
│  │   └─ auth.js                     # Autenticación, sesión
│  ├─ styles/                         # CSS modular y responsive
│  │   ├─ main.css
│  │   ├─ components.css
│  │   └─ pages.css
│  ├─ utils/                          # Funciones auxiliares frontend
│  │   ├─ validators.js
│  │   ├─ domUtils.js
│  │   └─ eventHandlers.js
│  ├─ index.html                      # Punto de entrada de la SPA
│  ├─ main.js                         # Enrutador y renderizado principal
│  └─ manifest.json                   # Configuración para futura PWA / móvil
│
├─ db/                                # Scripts SQL
│  ├─ init.sql                        # Creación inicial de tablas
│  └─ seed.sql                        # Datos de prueba (opcional)
│
├─ docs/                              # Documentación del proyecto
│  ├─ diagrama-uml.md
│  ├─ guia-estilo.pdf
│  ├─ wireframes/
│  └─ README.md
│
├─ .env                               # Variables de entorno (credenciales, etc.)
├─ docker-compose.yml
├─ Dockerfile
└─ README.md


````

# Frontend: HTML, CSS, JS (posible React en el futuro para versión móvil)

- Carpeta frontend/components → para componentes de UI (barra de búsqueda, reproductor de audio, editor de lyrics/acordes).

- Carpeta frontend/pages → páginas de app: login, registro, perfil, vista de canción, editor.

- Carpeta frontend/services → llamadas a la API.

- Carpeta frontend/assets → imágenes, íconos, fuentes, audios.

# Backend: PHP + MySQL

- Carpeta backend/api → endpoints REST.

- Carpeta backend/controllers → lógica de negocio.

- Carpeta backend/models → interacción con base de datos.

- Carpeta backend/utils → helpers (procesar audio, generar acordes, etc.).

- Carpeta backend/config → configuración de DB y entorno.

# DB: MySQL

- Tabla usuarios, canciones, acordes, carpetas, favoritos, seguimientos, etc.

# Documentación: docs/wireframes → mockups y flujos.