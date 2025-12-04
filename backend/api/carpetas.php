<?php
require_once '../controllers/CarpetaController.php';

// Desactiva la visualización de errores en la salida (Frontend)
ini_set('display_errors', 0);
// Asegura que todos los errores se registren en el log (Backend)
ini_set('log_errors', 1);
// Log to a file in the same directory for easy access
ini_set('error_log', __DIR__ . '/php_errors.log');
error_reporting(E_ALL);
$controller = new CarpetaController();
$method = $_SERVER['REQUEST_METHOD'];

switch($method){
    case 'GET':
        if(isset($_GET['id'])) $controller->getCarpeta($_GET['id']);
        else $controller->getCarpetas();
        break;
    case 'POST':
        $controller->crearCarpeta(json_decode(file_get_contents('php://input'), true));
        break;
    case 'PUT':
        $controller->actualizarCarpeta(json_decode(file_get_contents('php://input'), true));
        break;
    case 'DELETE':
        $controller->eliminarCarpeta($_GET['id']);
        break;
}
