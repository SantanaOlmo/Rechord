<?php
require_once '../controllers/EstrofaController.php';

// Desactiva la visualización de errores en la salida (Frontend)
ini_set('display_errors', 0);
// Asegura que todos los errores se registren en el log (Backend)
ini_set('log_errors', 1);
// Log to a file in the same directory for easy access
ini_set('error_log', __DIR__ . '/php_errors.log');
error_reporting(E_ALL);
$controller = new EstrofaController();
$method = $_SERVER['REQUEST_METHOD'];

switch($method){
    case 'GET':
        if(isset($_GET['id'])) $controller->getEstrofa($_GET['id']);
        else $controller->getEstrofas();
        break;
    case 'POST':
        $controller->crearEstrofa(json_decode(file_get_contents('php://input'), true));
        break;
    case 'PUT':
        $controller->actualizarEstrofa(json_decode(file_get_contents('php://input'), true));
        break;
    case 'DELETE':
        $controller->eliminarEstrofa($_GET['id']);
        break;
}
