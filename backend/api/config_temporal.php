<?php
require_once '../controllers/ConfiguracionTemporalController.php';
$controller = new ConfiguracionTemporalController();
$method = $_SERVER['REQUEST_METHOD'];

switch($method){
    case 'GET':
        if(isset($_GET['id_cancion'])) $controller->getConfiguracion($_GET['id_cancion']);
        else $controller->getTodasConfiguraciones();
        break;
    case 'POST':
        $controller->crearConfiguracion(json_decode(file_get_contents('php://input'), true));
        break;
    case 'PUT':
        $controller->actualizarConfiguracion(json_decode(file_get_contents('php://input'), true));
        break;
    case 'DELETE':
        $controller->eliminarConfiguracion($_GET['id_cancion']);
        break;
}
