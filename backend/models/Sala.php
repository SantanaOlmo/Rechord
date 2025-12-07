<?php
require_once __DIR__ . '/../../db/conexion.php';

class Sala {
    private $pdo;

    public function __construct() {
        $conexion = Conexion::obtenerInstancia();
        $this->pdo = $conexion->obtenerPDO();
    }

    public function crear($codigo, $idMaestro) {
        $sql = "INSERT INTO SALAS (codigo_sala, id_maestro, fecha_creacion, estado) VALUES (?, ?, NOW(), 'activa')";
        $stmt = $this->pdo->prepare($sql);
        if ($stmt->execute([$codigo, $idMaestro])) {
            return $this->pdo->lastInsertId();
        }
        return false;
    }

    public function obtenerPorCodigo($codigo) {
        $stmt = $this->pdo->prepare("SELECT * FROM SALAS WHERE codigo_sala = ? AND estado = 'activa'");
        $stmt->execute([$codigo]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function deshabilitar($codigo) {
        $stmt = $this->pdo->prepare("UPDATE SALAS SET estado = 'cerrada' WHERE codigo_sala = ?");
        return $stmt->execute([$codigo]);
    }

    public function actualizarEstado($codigo, $idCancion, $posicion, $isPlaying) {
        // Podríamos guardar el estado actual de la sala para usuarios que entran tarde
        $sql = "UPDATE SALAS SET current_song_id = ?, current_position = ?, is_playing = ? WHERE codigo_sala = ?";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([$idCancion, $posicion, $isPlaying ? 1 : 0, $codigo]);
    }
}
