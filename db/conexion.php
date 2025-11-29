<?php
/**
 * Lógica de Conexión a la Base de Datos para ReChord
 * Implementa el patrón Singleton usando PDO.
 */

require_once __DIR__ . '/config.php';

class Conexion {
    private static $instancia = null;
    private $pdo;

    private function __construct() {
        // Construcción del DSN (Data Source Name)
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $opciones = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];

        try {
            $this->pdo = new PDO($dsn, DB_USER, DB_PASS, $opciones);
        } catch (PDOException $e) {
            error_log("Error de conexión a la BD: " . $e->getMessage());
            // En una API, lo mejor es no exponer el error, simplemente terminar la ejecución.
            http_response_code(500); 
            die(json_encode(["error" => "Internal Server Error. Database connection failed."]));
        }
    }

    public static function obtenerInstancia() {
        if (self::$instancia === null) {
            self::$instancia = new self();
        }
        return self::$instancia;
    }

    public function obtenerPDO() {
        return $this->pdo;
    }
    
    // Evita la clonación y la deserialización
    private function __clone() {}
    public function __wakeup() {}
}