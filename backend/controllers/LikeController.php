<?php
require_once __DIR__ . '/../utils/helper.php';
require_once __DIR__ . '/../../db/conexion.php';

class LikeController {
    private $pdo;

    public function __construct() {
        $conexion = Conexion::obtenerInstancia();
        $this->pdo = $conexion->obtenerPDO();
    }

    public function darLike($data) {
        setApiHeaders();
        if (!isset($data['id_usuario'], $data['id_cancion'])) {
            sendResponse(["message" => "Datos incompletos"], 400);
        }
        
        // Verificar si ya existe el like
        $check = $this->pdo->prepare("SELECT id_like FROM LIKE_CANCION WHERE id_usuario = ? AND id_cancion = ?");
        $check->execute([$data['id_usuario'], $data['id_cancion']]);
        if ($check->fetch()) {
            sendResponse(["message" => "Ya has dado like a esta canción"], 409);
        }

        $stmt = $this->pdo->prepare("INSERT INTO LIKE_CANCION (id_usuario, id_cancion) VALUES (?, ?)");
        if ($stmt->execute([$data['id_usuario'], $data['id_cancion']])) {
            sendResponse(["message" => "Like agregado"], 201);
        } else {
            sendResponse(["message" => "Error al dar like"], 500);
        }
    }

    public function quitarLike($id_usuario, $id_cancion) {
        setApiHeaders();
        $stmt = $this->pdo->prepare("DELETE FROM LIKE_CANCION WHERE id_usuario = ? AND id_cancion = ?");
        if ($stmt->execute([$id_usuario, $id_cancion])) {
            sendResponse(["message" => "Like eliminado"]);
        } else {
            sendResponse(["message" => "Error al quitar like"], 500);
        }
    }

    public function getLikes($id_cancion) {
        setApiHeaders();
        $stmt = $this->pdo->prepare("SELECT COUNT(*) as total FROM LIKE_CANCION WHERE id_cancion = ?");
        $stmt->execute([$id_cancion]);
        $result = $stmt->fetch();
        sendResponse(["total_likes" => $result['total']]);
    }

    public function checkLike($id_usuario, $id_cancion) {
        setApiHeaders();
        $stmt = $this->pdo->prepare("SELECT id_like FROM LIKE_CANCION WHERE id_usuario = ? AND id_cancion = ?");
        $stmt->execute([$id_usuario, $id_cancion]);
        if ($stmt->fetch()) {
            sendResponse(["liked" => true]);
        } else {
            sendResponse(["liked" => false]);
        }
    }

    public function getUserLikes($id_usuario) {
        setApiHeaders();
        $stmt = $this->pdo->prepare("SELECT id_cancion FROM LIKE_CANCION WHERE id_usuario = ?");
        $stmt->execute([$id_usuario]);
        $result = $stmt->fetchAll(PDO::FETCH_COLUMN);
        sendResponse($result); // Returns array of song IDs
    }
}
