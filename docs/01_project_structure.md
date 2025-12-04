[![back](assets/icons/back.png)](00_project_overview.md)

# 📂 Estructura General

La raíz del proyecto (`rechordb/`) contiene los archivos de configuración de infraestructura (`Docker`) y las carpetas principales de código.

```plaintext
rechordb/
│
├─ backend/                           \# Servidor PHP (API REST) - Lógica de Negocio
│  ├─ api/                            \# Endpoints PHP que reciben peticiones y las dirigen al Controller.
│  │   ├─ usuarios.php
│  │   ├─ canciones.php
│  │   ├─ acordes.php
│  │   └─ ...
│  ├─ config/                         \# Configuración general del entorno y la DB.
│  │   ├─ db.php                      \# Conexión PDO/MySQL
│  │   ├─ session.php                 \# Manejo de sesiones (si aplica)
│  │   └─ constants.php
│  ├─ models/                         \# Clases del modelo de datos (interacción directa con la DB).
│  │   ├─ Usuario.php
│  │   ├─ Cancion.php
│  │   ├─ Acorde.php
│  │   └─ ...
│  ├─ controllers/                    \# Controladores que gestionan la lógica y manipulan modelos.
│  │   ├─ UsuarioController.php
│  │   ├─ CancionController.php
│  │   ├─ AcordeController.php
│  │   └─ ...
│  ├─ utils/                          \# Funciones auxiliares (helpers, validaciones, etc.).
│  │   └─ helpers.php
│  ├─ index.php                       \# Punto de entrada principal / Router (si aplica).
│  └─ .htaccess                       \# Para URLs limpias / redirecciones.
│
├─ frontend/                          \# Aplicación cliente (HTML, CSS, JavaScript SPA)
│  ├─ assets/                         \# Recursos estáticos (imágenes, iconos, audios, fuentes).
│  │   ├─ img/
│  │   ├─ icons/
│  │   ├─ audio/
│  │   └─ fonts/
│  ├─ components/                     \# Módulos de UI reutilizables (Player, ChordDiagram, etc.).
│  │   ├─ Player.js
│  │   ├─ SongCard.js
│  │   ├─ ChordDiagram.js
│  │   ├─ Modal.js
│  │   └─ ...
│  ├─ pages/                          \# "Vistas" o pantallas principales de la aplicación.
│  │   ├─ Home.js
│  │   ├─ Profile.js
│  │   ├─ SongEditor.js
│  │   ├─ Login.js
│  │   └─ Register.js
│  ├─ services/                       \# Módulos de comunicación con la API REST.
│  │   ├─ api.js                      \# Métodos de fetch (GET, POST, etc.)
│  │   └─ auth.js                     \# Lógica de autenticación y sesión.
│  ├─ styles/                         \# Archivos CSS / Estilos modulares.
│  │   ├─ main.css
│  │   ├─ components.css
│  │   └─ pages.css
│  ├─ utils/                          \# Funciones auxiliares específicas del frontend.
│  │   ├─ validators.js
│  │   ├─ domUtils.js
│  │   └─ eventHandlers.js
│  ├─ index.html                      \# Punto de entrada de la SPA.
│  ├─ main.js                         \# Enrutador y renderizado principal.
│  └─ manifest.json                   \# Configuración para PWA.
│
├─ db/                                \# Scripts y archivos de base de datos
│  ├─ init.sql                        \# Creación inicial de tablas (DDL).
│  └─ seed.sql                        \# Datos de prueba (DML).
│
├─ docs/                              \# Documentación del proyecto
│  ├─ 01\_project\_structure.md
│  ├─ 11\_DB\_development.md
│  ├─ assets/
│  │   ├─ diagrams/
│  │   └─ wireframes/                 \# Mockups y flujos de usuario.
│  └─ ...
│
├─ **uploads/**                       \# **Archivos Multimedia del Usuario (File System)**
│  └─ music/                          \# Archivos MP3 subidos.
│
├─ **venv/**                          \# Entorno Virtual (ignorado por .gitignore)
│
├─ .env                               \# Variables de entorno (credenciales, etc.)
├─ docker-compose.yml                 \# Configuración del entorno de Docker
├─ Dockerfile                         \# Definición de la imagen PHP
├─ .gitignore
└─ README.md
```
