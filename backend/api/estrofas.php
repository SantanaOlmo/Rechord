<?php
require_once '../controllers/EstrofaController.php';
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
