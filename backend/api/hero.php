<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Start Output Buffering to catch any unwanted HTML (warnings/notices)
ob_start();

// Prevent HTML error output disrupting JSON
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);

// Removed database.php require
require_once __DIR__ . '/../controllers/HeroController.php';

// Removed Database instantiation
$controller = new HeroController();

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

try {
    if ($method == 'GET') {
        if ($action == 'list') {
            $data = $controller->getAll();
            ob_clean(); echo json_encode($data);
        } elseif ($action == 'active') { // Public endpoint for Home
            $active = $controller->getActive();
            $data = $active ? $active : ["ruta_video" => "default"];
            ob_clean(); echo json_encode($data);
        } else {
            $data = $controller->getAll();
            ob_clean(); echo json_encode($data);
        }
    } elseif ($method == 'POST') {
        if ($action == 'upload') {
            // Check for Empty Post Body (likely post_max_size exceeded)
            if (empty($_FILES) && empty($_POST) && isset($_SERVER['CONTENT_LENGTH']) && $_SERVER['CONTENT_LENGTH'] > 0) {
                 $maxPostSize = ini_get('post_max_size');
                 throw new Exception("El archivo excede el tamaño máximo permitido por el servidor ($maxPostSize).");
            }

            if (isset($_FILES['video']) && isset($_POST['titulo'])) {
                $result = $controller->uploadVideo($_FILES['video'], $_POST['titulo']);
                ob_clean(); echo json_encode($result);
            } else {
                throw new Exception("Faltan datos (video o titulo)");
            }
        } elseif ($action == 'toggle_active') {
            $data = json_decode(file_get_contents("php://input"));
            if (isset($data->id)) {
                $result = $controller->toggleActive($data->id);
                ob_clean(); echo json_encode($result);
            } else {
                throw new Exception("ID no proporcionado");
            }
        } elseif ($action == 'delete') {
             $data = json_decode(file_get_contents("php://input"));
            if (isset($data->id)) {
                $result = $controller->delete($data->id);
                ob_clean(); echo json_encode($result);
            } else {
               throw new Exception("ID no proporcionado");
            }
        } elseif ($action == 'update_order') {
             $data = json_decode(file_get_contents("php://input"), true);
             if (isset($data['items'])) {
                 $result = $controller->updateOrder($data['items']);
                 ob_clean(); echo json_encode($result);
             } else {
                 throw new Exception("Datos de orden no proporcionados");
             }
        }
    }
} catch (Exception $e) {
    // Clean buffer before error response
    ob_end_clean();
    http_response_code(400); // Or 500 depending on error, but 400 is safer for "Client" errors
    echo json_encode(["error" => $e->getMessage()]);
}

// Flush regular buffer if normal path (though logic above echoes inside blocks)
// Since we echo inside blocks, we should modify that pattern or ensure we clean before those echos.
// Refactoring for Clean Output:
?>
