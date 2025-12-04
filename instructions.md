## ⚙️ INSTRUCCIONES OBLIGATORIAS PARA ANTIGRAVITY

**Contexto Primario:**
Estás trabajando en una SPA (Rechord) que gestiona canciones, letras y acordes para músicos. El proyecto debe ser **altamente modular** y con código trazable.

### 📜 RESUMEN DEL PROYECTO (Rechord)
Rechord es una SPA para músicos que gestiona canciones, letras y acordes, permitiendo sincronización dinámica tipo karaoke (Musixmatch). Usa una API REST en PHP/MySQL para usuarios, canciones, acordes, y gestión de archivos MP3. El objetivo es crear una herramienta funcional y modular para aprendizaje y creación musical.

---

### 🚨 REGLAS DE OPERACIÓN OBLIGATORIAS:

**Antes de cualquier respuesta o modificación:**

1.  **Revisión de Contexto:** Siempre consulta los archivos `project_structure.json` y `db_schema.md` para entender el estado actual del proyecto y la base de datos.

2.  **Modularización y Longitud de Código (NUEVO):**
    * **Ningún archivo de código** (JS/TS, PHP, etc.) debe **exceder las 200 líneas**.
    * Si se supera este límite o se acerca, el archivo debe ser **subdividido y modularizado** en archivos más pequeños inmediatamente.

3.  **Ejecución: Actualización de Estructuras (OBLIGATORIO):**
    * **Si creas, modificas o eliminas archivos:** Debes **actualizar el archivo `project_structure.json`** para reflejar exactamente el nuevo árbol de directorios y archivos.
    * **Si creas, modificas o eliminas tablas o atributos en la DB:** Debes **actualizar el archivo `db_schema.md`** con la sintaxis de Mermaid ERD para que refleje el nuevo esquema de la base de datos.

4.  **Ejecución: Gestión de Versiones (OBLIGATORIO):**
    * **Después de cada conjunto de cambios:** Debes generar la secuencia completa de comandos de Git.

    > **Secuencia de Git (OBLIGATORIA):**
    > 1. `git add .`
    > 2. `git commit -m "Mensaje descriptivo del cambio"`
    > 3. `git push`

5.  **Confirmación Final:** Siempre termina tu respuesta con la secuencia de comandos de Git completa que se debe ejecutar y una breve confirmación de que se han cumplido los pasos de actualización de estructura.

---

### 💡 Ejemplo de Interacción:

**Prompt del Usuario:** "Añade un campo 'rol' (VARCHAR) a la tabla USUARIOS y actualiza la entidad de la SPA para usarlo."

**Respuesta ESPERADA de Antigravity:**

1.  *Código del archivo de la SPA modificado (con modularización si es necesario).*
2.  *Comando SQL para modificar la tabla.*
3.  **Actualización de `db_schema.md`:** La tabla `USUARIOS` incluirá el campo `rol`.
4.  **Actualización de `project_structure.json`:** Si el cambio implica nuevos archivos o rutas, se actualizarán.
5.  **Secuencia de Git:**
    * `git add .`
    * `git commit -m "feat(db,users): Añadido campo 'rol' a la tabla USUARIOS y actualizado la entidad del frontend. Actualizado db_schema.md."`
    * `git push`