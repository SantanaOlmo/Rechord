<?php
require_once __DIR__ . '/../models/Notificacion.php';
require_once __DIR__ . '/../utils/helper.php';

class NotificacionController {
    private $notificacionModel;

    public function __construct() {
        $this->notificacionModel = new Notificacion();
    }

    public function getMisNotificaciones() {
        setApiHeaders();
        // Assuming auth check is done before or we check 'viewer_id' (simulated auth)
        // Ideally we use a Token. For this project, we might pass id via GET or assume some auth context.
        // Let's rely on GET param 'user_id' for simplicity as per existing pattern or headers.
        
        $userId = $_GET['user_id'] ?? null; 
        if (!$userId) {
            sendResponse(["message" => "Usuario no identificado"], 401);
        }

        $notificaciones = $this->notificacionModel->obtenerPorUsuario($userId);
        sendResponse(["notifications" => $notificaciones], 200);
    }

    public function enviar($data) {
        setApiHeaders();
        if (!isset($data['id_usuario'], $data['mensaje'])) {
            sendResponse(["message" => "Faltan datos"], 400);
        }

        if ($this->notificacionModel->crear($data['id_usuario'], $data['mensaje'])) {
            sendResponse(["message" => "Notificación enviada"], 201);
        } else {
            sendResponse(["message" => "Error al enviar"], 500);
        }
    }

    public function marcarLeida($data) {
        setApiHeaders();
        if (!isset($data['id_notificacion'], $data['id_usuario'])) {
            sendResponse(["message" => "Faltan datos"], 400);
        }

        if ($this->notificacionModel->marcarLeida($data['id_notificacion'], $data['id_usuario'])) {
            sendResponse(["message" => "Marcada como leída"], 200);
        } else {
            sendResponse(["message" => "Error al actualizar"], 500);
        }
    }
}
