<?php
require_once __DIR__ . '/../utils/helper.php';
require_once __DIR__ . '/../db/conexion.php';

class CarpetaController {
    private $pdo;

    public function __construct() {
        $conexion = Conexion::obtenerInstancia();
        $this->pdo = $conexion->obtenerPDO();
    }

    public function getCarpetas() {
        setApiHeaders();
        $stmt = $this->pdo->query("SELECT * FROM CARPETA");
        sendResponse(["carpetas" => $stmt->fetchAll()]);
    }

    public function getCarpeta($id) {
        setApiHeaders();
        $stmt = $this->pdo->prepare("SELECT * FROM CARPETA WHERE id_carpeta = ?");
        $stmt->execute([$id]);
        $carpeta = $stmt->fetch();
        if ($carpeta) {
            sendResponse(["carpeta" => $carpeta]);
        } else {
            sendResponse(["message" => "Carpeta no encontrada"], 404);
        }
    }

    public function crearCarpeta($data) {
        setApiHeaders();
        if (!isset($data['nombre'], $data['id_usuario'])) {
            sendResponse(["message" => "Datos incompletos"], 400);
        }
        $stmt = $this->pdo->prepare("INSERT INTO CARPETA (nombre, id_usuario) VALUES (?, ?)");
        if ($stmt->execute([$data['nombre'], $data['id_usuario']])) {
            sendResponse(["message" => "Carpeta creada", "id" => $this->pdo->lastInsertId()], 201);
        } else {
            sendResponse(["message" => "Error al crear carpeta"], 500);
        }
    }

    public function actualizarCarpeta($data) {
        setApiHeaders();
        sendResponse(["message" => "Actualizar carpeta no implementado"], 501);
    }

    public function eliminarCarpeta($id) {
        setApiHeaders();
        $stmt = $this->pdo->prepare("DELETE FROM CARPETA WHERE id_carpeta = ?");
        if ($stmt->execute([$id])) {
            sendResponse(["message" => "Carpeta eliminada"]);
        } else {
            sendResponse(["message" => "Error al eliminar carpeta"], 500);
        }
    }
}
