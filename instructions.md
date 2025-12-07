# Instrucciones de Uso: Funcionalidad Social y Sincronización

Aquí se detalla cómo utilizar las nuevas funciones sociales implementadas (Búsqueda de Usuarios) y el sistema de sincronización (Modo Fiesta).

## 1. Búsqueda de Usuarios

Ahora puedes encontrar a otros miembros de la plataforma para conectar con ellos.

*   **¿Cómo buscar?**:
    1.  En la barra superior (Dashboard Header), haz clic en el botón **"Buscar usuarios..."**.
    2.  Alternativamente, puedes escribir directamente en el cuadro de búsqueda si está visible.
    3.  Se abrirá un cuadro de diálogo flotante.
    4.  Escribe el nombre o (parte del email) del usuario.
    5.  Aparecerá una lista de coincidencias en tiempo real.

*   **Ver Perfil y Seguir**:
    *   Haz clic en cualquiera de los usuarios de la lista de resultados.
    *   Serás redirigido a su **Perfil Público**.
    *   En su perfil, podrás ver sus detalles. (La funcionalidad de "Seguir" se habilitará visualmente en futuras actualizaciones sobre el componente de Perfil).

## 2. Modo Fiesta (Sincronización)

El núcleo social de Rechord es compartir la música en tiempo real.

*   **Crear una Sala**:
    1.  Haz clic en el icono de "Sala" (o "Party Mode") en la interfaz.
    2.  Selecciona "Crear Sala". Obtendrás un código único (ej. `A1B2`).
    3.  Comparte este código con tus amigos.

*   **Unirse a una Sala**:
    1.  Tus amigos deben introducir ese código en la opción "Unirse a Sala".
    2.  Una vez unidos, **tú tienes el control maestro**.
    3.  Cuando reproduces una canción, pausas, o cambias de pista, **ocurre instantáneamente en sus dispositivos**.

## 3. Notas Técnicas para el Desarrollador

*   La búsqueda utiliza el endpoint `/api/usuarios.php?search=termino`.
*   El frontend consume esto mediante `usuarioService.js`.
*   La UI de búsqueda es un componente independiente `UserSearchModal.js` inyectado globalmente en la app.