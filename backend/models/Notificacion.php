<?php
require_once __DIR__ . '/../core/Database.php';

class Notificacion {
    private $pdo;

    public function __construct() {
        $this->pdo = Database::getInstance();
    }

    public function crear($idUsuario, $mensaje) {
        $stmt = $this->pdo->prepare("INSERT INTO notificaciones (id_usuario, mensaje) VALUES (?, ?)");
        return $stmt->execute([$idUsuario, $mensaje]);
    }

    public function obtenerPorUsuario($idUsuario) {
        $stmt = $this->pdo->prepare("SELECT * FROM notificaciones WHERE id_usuario = ? ORDER BY fecha_creacion DESC");
        $stmt->execute([$idUsuario]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function marcarLeida($idNotificacion, $idUsuario) {
        // Ensure user owns notification logic could be here, but usually controller handles auth
        $stmt = $this->pdo->prepare("UPDATE notificaciones SET leido = 1 WHERE id_notificacion = ? AND id_usuario = ?");
        return $stmt->execute([$idNotificacion, $idUsuario]);
    }

    public function marcarTodasLeidas($idUsuario) {
        $stmt = $this->pdo->prepare("UPDATE notificaciones SET leido = 1 WHERE id_usuario = ?");
        return $stmt->execute([$idUsuario]);
    }
}
