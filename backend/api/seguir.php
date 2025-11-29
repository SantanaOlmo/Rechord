<?php
require_once '../controllers/SeguirController.php';
$controller = new SeguirController();
$method = $_SERVER['REQUEST_METHOD'];

switch($method){
    case 'POST':
        $controller->seguirUsuario(json_decode(file_get_contents('php://input'), true));
        break;
    case 'DELETE':
        $controller->dejarDeSeguir($_GET['id_seguidor'], $_GET['id_seguido']);
        break;
}
