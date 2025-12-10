<?php
require_once '../controllers/CancionController.php';

// Desactiva la visualización de errores en la salida (Frontend)
ini_set('display_errors', 0);
// Asegura que todos los errores se registren en el log (Backend)
ini_set('log_errors', 1);
// Log to a file in the same directory for easy access
ini_set('error_log', __DIR__ . '/php_errors.log');
error_reporting(E_ALL);

$controller = new CancionController();
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if (isset($_GET['action']) && $_GET['action'] === 'home_data') {
            $controller->getHomeData();
        } elseif(isset($_GET['id'])) {
            $controller->getCancion($_GET['id']);
        } else {
            // Default: getCanciones (handles 'mis_canciones' or no action)
            $controller->getCanciones();
        }
        break;
    case 'POST':
        $action = $_GET['action'] ?? ($_POST['action'] ?? null);
        
        // Check JSON body if action not found
        if (!$action) {
            $input = json_decode(file_get_contents('php://input'), true);
            if ($input && isset($input['action'])) $action = $input['action'];
        }

        if ($action === 'toggle_like') {
            $data = json_decode(file_get_contents('php://input'), true);
            $controller->toggleLike($data);
        } elseif ($action === 'update') {
            if (!empty($_FILES) || !empty($_POST)) {
                 $data = $_POST;
                 $files = $_FILES;
                 $controller->actualizarCancion($data, $files);
            } else {
                 $data = json_decode(file_get_contents('php://input'), true);
                 $controller->actualizarCancion($data);
            }
        } elseif ($action === 'add_category') {
            $data = json_decode(file_get_contents('php://input'), true);
            $controller->addHomeCategory($data);
        } elseif ($action === 'update_config_order') {
             $data = json_decode(file_get_contents('php://input'), true);
             $controller->updateConfigOrder($data['items']);
        } elseif ($action === 'update_category') {
             $data = json_decode(file_get_contents('php://input'), true);
             $controller->updateHomeCategory($data);
        } else {
            // Default POST = Create Song (FormData)
            $controller->crearCancion($_POST, $_FILES);
        }
        break;
    case 'PUT':
        $controller->actualizarCancion(json_decode(file_get_contents('php://input'), true));
        break;
    case 'DELETE':
        if (isset($_GET['action']) && $_GET['action'] === 'delete_category') {
            $controller->deleteHomeCategory($_GET['id']);
        } else {
            $controller->eliminarCancion($_GET['id']);
        }
        break;
}
