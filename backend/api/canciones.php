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
        if(isset($_GET['id'])) $controller->getCancion($_GET['id']);
        else $controller->getCanciones();
        break;
    case 'POST':
        if (isset($_GET['action']) && $_GET['action'] === 'toggle_like') {
            $data = json_decode(file_get_contents('php://input'), true);
            $controller->toggleLike($data);
        } else {
            $controller->crearCancion($_POST, $_FILES);
        }
        break;
    case 'PUT':
        $controller->actualizarCancion(json_decode(file_get_contents('php://input'), true));
        break;
    case 'DELETE':
        $controller->eliminarCancion($_GET['id']);
        break;
}
