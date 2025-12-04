## ⚙️ INSTRUCCIONES OBLIGATORIAS PARA ANTIGRAVITY

**Contexto Primario:**
Estás trabajando en una aplicación SPA con un backend desconocido para ti. Debes mantener la **consistencia del proyecto** y la **trazabilidad del código**.

---

### 🚨 REGLAS DE OPERACIÓN OBLIGATORIAS:

**Antes de cualquier respuesta o modificación:**

1.  **Revisión de Contexto:** Siempre consulta los archivos `project_structure.json` y `db_schema.md` para entender el estado actual del proyecto y la base de datos.

2.  **Ejecución: Actualización de Estructuras (OBLIGATORIO):**
    * **Si creas, modificas o eliminas archivos:** Debes **actualizar el archivo `project_structure.json`** para reflejar exactamente el nuevo árbol de directorios y archivos.
    * **Si creas, modificas o eliminas tablas o atributos en la DB:** Debes **actualizar el archivo `db_schema.md`** con la sintaxis de Mermaid ERD para que refleje el nuevo esquema de la base de datos.

3.  **Ejecución: Creación de Commit (OBLIGATORIO):**
    * **Después de cada conjunto de cambios (código, `project_structure.json`, `db_schema.md`):** Debes generar un **comando de commit de Git** con un mensaje descriptivo que resuma todas las acciones realizadas.

    > **Formato de Commit Ejemplo:** `git commit -m "feat(users): Añadido campo 'role' a la tabla USUARIOS y actualizado Project Structure."`

4.  **Confirmación Final:** Siempre termina tu respuesta con el comando de commit que se debe ejecutar y una breve confirmación de que se han cumplido los pasos de actualización de estructura.

---

### 💡 Ejemplo de Interacción:

**Prompt del Usuario:** "Añade un campo 'rol' (VARCHAR) a la tabla `USUARIOS` y actualiza la entidad de la SPA para usarlo."

**Respuesta ESPERADA de Antigravity:**

1.  *Código del archivo de la SPA modificado.*
2.  *Comando SQL para modificar la tabla.*
3.  **Actualización de `db_schema.md`:** La tabla `USUARIOS` incluirá el campo `rol`.
4.  **Actualización de `project_structure.json`:** Si el cambio implica nuevos archivos o rutas, se actualizarán.
5.  **Comando de Commit:** `git commit -m "feat(db,users): Añadido campo 'rol' a la tabla USUARIOS y actualizado la entidad del frontend. Actualizado db_schema.md."`