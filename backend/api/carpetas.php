<?php
require_once '../controllers/CarpetaController.php';
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
