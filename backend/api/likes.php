<?php
require_once '../controllers/LikeController.php';

// Desactiva la visualización de errores en la salida (Frontend)
ini_set('display_errors', 0);
// Asegura que todos los errores se registren en el log (Backend)
ini_set('log_errors', 1);
// Log to a file in the same directory for easy access
ini_set('error_log', __DIR__ . '/php_errors.log');
error_reporting(E_ALL);
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
        if(isset($_GET['id_usuario']) && isset($_GET['id_cancion'])) {
            $controller->checkLike($_GET['id_usuario'], $_GET['id_cancion']);
        } elseif (isset($_GET['id_usuario'])) {
            $controller->getUserLikes($_GET['id_usuario']);
        } elseif(isset($_GET['id_cancion'])) {
            $controller->getLikes($_GET['id_cancion']);
        }
        break;
}
