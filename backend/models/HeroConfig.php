<?php
require_once __DIR__ . '/../../db/conexion.php';

class HeroConfig {
    private $pdo;
    private $table_name = "hero_videos";

    public $id_hero;
    public $titulo;
    public $ruta_video;
    public $activo;
    public $fecha_subida;

    public function __construct() {
        $conexion = Conexion::obtenerInstancia();
        $this->pdo = $conexion->obtenerPDO();
    }

    public function crear() {
        $query = "INSERT INTO " . $this->table_name . " (titulo, ruta_video, activo) VALUES (:titulo, :ruta_video, 0)";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(":titulo", $this->titulo);
        $stmt->bindParam(":ruta_video", $this->ruta_video);
        if ($stmt->execute()) {
             $this->id_hero = $this->pdo->lastInsertId();
             return true;
        }
        return false;
    }

    // Get all videos
    public function obtenerTodos() {
        // Order by custom order then date
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY orden ASC, fecha_subida DESC";
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get All Active Videos
    public function obtenerActivos() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE activo = 1 ORDER BY orden ASC, fecha_subida DESC";
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Toggle Active Status (Non-exclusive)
    public function toggleActivo($id) {
        $query = "UPDATE " . $this->table_name . " SET activo = NOT activo WHERE id_hero = :id";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(":id", $id);
        if ($stmt->execute()) return true;
        return false;
    }

    public function eliminar($id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE id_hero = :id";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(":id", $id);
        if ($stmt->execute()) return true;
        return false;
    }

    public function actualizarOrden($id, $orden) {
        $query = "UPDATE " . $this->table_name . " SET orden = :orden WHERE id_hero = :id";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->bindParam(":orden", $orden);
        return $stmt->execute();
    }

    public function obtenerPorId($id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id_hero = :id LIMIT 1";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>
