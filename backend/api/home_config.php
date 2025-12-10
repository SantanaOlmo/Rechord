<?php
require_once __DIR__ . '/../controllers/CancionController.php';
require_once __DIR__ . '/../utils/helper.php';

$controller = new CancionController();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    if (isset($_GET['action']) && $_GET['action'] === 'admin_list') {
        $controller->getAdminHomeConfigs();
    } else {
        // Default public list (or redirect to canciones.php?action=home)
        // For admin usage, we rely on 'action=admin_list'
        sendResponse(["message" => "Action required"], 400);
    }
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (isset($data['action'])) {
        switch($data['action']) {
            case 'add':
                $controller->addHomeCategory($data);
                break;
            case 'update':
                $controller->updateHomeCategory($data);
                break;
            case 'delete':
                if (isset($data['id'])) $controller->deleteHomeCategory($data['id']);
                break;
            case 'reorder':
                if (isset($data['items'])) $controller->updateConfigOrder($data['items']);
                break;
            case 'toggle':
                $controller->toggleHomeVisibility($data);
                break;
            default:
                sendResponse(["message" => "Invalid action"], 400);
        }
    } else {
        sendResponse(["message" => "Action required"], 400);
    }
} else {
    sendResponse(["message" => "Method not allowed"], 405);
}
?>
