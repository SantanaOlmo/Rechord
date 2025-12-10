<?php
require_once __DIR__ . '/../models/Chat.php';
require_once __DIR__ . '/../utils/helper.php';

class ChatController {
    private $chatModel;

    public function __construct() {
        $this->chatModel = new Chat();
    }

    public function getConversations($userId) {
        setApiHeaders();
        if (!$userId) {
            sendResponse(["message" => "Usuario no identificado"], 401);
        }
        $conversations = $this->chatModel->getConversations($userId);
        sendResponse(["conversations" => $conversations], 200);
    }

    public function getMessages($conversationId, $userId) {
        setApiHeaders();
        if (!$userId) {
            sendResponse(["message" => "Usuario no identificado"], 401);
        }
        $messages = $this->chatModel->getMessages($conversationId, $userId);
        if ($messages === false) {
            sendResponse(["message" => "Acceso denegado o conversación no existe"], 403);
        }
        sendResponse(["messages" => $messages], 200);
    }

    public function sendMessage($data = null) {
        setApiHeaders();
        // Fallback if data not passed (though chat.php passes it)
        if ($data === null) {
             $data = json_decode(file_get_contents("php://input"), true);
        }

        // Ensure data is array
        if (is_object($data)) {
            $data = (array)$data;
        }
        
        if (!isset($data['sender_id']) || !isset($data['receiver_id']) || !isset($data['content'])) {
            sendResponse(["message" => "Datos incompletos"], 400);
            return;
        }

        // Logic: If sender is Admin, swap to 'Rechord' System User
        $senderId = $data['sender_id'];
        
        try {
            // Check if sender is admin
            $role = $this->chatModel->getRole($senderId);

            if ($role === 'admin') {
                // Find system user ID
                $sysId = $this->chatModel->getSystemUserId();
                
                if ($sysId) {
                    $senderId = $sysId; // Masquerade as Rechord
                }
            }
        } catch (Throwable $e) {
            // Log error if needed
        }

        $msgId = $this->chatModel->sendMessage($senderId, $data['receiver_id'], $data['content']);
        
        if ($msgId) {
            sendResponse(["message" => "Mensaje enviado", "id_mensaje" => $msgId], 201);
        } else {
            sendResponse(["message" => "Error al enviar mensaje"], 500);
        }
    }

    public function markRead($data) {
        setApiHeaders();
        if (!isset($data['conversation_id'], $data['user_id'])) {
            sendResponse(["message" => "Faltan datos"], 400);
        }
        
        $this->chatModel->markAsRead($data['conversation_id'], $data['user_id']);
        sendResponse(["message" => "Leído"], 200);
    }

    public function getUnreadCount($userId) {
        setApiHeaders();
        if (!$userId) {
            sendResponse(["message" => "Usuario no identificado"], 401);
        }
        $count = $this->chatModel->getUnreadCount($userId);
        sendResponse(["count" => $count], 200);
    }
}
