<?php
require_once '../controllers/UsuarioController.php';

$controller = new UsuarioController();

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if(isset($_GET['id'])) $controller->getUsuario($_GET['id']);
        else $controller->getUsuarios();
        break;
    case 'POST':
        $controller->crearUsuario(json_decode(file_get_contents('php://input'), true));
        break;
    case 'PUT':
        $controller->actualizarUsuario(json_decode(file_get_contents('php://input'), true));
        break;
    case 'DELETE':
        $controller->eliminarUsuario($_GET['id']);
        break;
}
