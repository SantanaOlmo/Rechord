<?php
// utils/helper.php

function setApiHeaders() {
    // Permite acceso desde cualquier origen (CORS) - Ajusta esto en producción
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    
    // Si la petición es OPTIONS (pre-flight check del navegador), terminamos aquí
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

function sendResponse($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit();
}

function getJsonData() {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    return $data;
}
?>
