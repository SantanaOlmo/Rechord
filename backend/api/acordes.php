<?php
require_once '../controllers/AcordeController.php';

// Desactiva la visualización de errores en la salida (Frontend)
ini_set('display_errors', 0);
// Asegura que todos los errores se registren en el log (Backend)
ini_set('log_errors', 1);
// Log to a file in the same directory for easy access
ini_set('error_log', __DIR__ . '/php_errors.log');
error_reporting(E_ALL);

$controller = new AcordeController();
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if(isset($_GET['id'])) $controller->getAcorde($_GET['id']);
        else $controller->getAcordes();
        break;
    case 'POST':
        $controller->crearAcorde(json_decode(file_get_contents('php://input'), true));
        break;
    case 'PUT':
        $controller->actualizarAcorde(json_decode(file_get_contents('php://input'), true));
        break;
    case 'DELETE':
        $controller->eliminarAcorde($_GET['id']);
        break;
}
