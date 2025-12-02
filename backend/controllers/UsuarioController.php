<?php
require_once __DIR__ . '/../models/Usuario.php';
require_once __DIR__ . '/../utils/helper.php';

class UsuarioController {
    private $usuarioModel;

    public function __construct() {
        $this->usuarioModel = new Usuario();
    }

    public function crearUsuario($data) {
        setApiHeaders();
        
        if (!isset($data['nombre'], $data['email'], $data['password'])) {
            sendResponse(["message" => "Faltan campos para el registro."], 400);
        }

        $id = $this->usuarioModel->registrar($data['nombre'], $data['email'], $data['password']);

        if ($id === 'duplicate_email') {
            sendResponse(["message" => "El email ya está registrado."], 409);
        } elseif ($id) {
            sendResponse(["message" => "Usuario registrado con éxito.", "id_usuario" => $id], 201);
        } else {
            sendResponse(["message" => "Error interno al registrar usuario."], 500);
        }
    }

    public function login($data) {
        setApiHeaders();

        if (!isset($data['email'], $data['password'])) {
            sendResponse(["message" => "Faltan campos para el login."], 400);
        }

        $usuario = $this->usuarioModel->login($data['email'], $data['password']);

        if ($usuario) {
            $token = bin2hex(random_bytes(32)); // Token simulado
            sendResponse([
                "message" => "Login exitoso.",
                "user" => $usuario,
                "token" => $token
            ], 200);
        } else {
            sendResponse(["message" => "Email o contraseña incorrectos."], 401);
        }
    }

    public function getUsuarios() {
        setApiHeaders();
        $usuarios = $this->usuarioModel->obtenerTodos();
        sendResponse(["users" => $usuarios], 200);
    }

    public function eliminarUsuario($id) {
        setApiHeaders();
        if ($this->usuarioModel->eliminar($id)) {
            sendResponse(["message" => "Usuario eliminado."], 200);
        } else {
            sendResponse(["message" => "Error al eliminar usuario."], 500);
        }
    }
    
    public function actualizarPerfil($postData, $files) {
        setApiHeaders();

        if (!isset($postData['id_usuario'])) {
            sendResponse(["message" => "ID de usuario requerido."], 400);
        }

        $idUsuario = $postData['id_usuario'];
        $usuarioActual = $this->usuarioModel->obtenerPorId($idUsuario);

        if (!$usuarioActual) {
            sendResponse(["message" => "Usuario no encontrado."], 404);
        }

        // 1. Actualizar datos de texto (Nombre, Email, Bio)
        if (isset($postData['nombre']) || isset($postData['email']) || isset($postData['bio'])) {
            $nombre = $postData['nombre'] ?? $usuarioActual['nombre'];
            $email = $postData['email'] ?? $usuarioActual['email'];
            $bio = $postData['bio'] ?? $usuarioActual['bio'];
            
            $this->usuarioModel->actualizarDatos($idUsuario, $nombre, $email, $bio);
        }

        // 2. Procesar Avatar
        if (isset($files['image_file']) && $files['image_file']['error'] === UPLOAD_ERR_OK) {
            $rutaFoto = $this->procesarSubidaImagen($files['image_file'], 'avatars', $usuarioActual['foto_perfil']);
            if ($rutaFoto) {
                $this->usuarioModel->actualizarFoto($idUsuario, $rutaFoto);
            }
        }

        // 3. Procesar Banner
        if (isset($files['banner_file']) && $files['banner_file']['error'] === UPLOAD_ERR_OK) {
            $rutaBanner = $this->procesarSubidaImagen($files['banner_file'], 'banners', $usuarioActual['banner'] ?? null);
            if ($rutaBanner) {
                $this->usuarioModel->actualizarBanner($idUsuario, $rutaBanner);
            }
        }

        // Devolver usuario actualizado
        $usuarioActualizado = $this->usuarioModel->obtenerPorId($idUsuario);
        sendResponse(["message" => "Perfil actualizado.", "user" => $usuarioActualizado]);
    }

    private function procesarSubidaImagen($file, $subDir, $oldPathRelative = null) {
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

        if (!in_array($ext, $allowed)) {
            return null; // O lanzar error
        }

        $safeName = preg_replace('/[^a-zA-Z0-9._-]/', '', basename($file['name']));
        $fileName = time() . '_' . $subDir . '_' . $safeName;
        $uploadDir = __DIR__ . '/../uploads/' . $subDir . '/';

        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        if (move_uploaded_file($file['tmp_name'], $uploadDir . $fileName)) {
            $newPath = 'uploads/' . $subDir . '/' . $fileName;
            
            // Borrar imagen anterior si existe
            if ($oldPathRelative) {
                $oldPathAbsolute = __DIR__ . '/../' . $oldPathRelative;
                if (file_exists($oldPathAbsolute)) {
                    unlink($oldPathAbsolute);
                }
            }
            return $newPath;
        }
        return null;
    }
    
    public function getUsuario($id) {
        setApiHeaders();
        $usuario = $this->usuarioModel->obtenerPorId($id);
        if ($usuario) {
            sendResponse(["user" => $usuario]);
        } else {
            sendResponse(["message" => "Usuario no encontrado"], 404);
        }
    }
}
