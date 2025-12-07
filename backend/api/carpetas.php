<?php
require_once '../controllers/CarpetaController.php';

// Configuración de errores
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php_errors.log');
error_reporting(E_ALL);

// Headers CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-User-Id");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$controller = new CarpetaController();
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? null;

switch($method) {
    case 'GET':
        if ($action === 'contenido') {
            $controller->listarCanciones($_GET['id']);
        } else {
            $controller->listar();
        }
        break;
    
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if ($action === 'create') {
            $controller->crear($data);
        } elseif ($action === 'add_song') {
            $controller->agregarCancion($data);
        } elseif ($action === 'reorder') {
            $controller->reordenar($data);
        } elseif ($action === 'rename') {
            $controller->renombrar($data);
        } elseif ($action === 'remove_song') {
            $controller->quitarCancion($data);
        }
        break;

    case 'DELETE':
        $controller->eliminar($_GET['id']);
        break;
}
