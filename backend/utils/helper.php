<?php
/**
 * Funciones auxiliares para la API REST de ReChord
 */

/**
 * Establece los encabezados CORS y de contenido JSON
 * @param string $allowedMethods Métodos HTTP permitidos
 */
function setApiHeaders($allowedMethods = 'GET, POST, PUT, DELETE, OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: ' . $allowedMethods);
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Content-Type: application/json; charset=UTF-8');
}

/**
 * Obtiene los datos JSON del cuerpo de la petición
 * @return array|null Datos decodificados o null si hay error
 */
function getJsonData() {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    return $data;
}

/**
 * Envía una respuesta JSON con el código de estado HTTP
 * @param array $data Datos a enviar
 * @param int $statusCode Código de estado HTTP
 */
function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}


