<?php
require_once '../controllers/CancionCarpetaController.php';
$controller = new CancionCarpetaController();
$method = $_SERVER['REQUEST_METHOD'];

switch($method){
    case 'POST':
        $controller->agregarCancionACarpeta(json_decode(file_get_contents('php://input'), true));
        break;
    case 'DELETE':
        $controller->quitarCancionDeCarpeta($_GET['id_cancion'], $_GET['id_carpeta']);
        break;
}
