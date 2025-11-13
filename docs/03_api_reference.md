[![back](assets/icons/back.png)](00_project_overview.md)
# API REST
### ¿Qué es una API REST?

API significa Application Programming Interface: es una forma de que diferentes programas “hablen” entre sí.
REST significa Representational State Transfer: es un estilo arquitectónico para construir APIs sobre HTTP.

En pocas palabras: una API REST es un servicio web al que puedes enviar peticiones HTTP y recibir respuestas, generalmente en JSON, para interactuar con datos.

### Cómo funciona

Una API REST usa recursos, que normalmente son los objetos de tu aplicación (usuarios, canciones, acordes…). Cada recurso tiene una URL única:

````bash
GET    /usuarios          → obtener todos los usuarios
GET    /usuarios/1        → obtener usuario con id 1
POST   /usuarios          → crear un nuevo usuario
PUT    /usuarios/1        → actualizar usuario con id 1
DELETE /usuarios/1        → eliminar usuario con id 1
````

Acciones principales: 
| Verbo  | Uso                     |
| ------ | ----------------------- |
| GET    | Leer datos              |
| POST   | Crear datos             |
| PUT    | Actualizar datos        |
| PATCH  | Actualizar parcialmente |
| DELETE | Eliminar datos          |
