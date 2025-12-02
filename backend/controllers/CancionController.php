<?php
require_once __DIR__ . '/../models/Cancion.php';
require_once __DIR__ . '/../utils/helper.php';

class CancionController {
    private $cancionModel;

    public function __construct() {
        $this->cancionModel = new Cancion();
    }

    public function getCanciones() {
        setApiHeaders();
        // Obtener ID de usuario si está autenticado (opcional, pero necesario para is_liked)
        $idUsuario = null;
        // En una app real, extraeríamos el token del header Authorization
        // Por simplicidad, permitiremos pasar id_usuario por query param o header custom
        // O mejor, si usamos JWT, lo decodificamos.
        // Asumiremos que el frontend envía 'X-User-Id' por ahora para simplificar sin JWT completo
        $headers = getallheaders();
        if (isset($headers['X-User-Id'])) {
            $idUsuario = $headers['X-User-Id'];
        }

        $canciones = $this->cancionModel->obtenerTodas($idUsuario);
        sendResponse(["canciones" => $canciones]);
    }

    public function toggleLike($data) {
        setApiHeaders();
        if (!isset($data['id_usuario'], $data['id_cancion'])) {
            sendResponse(["message" => "Faltan datos."], 400);
        }

        $isLiked = $this->cancionModel->toggleLike($data['id_usuario'], $data['id_cancion']);
        sendResponse(["message" => "Like actualizado", "is_liked" => $isLiked]);
    }

    public function getCancion($id) {
        setApiHeaders();
        $cancion = $this->cancionModel->obtenerPorId($id);
        if ($cancion) {
            sendResponse(["cancion" => $cancion]);
        } else {
            sendResponse(["message" => "Canción no encontrada"], 404);
        }
    }

    public function crearCancion($postData, $files) {
        setApiHeaders();

        // 1. Validar campos obligatorios
        if (!isset($postData['id_usuario'], $postData['titulo'], $postData['artista'], $postData['nivel'])) {
            sendResponse(["message" => "Faltan campos obligatorios (id_usuario, titulo, artista, nivel)"], 400);
        }

        // 2. Validar Audio (Obligatorio)
        if (!isset($files['audio_file']) || $files['audio_file']['error'] !== UPLOAD_ERR_OK) {
            sendResponse(["message" => "No se ha subido ningún archivo de audio o hubo un error en la subida."], 400);
        }

        $audioFile = $files['audio_file'];
        $audioExt = strtolower(pathinfo($audioFile['name'], PATHINFO_EXTENSION));
        $allowedAudio = ['mp3', 'wav', 'ogg'];

        if (!in_array($audioExt, $allowedAudio)) {
            sendResponse(["message" => "Formato de audio no permitido. Solo mp3, wav, ogg."], 400);
        }

        // 3. Validar Imagen (Opcional)
        $rutaImagen = null;
        if (isset($files['image_file']) && $files['image_file']['error'] === UPLOAD_ERR_OK) {
            $imageFile = $files['image_file'];
            $imageExt = strtolower(pathinfo($imageFile['name'], PATHINFO_EXTENSION));
            $allowedImages = ['jpg', 'jpeg', 'png'];

            if (!in_array($imageExt, $allowedImages)) {
                sendResponse(["message" => "Formato de imagen no permitido. Solo jpg, jpeg, png."], 400);
            }
            
            // Procesar imagen
            $safeImgName = preg_replace('/[^a-zA-Z0-9._-]/', '', basename($imageFile['name']));
            $imgFileName = time() . '_img_' . $safeImgName;
            $uploadImgDir = __DIR__ . '/../uploads/images/';
            
            if (!is_dir($uploadImgDir)) {
                mkdir($uploadImgDir, 0755, true);
            }

            if (move_uploaded_file($imageFile['tmp_name'], $uploadImgDir . $imgFileName)) {
                $rutaImagen = 'uploads/images/' . $imgFileName;
            } else {
                sendResponse(["message" => "Error al guardar la imagen"], 500);
            }
        }

        // 4. Procesar Audio
        $safeAudioName = preg_replace('/[^a-zA-Z0-9._-]/', '', basename($audioFile['name']));
        $audioFileName = time() . '_' . $safeAudioName;
        $uploadAudioDir = __DIR__ . '/../uploads/music/';
        
        if (!is_dir($uploadAudioDir)) {
            mkdir($uploadAudioDir, 0755, true);
        }

        $targetAudioPath = $uploadAudioDir . $audioFileName;

        if (move_uploaded_file($audioFile['tmp_name'], $targetAudioPath)) {
            $rutaMp3 = 'uploads/music/' . $audioFileName;
            
            // 5. Guardar en BD
            $id = $this->cancionModel->crear(
                $postData['id_usuario'],
                $postData['titulo'],
                $postData['artista'],
                $postData['nivel'],
                $rutaMp3,
                $rutaImagen
            );

            if ($id) {
                sendResponse([
                    "message" => "Canción creada con éxito", 
                    "id_cancion" => $id, 
                    "ruta_mp3" => $rutaMp3,
                    "ruta_imagen" => $rutaImagen
                ], 201);
            } else {
                // Rollback: borrar archivos si falla BD
                unlink($targetAudioPath);
                if ($rutaImagen) {
                    unlink(__DIR__ . '/../' . $rutaImagen);
                }
                sendResponse(["message" => "Error al guardar en la base de datos"], 500);
            }
        } else {
            // Si falla mover audio, borrar imagen si se subió
            if ($rutaImagen) {
                unlink(__DIR__ . '/../' . $rutaImagen);
            }
            sendResponse(["message" => "Error al mover el archivo de audio al servidor"], 500);
        }
    }

    public function actualizarCancion($data) {
        setApiHeaders();
        sendResponse(["message" => "Actualizar canción no implementado"], 501);
    }

    public function eliminarCancion($id) {
        setApiHeaders();
        
        $cancion = $this->cancionModel->obtenerPorId($id);
        
        if (!$cancion) {
            sendResponse(["message" => "Canción no encontrada"], 404);
        }

        if ($this->cancionModel->eliminar($id)) {
            // Eliminar audio
            $audioPath = __DIR__ . '/../' . $cancion['ruta_mp3'];
            if (file_exists($audioPath)) {
                unlink($audioPath);
            }
            
            // Eliminar imagen si existe
            if ($cancion['ruta_imagen']) {
                $imagePath = __DIR__ . '/../' . $cancion['ruta_imagen'];
                if (file_exists($imagePath)) {
                    unlink($imagePath);
                }
            }
            
            sendResponse(["message" => "Canción y archivos eliminados correctamente"]);
        } else {
            sendResponse(["message" => "Error al eliminar la canción de la base de datos"], 500);
        }
    }
}
