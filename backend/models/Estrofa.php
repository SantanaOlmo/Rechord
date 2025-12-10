<?php
require_once __DIR__ . '/../../db/conexion.php';

class Estrofa {
    private $pdo;

    public function __construct() {
        $conexion = Conexion::obtenerInstancia();
        $this->pdo = $conexion->obtenerPDO();
    }

    public function obtenerPorCancion($idCancion) {
        $stmt = $this->pdo->prepare("SELECT * FROM ESTROFA WHERE id_cancion = ? ORDER BY orden ASC");
        $stmt->execute([$idCancion]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function crear($idCancion, $contenido, $orden, $tiempoInicio, $tiempoFin) {
        $sql = "INSERT INTO ESTROFA (id_cancion, contenido, orden, tiempo_inicio, tiempo_fin) VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->pdo->prepare($sql);
        if ($stmt->execute([$idCancion, $contenido, $orden, $tiempoInicio, $tiempoFin])) {
            return $this->pdo->lastInsertId();
        }
        return false;
    }

    public function actualizar($id, $contenido, $tiempoInicio, $tiempoFin) {
        $sql = "UPDATE ESTROFA SET contenido = ?, tiempo_inicio = ?, tiempo_fin = ? WHERE id_estrofa = ?";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([$contenido, $tiempoInicio, $tiempoFin, $id]);
    }

    public function eliminar($id) {
        $stmt = $this->pdo->prepare("DELETE FROM ESTROFA WHERE id_estrofa = ?");
        return $stmt->execute([$id]);
    }

    public function eliminarPorCancion($idCancion) {
        $stmt = $this->pdo->prepare("DELETE FROM ESTROFA WHERE id_cancion = ?");
        return $stmt->execute([$idCancion]);
    }
}
