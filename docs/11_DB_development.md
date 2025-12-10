[ Volver al �ndice](index.md)

# DB development

## 📁 1. Estructura de Carpetas

Lo primero es definir dónde se guardarán los archivos multimedia. Crear una carpeta dedicada es la clave para la gestión de tus archivos:

```plaintext
/tu_proyecto_app/
├── public/           <-- Archivos PHP/HTML accesibles públicamente
│   ├── index.php
│   └── css/
├── includes/         <-- Archivos PHP con lógica de servidor
└── **uploads/** <-- **¡Aquí van tus archivos multimedia!**
    ├── **musica/** <-- Para los archivos de audio (.mp3)
    └── **acordes/** <-- Para las imágenes de acordes (.svg, .png)
```

-----

## ⬆️ 2. Lógica de Subida (PHP)

En tu código PHP, la función fundamental es `move_uploaded_file()`, que mueve el archivo temporalmente subido a la ubicación permanente dentro de tu carpeta `uploads/`.

### 🔑 Código Clave para Subida

```php
<?php
// Suponiendo que el input del formulario se llama "archivo_cancion"

// 1. Definir la carpeta de destino y el nombre del archivo
$target_dir = "uploads/musica/";
$file_name = basename($_FILES["archivo_cancion"]["name"]); 
$target_file = $target_dir . $file_name;

// 2. Mover el archivo subido
if (move_uploaded_file($_FILES["archivo_cancion"]["tmp_name"], $target_file)) {
    // Éxito: El archivo fue guardado.
    
    // 3. Guarda la ruta en MySQL
    $path_to_save = $target_file; 
    
    // Inserta $path_to_save en el campo 'archivo_mp3' de tu tabla CANCION.
    echo "El archivo ". $file_name . " ha sido subido y guardado la ruta: " . $path_to_save;
} else {
    // Error en la subida.
    echo "Hubo un error al subir el archivo.";
}
?>
```

-----

## 🔗 3. Recuperación del Archivo

El beneficio de esta estrategia es que tu base de datos solo almacena el texto que le dice a tu aplicación **dónde encontrar el archivo** (la ruta relativa).

Cuando un usuario quiere acceder al archivo, tu aplicación:

1. **Consulta MySQL** y obtiene el valor del campo `archivo_mp3` (ej: `uploads/musica/cancion_titulo.mp3`).
2. **Genera el Enlace** usando ese valor en el atributo `src` de HTML:

<!-- end list -->

```html
<audio controls>
    <source src="<?php echo $path_from_mysql; ?>" type="audio/mpeg">
    Tu navegador no soporta el elemento de audio.
</audio>

<img src="<?php echo $path_from_mysql_acorde; ?>" alt="Diagrama de acorde">
```

-----

## 🔒 4. Consideraciones de Seguridad (Importante)

Para proteger tu aplicación, debes validar y asegurar los archivos subidos:

* **Validación de Tipo:** Siempre verifica que el archivo subido coincida con el tipo MIME esperado (ej. `audio/mpeg` para música).
* **Renombrar Archivos:** Es una práctica esencial renombrar el archivo subido para evitar colisiones de nombres y ataques de inyección de rutas.

<!-- end list -->

```php
// Ejemplo de renombrado antes de mover el archivo
// Genera un nombre único con el timestamp y mantiene la extensión original.
$extension = pathinfo($file_name, PATHINFO_EXTENSION);
$new_file_name = uniqid() . "-" . time() . "." . $extension; 
$target_file = $target_dir . $new_file_name;
```

