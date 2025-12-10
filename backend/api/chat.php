<?php
require_once '../controllers/ChatController.php';

ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php_errors.log');
error_reporting(E_ALL);

$controller = new ChatController();
$method = $_SERVER['REQUEST_METHOD'];

// Helper to get raw JSON
$json = json_decode(file_get_contents('php://input'), true);
$action = isset($_GET['action']) ? $_GET['action'] : ($json['action'] ?? null);

switch($method) {
    case 'GET':
        if ($action === 'conversations') {
            $controller->getConversations($_GET['user_id'] ?? null);
        } elseif ($action === 'messages') {
            $controller->getMessages($_GET['conversation_id'] ?? null, $_GET['user_id'] ?? null);
        } elseif ($action === 'unread_count') {
            $controller->getUnreadCount($_GET['user_id'] ?? null);
        } else {
            sendResponse(["message" => "Acción inválida"], 400);
        }
        break;
        
    case 'POST':
        if ($action === 'send') {
            $controller->sendMessage($json);
        } elseif ($action === 'mark_read') {
            $controller->markRead($json);
        } else {
            sendResponse(["message" => "Acción inválida"], 400);
        }
        break;

    default:
        sendResponse(["message" => "Método no permitido"], 405);
        break;
}
