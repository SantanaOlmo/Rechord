<?php
require_once '../controllers/AcordeSincronizadoController.php';
require_once '../utils/helper.php';

// Manejar preflight CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    setApiHeaders();
    http_response_code(200);
    exit;
}

$controller = new AcordeSincronizadoController();
$method = $_SERVER['REQUEST_METHOD'];

switch($method){
    case 'GET':
        if(isset($_GET['id_cancion'])) {
            $controller->getAcordesCancion($_GET['id_cancion']);
        } else {
            setApiHeaders();
            sendResponse(["message" => "Se requiere el parámetro id_cancion"], 400);
        }
        break;
    case 'POST':
        $controller->agregarAcorde(json_decode(file_get_contents('php://input'), true));
        break;
    case 'PUT':
        $controller->actualizarAcorde(json_decode(file_get_contents('php://input'), true));
        break;
    case 'DELETE':
        if(isset($_GET['id_sincronia'])) {
            $controller->eliminarAcorde($_GET['id_sincronia']);
        } else {
            setApiHeaders();
            sendResponse(["message" => "Se requiere el parámetro id_sincronia"], 400);
        }
        break;
    default:
        setApiHeaders();
        sendResponse(["message" => "Método no permitido"], 405);
        break;
}
