<?php
require_once '../controllers/UsuarioController.php';

// Desactiva la visualización de errores en la salida (Frontend)
ini_set('display_errors', 0);
// Asegura que todos los errores se registren en el log (Backend)
ini_set('log_errors', 1);
ini_set('display_startup_errors', 1);
// Log to a file in the same directory for easy access
ini_set('error_log', __DIR__ . '/php_errors.log');
error_reporting(E_ALL);

$controller = new UsuarioController();

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
    case 'GET':
        if (isset($_GET['search'])) {
            $controller->search($_GET['search']);
        } elseif (isset($_GET['id'])) {
            $controller->getUsuario($_GET['id']);
        } else {
            $controller->getUsuarios();
        }
        break;
    case 'POST':
        // Check for action in GET or POST
        $action = isset($_GET['action']) ? $_GET['action'] : (isset($_POST['action']) ? $_POST['action'] : null);
        
        // If not found, try JSON body
        if (!$action) {
            $json = json_decode(file_get_contents('php://input'), true);
            if ($json && isset($json['action'])) {
                $action = $json['action'];
                $data = $json;
            }
        }

        if ($action === 'login') {
            $data = $data ?? json_decode(file_get_contents('php://input'), true);
            $controller->login($data);
        } elseif ($action === 'register') {
            $data = $data ?? json_decode(file_get_contents('php://input'), true);
            $controller->crearUsuario($data);
        } elseif ($action === 'update_profile') {
            // Handle FormData (POST + FILES)
            $controller->actualizarPerfil($_POST, $_FILES);
        } elseif ($action === 'impersonate') {
            $data = $data ?? json_decode(file_get_contents('php://input'), true);
            $controller->impersonate($data);
        } else {
            // Fallback logic
            $data = $data ?? json_decode(file_get_contents('php://input'), true);
            if (isset($data['nombre'])) {
                $controller->crearUsuario($data);
            } else {
                $controller->login($data);
            }
        }
        break;
    case 'PUT':
        $controller->actualizarUsuario(json_decode(file_get_contents('php://input'), true));
        break;
    case 'DELETE':
        $controller->eliminarUsuario($_GET['id']);
        break;
}
