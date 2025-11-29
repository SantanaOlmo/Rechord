<?php
require_once '../controllers/LikeController.php';
$controller = new LikeController();
$method = $_SERVER['REQUEST_METHOD'];

switch($method){
    case 'POST':
        $controller->darLike(json_decode(file_get_contents('php://input'), true));
        break;
    case 'DELETE':
        $controller->quitarLike($_GET['id_usuario'], $_GET['id_cancion']);
        break;
    case 'GET':
        if(isset($_GET['id_cancion'])) $controller->getLikes($_GET['id_cancion']);
        break;
}
