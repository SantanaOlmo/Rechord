<?php
require_once __DIR__ . '/../../db/conexion.php';

class HomeConfig {
    private $pdo;

    public function __construct() {
        $conexion = Conexion::obtenerInstancia();
        $this->pdo = $conexion->obtenerPDO();
    }

    // Modificado: Obtener TODAS las configuraciones (para admin)
    public function obtenerTodasConfiguraciones() {
        $stmt = $this->pdo->query("SELECT * FROM HOME_CONFIG ORDER BY orden ASC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Original: Solo activas para el Home público
    public function obtenerConfiguracion() {
        $stmt = $this->pdo->query("SELECT * FROM HOME_CONFIG WHERE activo = 1 ORDER BY orden ASC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function agregarCategoria($tipo, $valor, $titulo, $orden) {
        $stmt = $this->pdo->prepare("INSERT INTO HOME_CONFIG (tipo, valor, titulo_mostrar, orden, activo) VALUES (?, ?, ?, ?, 1)");
        return $stmt->execute([$tipo, $valor, $titulo, $orden]);
    }

    public function eliminarCategoria($id) {
        $stmt = $this->pdo->prepare("DELETE FROM HOME_CONFIG WHERE id_config = ?");
        return $stmt->execute([$id]);
    }

    public function actualizarOrden($id, $nuevoOrden) {
        $stmt = $this->pdo->prepare("UPDATE HOME_CONFIG SET orden = ? WHERE id_config = ?");
        return $stmt->execute([$nuevoOrden, $id]);
    }

    public function actualizarCategoria($id, $tipo, $valor, $titulo, $activo = null) {
        if ($activo !== null) {
            $stmt = $this->pdo->prepare("UPDATE HOME_CONFIG SET tipo = ?, valor = ?, titulo_mostrar = ?, activo = ? WHERE id_config = ?");
            return $stmt->execute([$tipo, $valor, $titulo, $activo, $id]);
        } else {
            $stmt = $this->pdo->prepare("UPDATE HOME_CONFIG SET tipo = ?, valor = ?, titulo_mostrar = ? WHERE id_config = ?");
            return $stmt->execute([$tipo, $valor, $titulo, $id]);
        }
    }

    public function toggleVisibilidad($id, $estado) {
        $stmt = $this->pdo->prepare("UPDATE HOME_CONFIG SET activo = ? WHERE id_config = ?");
        return $stmt->execute([$estado, $id]);
    }
}
