<?php
require_once __DIR__ . '/../models/Cancion.php';
require_once __DIR__ . '/../models/HomeConfig.php';

class CancionManager {
    private $cancionModel;
    private $homeConfigModel;

    public function __construct() {
        $this->cancionModel = new Cancion();
        $this->homeConfigModel = new HomeConfig();
    }

    public function getAll($idUsuario) {
        return $this->cancionModel->obtenerTodas($idUsuario);
    }

    public function searchCanciones($term, $idUsuario) {
        return $this->cancionModel->buscar($term, $idUsuario);
    }

    public function getById($id) {
        return $this->cancionModel->obtenerPorId($id);
    }

    public function toggleLike($idUsuario, $idCancion) {
        return $this->cancionModel->toggleLike($idUsuario, $idCancion);
    }

    public function delete($id) {
        return $this->cancionModel->eliminar($id);
    }

    /**
     * Maneja la subida de una canción completa: Audio, Imagen y Metadatos
     */
    public function uploadCancion($data, $files, $idUsuario) {
        // 1. Validaciones de Negocio
        if (empty($data['titulo']) || empty($data['artista'])) {
            throw new Exception("Faltan datos obligatorios (Título o Artista)");
        }

        // 2. Procesamiento de Archivos (Audio Requerido para nueva canción)
        // Para actualizaciones, podría ser opcional, pero uploadCancion implica creación principal o "subida".
        // Asumo que este método es para CREAR (según el prompt "Subir Canción").
        if (!isset($files['audio_file']) || $files['audio_file']['error'] !== UPLOAD_ERR_OK) {
            throw new Exception("El archivo de audio es obligatorio");
        }

        $audioRes = $this->processFile($files['audio_file'], 'music', ['mp3', 'wav', 'ogg']);
        if (!$audioRes['success']) {
            throw new Exception("Error en audio: " . $audioRes['message']);
        }

        $rutaImagen = null;
        if (isset($files['image_file']) && $files['image_file']['error'] === UPLOAD_ERR_OK) {
            $imgRes = $this->processFile($files['image_file'], 'images', ['jpg', 'jpeg', 'png']);
            if ($imgRes['success']) {
                $rutaImagen = $imgRes['path'];
            }
        }

        // 3. Lógica de Datos (Hashtags)
        $hashtags = $this->parseHashtags($data['hashtags'] ?? null);

        // 4. Persistencia en Modelo
        $id = $this->cancionModel->crear(
            $idUsuario,
            $data['titulo'],
            $data['artista'],
            $data['nivel'] ?? 'intermedio',
            $audioRes['path'],
            $rutaImagen,
            $data['album'] ?? null,
            $data['duracion'] ?? 0,
            $hashtags,
            $data['fecha_lanzamiento'] ?? null
        );

        if (!$id) {
            // Podríamos intentar borrar los archivos subidos si falla la DB
            throw new Exception("Error al guardar la canción en la base de datos");
        }

        return $id;
    }

    public function updateCancion($id, $data, $files) {
        $current = $this->cancionModel->obtenerPorId($id);
        if (!$current) throw new Exception("Canción no encontrada");

        // Imagen
        $rutaImagen = $current['ruta_imagen'];
        if (isset($files['image_file']) && $files['image_file']['error'] === UPLOAD_ERR_OK) {
            $imgRes = $this->processFile($files['image_file'], 'images', ['jpg', 'jpeg', 'png']);
            if ($imgRes['success']) {
                $rutaImagen = $imgRes['path'];
            }
        }

        // Datos
        $titulo = $data['titulo'] ?? $current['titulo'];
        $artista = $data['artista'] ?? $current['artista'];
        $nivel = $data['nivel'] ?? $current['nivel'];
        $album = $data['album'] ?? $current['album'];
        $duracion = $data['duracion'] ?? $current['duracion'];
        $fecha = $data['fecha_lanzamiento'] ?? $current['fecha_lanzamiento'];
        $hashtags = $this->parseHashtags($data['hashtags'] ?? $current['hashtags']);

        // Modelo
        return $this->cancionModel->actualizar($id, $titulo, $artista, $nivel, $album, $duracion, $hashtags, $fecha, $rutaImagen);
    }

    public function getHomeSections($idUsuario) {
        $config = $this->homeConfigModel->obtenerConfiguracion();
        $sections = [];

        foreach ($config as $conf) {
            $songs = [];
            if ($conf['tipo'] === 'static') {
                if ($conf['valor'] === 'top_likes') {
                    $songs = $this->cancionModel->obtenerPopulares(10, $idUsuario);
                } elseif ($conf['valor'] === 'recent') {
                    $all = $this->cancionModel->obtenerTodas($idUsuario);
                    $songs = array_slice($all, 0, 10);
                }
            } elseif ($conf['tipo'] === 'hashtag') {
                $songs = $this->cancionModel->obtenerPorHashtag($conf['valor'], $idUsuario);
            }

            if (!empty($songs)) {
                $sections[] = [
                    'id' => $conf['id_config'],
                    'title' => $conf['titulo_mostrar'],
                    'type' => $conf['tipo'],
                    'value' => $conf['valor'],
                    'songs' => $songs
                ];
            }
        }
        return $sections;
    }

    // --- Helpers Internos ---

    private function processFile($file, $subDir, $allowedExts) {
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($ext, $allowedExts)) return ['success' => false, 'message' => 'Formato inválido'];

        // Secure Name
        $fileName = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', basename($file['name']));
        
        // Correct path: backend/uploads/subDir
        $targetDir = __DIR__ . '/../uploads/' . $subDir . '/';
        
        if (!is_dir($targetDir)) mkdir($targetDir, 0755, true);

        if (move_uploaded_file($file['tmp_name'], $targetDir . $fileName)) {
            // Return relative path for DB
            return ['success' => true, 'path' => 'uploads/' . $subDir . '/' . $fileName];
        }
        return ['success' => false, 'message' => 'Error al mover el archivo subido'];
    }

    private function parseHashtags($input) {
        if (is_array($input)) return $input;
        if (is_string($input)) {
            $json = json_decode($input, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($json)) return $json;
            return array_map('trim', explode(',', $input));
        }
        return [];
    }
    
    // --- Home Config Admin ---
    public function addHomeCategory($tipo, $valor, $titulo, $orden) {
        return $this->homeConfigModel->agregarCategoria($tipo, $valor, $titulo, $orden);
    }
    public function deleteHomeCategory($id) {
        return $this->homeConfigModel->eliminarCategoria($id);
    }
    public function updateConfigOrder($items) {
        $success = true;
        foreach ($items as $item) {
            if (!$this->homeConfigModel->actualizarOrden($item['id'], $item['orden'])) $success = false;
        }
        return $success;
    }
}
