<?php
require_once __DIR__ . '/../../db/conexion.php';

class Chat {
    private $pdo;

    public function __construct() {
        $conexion = Conexion::obtenerInstancia();
        $this->pdo = $conexion->obtenerPDO();
    }

    public function getRole($userId) {
        $stmt = $this->pdo->prepare("SELECT rol FROM usuario WHERE id_usuario = ?");
        $stmt->execute([$userId]);
        return $stmt->fetchColumn();
    }

    public function getSystemUserId() {
        $stmt = $this->pdo->prepare("SELECT id_usuario FROM usuario WHERE nombre = 'Rechord' LIMIT 1");
        $stmt->execute();
        return $stmt->fetchColumn();
    }

    public function getConversations($userId) {
        // 1. Ensure System Chat exists
        $this->ensureSystemChat($userId);

        $sql = "
            SELECT 
                c.id_conversacion, 
                c.fecha_ultima_actividad,
                u.id_usuario as other_id, 
                u.nombre as other_name, 
                u.foto_perfil as other_photo,
                u.rol as other_role,
                m.contenido as last_message, 
                m.fecha_envio as last_message_time,
                m.id_usuario_emisor as last_message_sender,
                (SELECT COUNT(*) FROM chat_mensajes cm 
                 WHERE cm.id_conversacion = c.id_conversacion 
                 AND cm.id_usuario_emisor != ? 
                 AND cm.leido = 0) as unread_count
            FROM chat_conversaciones c
            JOIN chat_participantes cp1 ON c.id_conversacion = cp1.id_conversacion
            JOIN chat_participantes cp2 ON c.id_conversacion = cp2.id_conversacion
            JOIN usuario u ON cp2.id_usuario = u.id_usuario
            LEFT JOIN chat_mensajes m ON m.id_mensaje = (
                SELECT id_mensaje FROM chat_mensajes 
                WHERE id_conversacion = c.id_conversacion 
                ORDER BY fecha_envio DESC LIMIT 1
            )
            WHERE cp1.id_usuario = ? 
            AND cp2.id_usuario != ?
            ORDER BY c.fecha_ultima_actividad DESC
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$userId, $userId, $userId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    private function ensureSystemChat($userId) {
        try {
            // Find Rechord System User
            $stmt = $this->pdo->prepare("SELECT id_usuario FROM usuario WHERE nombre = 'Rechord' LIMIT 1");
            $stmt->execute();
            $systemId = $stmt->fetchColumn();

            if (!$systemId || $systemId == $userId) return;

            // Check if conversation exists
            $exists = $this->getConversationId($userId, $systemId);
            
            if (!$exists) {
                // Determine initial welcome message
                $isSystem = ($systemId == $userId) ? false : true; // Should always be true here
                
                // Create conversation using existing logic but manually to avoid recursion loops if any
                $this->pdo->beginTransaction();
                
                $stmtC = $this->pdo->prepare("INSERT INTO chat_conversaciones () VALUES ()");
                $stmtC->execute();
                $convId = $this->pdo->lastInsertId();

                $stmtP = $this->pdo->prepare("INSERT INTO chat_participantes (id_conversacion, id_usuario) VALUES (?, ?)");
                $stmtP->execute([$convId, $userId]);
                $stmtP->execute([$convId, $systemId]);
                
                // Optional: Validar si queremos insertar un mensaje de bienvenida
                $welcomeText = "¡Bienvenido a Rechord! Este es el canal oficial de soporte y notificaciones.";
                $stmtM = $this->pdo->prepare("INSERT INTO chat_mensajes (id_conversacion, id_usuario_emisor, contenido) VALUES (?, ?, ?)");
                $stmtM->execute([$convId, $systemId, $welcomeText]); // Sent by Rechord

                $this->pdo->commit();
            }
        } catch (Exception $e) {
            if ($this->pdo->inTransaction()) $this->pdo->rollBack();
            // Silent failure to avoid breaking the main request
        }
    }

    public function getMessages($conversationId, $userId) {
        // Verify participation
        if (!$this->isParticipant($conversationId, $userId)) {
            return false; 
        }

        $sql = "
            SELECT 
                m.id_mensaje,
                m.id_conversacion,
                m.id_usuario_emisor,
                m.contenido,
                m.fecha_envio,
                m.leido,
                u.nombre as sender_name,
                u.foto_perfil as sender_photo
            FROM chat_mensajes m
            JOIN usuario u ON m.id_usuario_emisor = u.id_usuario
            WHERE m.id_conversacion = ?
            ORDER BY m.fecha_envio ASC
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$conversationId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function sendMessage($senderId, $receiverId, $content) {
        // 1. Check if conversation exists
        $conversationId = $this->getConversationId($senderId, $receiverId);
        
        if (!$conversationId) {
            // Create new conversation
            $this->pdo->beginTransaction();
            try {
                $stmt = $this->pdo->prepare("INSERT INTO chat_conversaciones () VALUES ()");
                $stmt->execute();
                $conversationId = $this->pdo->lastInsertId();

                $stmtPart = $this->pdo->prepare("INSERT INTO chat_participantes (id_conversacion, id_usuario) VALUES (?, ?)");
                $stmtPart->execute([$conversationId, $senderId]);
                $stmtPart->execute([$conversationId, $receiverId]);
                
                $this->pdo->commit();
            } catch (Exception $e) {
                $this->pdo->rollBack();
                return false;
            }
        }

        // 2. Insert Message
        $stmt = $this->pdo->prepare("
            INSERT INTO chat_mensajes (id_conversacion, id_usuario_emisor, contenido) 
            VALUES (?, ?, ?)
        ");
        if ($stmt->execute([$conversationId, $senderId, $content])) {
            // 3. Update Conversation Activity
            $update = $this->pdo->prepare("UPDATE chat_conversaciones SET fecha_ultima_actividad = CURRENT_TIMESTAMP WHERE id_conversacion = ?");
            $update->execute([$conversationId]);
            
            $id = $this->pdo->lastInsertId();
            if ($id == 0) {
                 // Fallback if not returning ID
                 $stmtMax = $this->pdo->query("SELECT MAX(id_mensaje) FROM chat_mensajes");
                 $id = $stmtMax->fetchColumn();
            }
            return $id;
        }
        return false;
    }

    public function markAsRead($conversationId, $userId) {
        if (!$this->isParticipant($conversationId, $userId)) return false;

        $stmt = $this->pdo->prepare("
            UPDATE chat_mensajes 
            SET leido = 1 
            WHERE id_conversacion = ? 
            AND id_usuario_emisor != ? 
            AND leido = 0
        ");
        return $stmt->execute([$conversationId, $userId]);
    }

    public function getUnreadCount($userId) {
        $sql = "
            SELECT COUNT(*) 
            FROM chat_mensajes m
            JOIN chat_participantes cp ON m.id_conversacion = cp.id_conversacion
            WHERE cp.id_usuario = ? 
            AND m.id_usuario_emisor != ?
            AND m.leido = 0
        ";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$userId, $userId]);
        return $stmt->fetchColumn();
    }

    private function isParticipant($conversationId, $userId) {
        $stmt = $this->pdo->prepare("SELECT COUNT(*) FROM chat_participantes WHERE id_conversacion = ? AND id_usuario = ?");
        $stmt->execute([$conversationId, $userId]);
        return $stmt->fetchColumn() > 0;
    }

    private function getConversationId($userA, $userB) {
        $sql = "
            SELECT cp1.id_conversacion 
            FROM chat_participantes cp1
            JOIN chat_participantes cp2 ON cp1.id_conversacion = cp2.id_conversacion
            WHERE cp1.id_usuario = ? AND cp2.id_usuario = ?
            LIMIT 1
        ";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$userA, $userB]);
        return $stmt->fetchColumn();
    }
}
