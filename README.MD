# [Rechord](frontend/assets/branding/logo_large.png)

**Rechord** es una plataforma web integral diseñada para músicos y entusiastas de la guitarra. Permite subir canciones, sincronizar letras y acordes de manera interactiva estilo karaoke/Musixmatch, y socializar con otros usuarios.

---

##  Funcionalidades Principales

###  Gestión de Usuarios
- **Sistema de Cuentas**: Registro y login seguro con hash de contraseñas.
- **Perfil Social**: Personalización de perfil (banner, avatar, biografía).
- **Red Social**: Seguir a otros usuarios y ver sus estadísticas.

###  Canciones y Biblioteca
- **Subida de Música**: Soporte para archivos MP3 con gestión de portadas.
- **Sincronización Interactiva**: Editor avanzado para sincronizar letras y acordes con el audio en tiempo real.
- **Organización**: Creación de carpetas personalizadas y sistema de "Me Gusta".

###  Herramientas Musicales
- **Lector Interactivo**: Reproductor que resalta la letra y el acorde actual.
- **Salas Compartidas**: (Beta) Escucha conjunta y sesiones en tiempo real.

---

## 📚 Documentación e Índice

Navega por la documentación detallada del proyecto en la carpeta `/docs`:

### 📌 Visión General
- [📜 Visión del Proyecto](docs/00_project_overview.md) - Objetivos y alcance.
- [🏗️ Estructura del Proyecto](docs/01_project_structure.md) - Organización de carpetas y archivos.
- [🛠️ Configuración de Desarrollo](docs/07_development_setup.md) - Guía para instalar y ejecutar el entorno.

### 📐 Arquitectura y Diseño
- [🎨 Diseño UI/UX](docs/06_ui_ux_design.md) - Guías de estilo y diseño visual.
- [🖥️ Arquitectura Frontend](docs/05_frontend_architecture.md) - Estructura de la SPA y componentes.
- [⚙️ Arquitectura Backend](docs/04_backend_architecture.md) - Lógica del servidor y controladores.
- [🔌 Referencia API](docs/03_api_reference.md) - Endpoints y consumo de datos.

### 📊 Modelado de Datos
- [📊 Diagramas UML y DB](docs/10_UML_diagram.md) 
- [💾 Desarrollo de Base de Datos](docs/11_DB_development.md) - Notas sobre persistencia y gestión de archivos.

### 🚀 Otros
- [🧪 Testing y Validación](docs/08_testing_and_validation.md) - Estrategias de prueba.
- [🔮 Futuras Funcionalidades](docs/09_future_features.md) - Roadmap del proyecto.
- [📝 Dev Log](docs/12_dev_log_nov_2025.md) - Bitácora de desarrollo.
- [👥 Salas Compartidas](docs/13_shared_sessions.md) - Detalles técnicos de la funcionalidad de WebSocket.

---

## 💻 Stack Tecnológico

| Componente | Tecnologías |
|------------|-------------|
| **Frontend** | JavaScript (SPA), HTML5, CSS3, FontAwesome |
| **Backend** | PHP 8.2 (MVC, REST API) |
| **Base de Datos** | MySQL |
| **Servidor Web** | Apache (XAMPP) |
| **Realtime** | PHP WebSockets (Ratchet) |

---

## 🔧 Instalación y Despliegue

1. Clonar el repositorio en `htdocs` (XAMPP).
2. Importar `rechord.sql` en phpMyAdmin.
3. Configurar la conexión en `backend/db/conexion.php`.
4. Abrir en el navegador: `http://localhost/rechordb/frontend/index.html`.

Para más detalles, consulta la [Guía de Configuración](docs/07_development_setup.md).

---

© 2025 Rechord Team - Proyecto Intermodular
