<?php
require_once '../controllers/AcordeController.php';

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
