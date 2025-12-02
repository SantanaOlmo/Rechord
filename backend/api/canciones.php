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
        if (isset($_GET['action']) && $_GET['action'] === 'toggle_like') {
            $data = json_decode(file_get_contents('php://input'), true);
            $controller->toggleLike($data);
        } else {
            $controller->crearCancion($_POST, $_FILES);
        }
        break;
    case 'PUT':
        $controller->actualizarCancion(json_decode(file_get_contents('php://input'), true));
        break;
    case 'DELETE':
        $controller->eliminarCancion($_GET['id']);
        break;
}
