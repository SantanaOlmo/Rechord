<?php
require_once '../controllers/PatronRasgueoController.php';

// Desactiva la visualización de errores en la salida (Frontend)
ini_set('display_errors', 0);
// Asegura que todos los errores se registren en el log (Backend)
ini_set('log_errors', 1);
// Log to a file in the same directory for easy access
ini_set('error_log', __DIR__ . '/php_errors.log');
error_reporting(E_ALL);

$controller = new PatronRasgueoController();
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if(isset($_GET['id'])) $controller->getPatron($_GET['id']);
        else $controller->getPatrones();
        break;
    case 'POST':
        $controller->crearPatron(json_decode(file_get_contents('php://input'), true));
        break;
    case 'PUT':
        $controller->actualizarPatron(json_decode(file_get_contents('php://input'), true));
        break;
    case 'DELETE':
        $controller->eliminarPatron($_GET['id']);
        break;
}
