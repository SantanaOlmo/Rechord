# [Rechord](http://localhost/rechordb/frontend/index.html)

Rechord es una aplicación web para músicos y amantes de la guitarra que permite subir canciones, añadirles letras y acordes, y visualizarlas de forma dinámica al estilo Musixmatch. Los usuarios pueden organizar canciones en carpetas, seguir a otros músicos, marcar favoritos y editar la sincronización de letras y acordes con el audio. La plataforma combina una interfaz intuitiva con funcionalidades avanzadas para generar y gestionar acordes, facilitando la práctica y creación musical de manera colaborativa.

## Funcionalidades principales

1. **Gestión de usuarios**
   - Registro y login seguro con PHP y sesiones.
   - Seguimiento de otros usuarios.
   - Carpetas personales para organizar canciones.
   - Canciones favoritas (likes).

2. **Canciones**
   - Subida de archivos MP3.
   - Subida o creación de letras.
   - Creación y vinculación de acordes a estrofas.
   - Sincronización letra-acorde con audio (lector interactivo tipo karaoke).
   - Clasificación por artista y nivel (fácil/intermedio/difícil).
   - Organización en carpetas.

3. **Acordes**
   - Creación de acordes propios o importación de existentes.
   - Vinculación de acordes a canciones y estrofas.
   - Posibilidad futura de crear tablaturas.

## Base de datos

Se utilizará MySQL para gestionar usuarios, canciones, acordes, estrofas, carpetas, likes y relaciones de seguimiento entre usuarios. La estructura incluirá tablas intermedias para relaciones muchos a muchos, como **CancionCarpeta** y **SeguirUsuario**.

## Frontend

- SPA en JavaScript consumiendo la API REST en PHP.  
- Interfaz interactiva para sincronización de letras y acordes.  
- Diseño responsivo y multimedia (hover, transiciones, audio).  

## Backend

- PHP y MySQL.  
- Endpoints REST en JSON para todas las operaciones CRUD.  
- Seguridad: contraseñas hasheadas, manejo de sesiones.  

## Objetivo

Crear una herramienta **original y funcional** que combine aprendizaje musical, creatividad y socialización, cumpliendo con los requisitos técnicos y de diseño del proyecto intermodular.
