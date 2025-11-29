<?php
require_once '../controllers/PatronRasgueoController.php';

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
