# Implementación del Backend: Capa de Servicios (CancionManager)

En esta fase, hemos reestructurado el Backend para seguir una arquitectura de 3 capas estricta, desacoplando la lógica de negocio de los controladores.

## 1. Nueva Capa de Servicios: `CancionManager.php`
Ubicación: `backend/services/CancionManager.php`

Este archivo centraliza toda la lógica de negocio relacionada con las canciones.
*   **Responsabilidades**:
    *   Validación de datos (título, artista).
    *   Procesamiento de subida de archivos (audio e imagen) usando `processFile`.
    *   Lógica de parsing (e.g., hashtags).
    *   Coordinación con el Modelo (`Cancion.php`).
*   **Métodos Clave**:
    *   `uploadCancion($data, $files, $idUsuario)`: Maneja el flujo completo de creación.
    *   `searchCanciones($term, $idUsuario)`: Abstrae la búsqueda.

## 2. Refactorización del Controlador (`CancionController.php`)

El controlador `backend/controllers/CancionController.php` se ha convertido en un "Thin Controller".
*   **Antes**: Contenía lógica de validación, manejo de `$_FILES` y llamadas directas al modelo.
*   **Ahora**:
    *   Solo recibe la petición HTTP.
    *   Instancia `CancionManager`.
    *   Delega la acción (ej. `$this->manager->uploadCancion(...)`).
    *   Devuelve la respuesta JSON estándar.

## 3. Modelo (`Cancion.php`)

Se ha verificado que el modelo `backend/models/Cancion.php` se limite estrictamente a **Data Access (SQL)**. No contiene lógica de negocio, solo operaciones CRUD y consultas SQL puras.

---
### Nuevo Flujo de Datos
**Petición** $\rightarrow$ `Router` $\rightarrow$ `CancionController` $\rightarrow$ `CancionManager` $\rightarrow$ `Cancion (Model)` $\rightarrow$ `Base de Datos`
