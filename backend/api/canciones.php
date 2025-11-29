<?php
require_once '../controllers/CancionController.php';

$controller = new CancionController();
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if(isset($_GET['id'])) $controller->getCancion($_GET['id']);
        else $controller->getCanciones();
        break;
    case 'POST':
        $controller->crearCancion($_POST, $_FILES);
        break;
    case 'PUT':
        $controller->actualizarCancion(json_decode(file_get_contents('php://input'), true));
        break;
    case 'DELETE':
        $controller->eliminarCancion($_GET['id']);
        break;
}
