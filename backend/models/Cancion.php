<?php
require_once __DIR__ . '/../../db/conexion.php';

class Cancion {
    private $pdo;

    public function __construct() {
        $conexion = Conexion::obtenerInstancia();
        $this->pdo = $conexion->obtenerPDO();
    }

    public function crear($id_usuario, $titulo, $artista, $nivel, $rutaMp3, $rutaImagen = null) {
        $sql = "INSERT INTO CANCION (id_usuario, titulo, artista, nivel, ruta_mp3, ruta_imagen, fecha_creacion) 
                VALUES (?, ?, ?, ?, ?, ?, NOW())";
        
        $stmt = $this->pdo->prepare($sql);
        
        if ($stmt->execute([$id_usuario, $titulo, $artista, $nivel, $rutaMp3, $rutaImagen])) {
            return $this->pdo->lastInsertId();
        }
        return false;
    }

    public function obtenerPorId($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM CANCION WHERE id_cancion = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function obtenerTodas($idUsuario = null) {
        $sql = "SELECT c.*";
        
        if ($idUsuario) {
            $sql .= ", (SELECT COUNT(*) FROM LIKE_CANCION l WHERE l.id_cancion = c.id_cancion AND l.id_usuario = ?) as is_liked";
        } else {
            $sql .= ", 0 as is_liked";
        }
        
        $sql .= " FROM CANCION c ORDER BY c.fecha_creacion DESC";
        
        $stmt = $this->pdo->prepare($sql);
        
        if ($idUsuario) {
            $stmt->execute([$idUsuario]);
        } else {
            $stmt->execute();
        }
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function toggleLike($idUsuario, $idCancion) {
        // Verificar si ya existe el like
        $stmt = $this->pdo->prepare("SELECT id_like FROM LIKE_CANCION WHERE id_usuario = ? AND id_cancion = ?");
        $stmt->execute([$idUsuario, $idCancion]);
        $like = $stmt->fetch();

        if ($like) {
            // Quitar like
            $stmt = $this->pdo->prepare("DELETE FROM LIKE_CANCION WHERE id_usuario = ? AND id_cancion = ?");
            $stmt->execute([$idUsuario, $idCancion]);
            return false; // Liked = false
        } else {
            // Dar like
            $stmt = $this->pdo->prepare("INSERT INTO LIKE_CANCION (id_usuario, id_cancion) VALUES (?, ?)");
            $stmt->execute([$idUsuario, $idCancion]);
            return true; // Liked = true
        }
    }

    public function eliminar($id) {
        $stmt = $this->pdo->prepare("DELETE FROM CANCION WHERE id_cancion = ?");
        return $stmt->execute([$id]);
    }
}
