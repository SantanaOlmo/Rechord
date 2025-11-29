<?php
require_once '../controllers/RasgueoSincronizadoController.php';
$controller = new RasgueoSincronizadoController();
$method = $_SERVER['REQUEST_METHOD'];

switch($method){
    case 'GET':
        if(isset($_GET['id_cancion'])) $controller->getRasgueosCancion($_GET['id_cancion']);
        break;
    case 'POST':
        $controller->agregarRasgueo(json_decode(file_get_contents('php://input'), true));
        break;
    case 'PUT':
        $controller->actualizarRasgueo(json_decode(file_get_contents('php://input'), true));
        break;
    case 'DELETE':
        $controller->eliminarRasgueo($_GET['id_sincronia']);
        break;
}
