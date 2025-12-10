[ Volver al �ndice](index.md)

[![back](assets/icons/back.png)](00_project_overview.md)

# 🛠️ Guía de Configuración de Base de Datos

Esta guía explica cómo configurar la conexión a la base de datos MySQL para el proyecto **Rechord**. 

El sistema utiliza **PHP Data Objects (PDO)** para una conexión segura y eficiente, implementando el patrón de diseño **Singleton** para evitar múltiples instancias de conexión simultáneas.

---

## 1. Archivos de Configuración

La configuración de la base de datos se encuentra en la carpeta `/db` en la raíz del proyecto.

### 📄 `db/config.php`
Este archivo contiene las credenciales de acceso. **Nunca** subas este archivo con credenciales de producción a un repositorio público.

```php
<?php
// DEFINICIÓN DE CONSTANTES DE CONEXIÓN
define('DB_HOST', '127.0.0.1');     // Host de la base de datos (localhost)
define('DB_NAME', 'rechord');       // Nombre de la base de datos
define('DB_USER', 'rechord_user');  // Usuario de MySQL
define('DB_PASS', 'tu_contraseña'); // Contraseña del usuario
define('DB_CHARSET', 'utf8mb4');    // Charset para soporte de emojis y caracteres especiales

// Construcción del DSN (Data Source Name) para PDO
$dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
?>
```

### 📄 `db/conexion.php`
Este archivo maneja la lógica de conexión. Utiliza el patrón Singleton para asegurar que solo exista una instancia de la conexión a la base de datos durante la ejecución del script.

**Características clave:**
*   **Singleton:** El método estático `obtenerInstancia()` garantiza una única conexión.
*   **Manejo de Errores:** Captura excepciones `PDOException` y devuelve un error 500 genérico al cliente por seguridad.
*   **Configuración PDO:**
    *   `PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION`: Lanza excepciones en caso de error SQL.
    *   `PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC`: Devuelve resultados como arrays asociativos.

---

## 2. Cómo crear la Base de Datos

Para inicializar la base de datos en un entorno local (XAMPP/WAMP):

1.  Abre **phpMyAdmin** (http://localhost/phpmyadmin).
2.  Crea una nueva base de datos llamada `rechord`.
3.  Ve a la pestaña **Importar**.
4.  Selecciona el archivo `rechord.sql` ubicado en la raíz del proyecto.
5.  Haz clic en **Continuar**.

---

## 3. Ejemplo de Uso en el Código

Para utilizar la conexión en un Modelo (por ejemplo, `Usuario.php`), simplemente requerimos el archivo y obtenemos la instancia:

```php
require_once __DIR__ . '/../../db/conexion.php'; // Ajustar ruta según ubicación

class Usuario {
    private $pdo;

    public function __construct() {
        // Obtener la instancia única de la conexión
        $conexion = Conexion::obtenerInstancia();
        $this->pdo = $conexion->obtenerPDO();
    }

    public function obtenerUsuarios() {
        $stmt = $this->pdo->query("SELECT * FROM usuario");
        return $stmt->fetchAll();
    }
}
```

