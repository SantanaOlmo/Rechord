<?php
require_once __DIR__ . '/../utils/helper.php';
require_once __DIR__ . '/../db/conexion.php';

class SeguirController {
    private $pdo;

    public function __construct() {
        $conexion = Conexion::obtenerInstancia();
        $this->pdo = $conexion->obtenerPDO();
    }

    public function seguirUsuario($data) {
        setApiHeaders();
        if (!isset($data['id_seguidor'], $data['id_seguido'])) {
            sendResponse(["message" => "Datos incompletos"], 400);
        }

        $stmt = $this->pdo->prepare("INSERT INTO SEGUIR_USUARIO (id_usuario_seguidor, id_usuario_seguido) VALUES (?, ?)");
        try {
            if ($stmt->execute([$data['id_seguidor'], $data['id_seguido']])) {
                sendResponse(["message" => "Usuario seguido"], 201);
            }
        } catch (PDOException $e) {
            sendResponse(["message" => "Error al seguir usuario: " . $e->getMessage()], 500);
        }
    }

    public function dejarDeSeguir($id_seguidor, $id_seguido) {
        setApiHeaders();
        $stmt = $this->pdo->prepare("DELETE FROM SEGUIR_USUARIO WHERE id_usuario_seguidor = ? AND id_usuario_seguido = ?");
        if ($stmt->execute([$id_seguidor, $id_seguido])) {
            sendResponse(["message" => "Dejado de seguir"]);
        } else {
            sendResponse(["message" => "Error al dejar de seguir"], 500);
        }
    }
}
