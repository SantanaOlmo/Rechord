<?php
require_once __DIR__ . '/../controllers/NotificacionController.php';

$controller = new NotificacionController();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $controller->getMisNotificaciones();
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $controller->enviar($data);
} elseif ($method === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);
    $controller->marcarLeida($data);
} else {
    http_response_code(405);
    echo json_encode(["message" => "Método no permitido"]);
}
