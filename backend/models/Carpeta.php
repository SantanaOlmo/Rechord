<?php
require_once __DIR__ . '/../../db/conexion.php';

class Carpeta {
    private $pdo;

    public function __construct() {
        $conexion = Conexion::obtenerInstancia();
        $this->pdo = $conexion->obtenerPDO();
    }

    public function crear($idUsuario, $nombre) {
        $stmt = $this->pdo->prepare("INSERT INTO carpeta (id_usuario, nombre) VALUES (?, ?)");
        if ($stmt->execute([$idUsuario, $nombre])) {
            return $this->pdo->lastInsertId();
        }
        return false;
    }

    public function obtenerPorUsuario($idUsuario) {
        $stmt = $this->pdo->prepare("SELECT * FROM carpeta WHERE id_usuario = ? ORDER BY fecha_creacion DESC");
        $stmt->execute([$idUsuario]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function actualizarNombre($idCarpeta, $nombre, $idUsuario) {
        $stmt = $this->pdo->prepare("UPDATE carpeta SET nombre = ? WHERE id_carpeta = ? AND id_usuario = ?");
        return $stmt->execute([$nombre, $idCarpeta, $idUsuario]);
    }

    public function eliminar($idCarpeta, $idUsuario) {
        $stmt = $this->pdo->prepare("DELETE FROM carpeta WHERE id_carpeta = ? AND id_usuario = ?");
        return $stmt->execute([$idCarpeta, $idUsuario]);
    }

    // --- Song Management ---

    public function agregarCancion($idCarpeta, $idCancion) {
        // Get max order
        $stmt = $this->pdo->prepare("SELECT MAX(orden) as max_orden FROM cancion_carpeta WHERE id_carpeta = ?");
        $stmt->execute([$idCarpeta]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $orden = ($row['max_orden'] !== null) ? $row['max_orden'] + 1 : 0;

        $stmt = $this->pdo->prepare("INSERT INTO cancion_carpeta (id_carpeta, id_cancion, orden) VALUES (?, ?, ?)");
        return $stmt->execute([$idCarpeta, $idCancion, $orden]);
    }

    public function obtenerCanciones($idCarpeta) {
        $sql = "SELECT c.*, cc.orden, cc.id_cancion_carpeta 
                FROM cancion c 
                JOIN cancion_carpeta cc ON c.id_cancion = cc.id_cancion 
                WHERE cc.id_carpeta = ? 
                ORDER BY cc.orden ASC";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$idCarpeta]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function quitarCancion($idCarpeta, $idCancion) {
        $stmt = $this->pdo->prepare("DELETE FROM cancion_carpeta WHERE id_carpeta = ? AND id_cancion = ?");
        return $stmt->execute([$idCarpeta, $idCancion]);
    }

    public function actualizarOrdenCanciones($idCarpeta, $items) {
        // items = [{id_cancion: 1, orden: 0}, ...]
        $sql = "UPDATE cancion_carpeta SET orden = ? WHERE id_carpeta = ? AND id_cancion = ?";
        $stmt = $this->pdo->prepare($sql);
        
        $success = true;
        foreach ($items as $item) {
            if (!$stmt->execute([$item['orden'], $idCarpeta, $item['id_cancion']])) {
                $success = false;
            }
        }
        return $success;
    }
}
