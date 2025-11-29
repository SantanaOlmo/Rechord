<?php
/**
 * Endpoint de la API para la gestión de usuarios:
 * - POST: Registro de un nuevo usuario o Login.
 * - GET: Listar todos los usuarios (Solo Admin).
 * - DELETE: Eliminar un usuario (Solo Admin).
 */

// 1. Configuración y Clases
require_once __DIR__ . '/../utils/helper.php';
require_once __DIR__ . '/../models/Usuario.php';

// 2. Establecer encabezados CORS y de contenido JSON
// Permitimos POST, GET, DELETE para este endpoint
setApiHeaders('POST, GET, DELETE');

// Si la petición es OPTIONS, es una pre-solicitud CORS, responder 200 y salir
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Inicializar el modelo
$usuarioModel = new Usuario();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        // Manejar Registro y Login
        $data = getJsonData();
        if (!$data || (!isset($data['action']))) {
            sendResponse(["message" => "Datos incompletos o mal formato JSON."], 400);
        }

        if ($data['action'] === 'register') {
            // --- REGISTRO ---
            if (!isset($data['nombre'], $data['email'], $data['contraseña'])) {
                sendResponse(["message" => "Faltan campos para el registro."], 400);
            }
            $id = $usuarioModel->registrar($data['nombre'], $data['email'], $data['contraseña']);

            if ($id === 'duplicate_email') {
                sendResponse(["message" => "El email ya está registrado."], 409);
            } elseif ($id) {
                sendResponse(["message" => "Usuario registrado con éxito.", "id_usuario" => $id], 201);
            } else {
                sendResponse(["message" => "Error interno al registrar usuario."], 500);
            }
        
        } elseif ($data['action'] === 'login') {
            // --- LOGIN ---
            if (!isset($data['email'], $data['contraseña'])) {
                sendResponse(["message" => "Faltan campos para el login."], 400);
            }
            $usuario = $usuarioModel->login($data['email'], $data['contraseña']);
            
            if ($usuario) {
                // Aquí deberías generar un token JWT o una sesión.
                // Por ahora, solo devolvemos los datos del usuario.
                sendResponse(["message" => "Login exitoso.", "user" => $usuario], 200);
            } else {
                sendResponse(["message" => "Email o contraseña incorrectos."], 401);
            }

        } else {
            sendResponse(["message" => "Acción no reconocida en POST."], 400);
        }
        break;

    case 'GET':
        // --- OBTENER TODOS LOS USUARIOS (ADMIN) ---
        // Implementación de seguridad básica de administrador (usando un email fijo)
        // NOTA: Para producción, la verificación debe ser a través de un token JWT.
        
        // Asumo que el cliente enviará el email del admin para una comprobación simple
        if (!isset($_GET['admin_email']) || $_GET['admin_email'] !== 'admin@rechord.com') {
             sendResponse(["message" => "Acceso denegado. Se requiere credenciales de administrador."], 403);
        }

        $usuarios = $usuarioModel->obtenerTodos();
        if ($usuarios) {
            sendResponse(["message" => "Lista de usuarios.", "users" => $usuarios], 200);
        } else {
            sendResponse(["message" => "No se encontraron usuarios."], 200);
        }
        break;

    case 'DELETE':
        // --- ELIMINAR USUARIO (ADMIN) ---
        // Debe ser una petición DELETE con el ID del usuario a borrar.
        
        // 1. Verificar si la petición es del admin
        if (!isset($_GET['admin_email']) || $_GET['admin_email'] !== 'admin@rechord.com') {
             sendResponse(["message" => "Acceso denegado. Se requiere credenciales de administrador para borrar."], 403);
        }

        // 2. Obtener el ID del usuario a eliminar (de la URL, ej: ?id=5)
        if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
            sendResponse(["message" => "ID de usuario a eliminar no proporcionado o inválido."], 400);
        }

        $id_usuario = (int)$_GET['id'];
        
        if ($usuarioModel->eliminar($id_usuario)) {
            sendResponse(["message" => "Usuario con ID $id_usuario eliminado con éxito."], 200);
        } else {
            sendResponse(["message" => "Error al eliminar el usuario o usuario no encontrado."], 404);
        }

        break;

    default:
        sendResponse(["message" => "Método no soportado."], 405);
        break;
}