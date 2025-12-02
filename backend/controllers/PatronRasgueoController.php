<?php
require_once __DIR__ . '/../utils/helper.php';
require_once __DIR__ . '/../db/conexion.php';

class PatronRasgueoController {
    private $pdo;

    public function __construct() {
        $conexion = Conexion::obtenerInstancia();
        $this->pdo = $conexion->obtenerPDO();
    }

    public function getPatrones() {
        setApiHeaders();
        $stmt = $this->pdo->query("SELECT * FROM PATRON_RASGUEO");
        sendResponse(["patrones" => $stmt->fetchAll()]);
    }

    public function getPatron($id) {
        setApiHeaders();
        $stmt = $this->pdo->prepare("SELECT * FROM PATRON_RASGUEO WHERE id_patron = ?");
        $stmt->execute([$id]);
        $patron = $stmt->fetch();
        if ($patron) {
            sendResponse(["patron" => $patron]);
        } else {
            sendResponse(["message" => "Patrón no encontrado"], 404);
        }
    }

    public function crearPatron($data) {
        setApiHeaders();
        // Implementación básica
        sendResponse(["message" => "Crear patrón no implementado completamente"], 501);
    }

    public function actualizarPatron($data) {
        setApiHeaders();
        sendResponse(["message" => "Actualizar patrón no implementado"], 501);
    }

    public function eliminarPatron($id) {
        setApiHeaders();
        $stmt = $this->pdo->prepare("DELETE FROM PATRON_RASGUEO WHERE id_patron = ?");
        if ($stmt->execute([$id])) {
            sendResponse(["message" => "Patrón eliminado"]);
        } else {
            sendResponse(["message" => "Error al eliminar patrón"], 500);
        }
    }
}
