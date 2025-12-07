<?php
require_once __DIR__ . '/../models/Cancion.php';
require_once __DIR__ . '/../models/HomeConfig.php';

class CancionService {
    private $cancionModel;
    private $homeConfigModel;

    public function __construct() {
        $this->cancionModel = new Cancion();
        $this->homeConfigModel = new HomeConfig();
    }

    public function getAll($idUsuario) {
        return $this->cancionModel->obtenerTodas($idUsuario);
    }

    public function search($term, $idUsuario) {
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

    public function create($idUsuario, $data, $files) {
        // Validation calls could be here or in Controller. Service is better for business rules.
        if (empty($data['titulo']) || empty($data['artista'])) {
            throw new Exception("Faltan datos obligatorios");
        }

        // Process Audio
        if (!isset($files['audio_file']) || $files['audio_file']['error'] !== UPLOAD_ERR_OK) {
            throw new Exception("Archivo de audio requerido");
        }
        $audioRes = $this->processFile($files['audio_file'], 'music', ['mp3', 'wav', 'ogg']);
        if (!$audioRes['success']) throw new Exception($audioRes['message']);
        
        // Process Image
        $rutaImagen = null;
        if (isset($files['image_file']) && $files['image_file']['error'] === UPLOAD_ERR_OK) {
            $imgRes = $this->processFile($files['image_file'], 'images', ['jpg', 'jpeg', 'png']);
            if ($imgRes['success']) $rutaImagen = $imgRes['path'];
        }

        // Hashtags
        $hashtags = $this->parseHashtags($data['hashtags'] ?? null);

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

        if (!$id) throw new Exception("Error al guardar en base de datos");
        return $id;
    }

    public function update($id, $data) {
        $current = $this->cancionModel->obtenerPorId($id);
        if (!$current) throw new Exception("Canción no encontrada");

        // Process Image if uploaded
        $rutaImagen = $current['ruta_imagen'];
        if (isset($data['files']['image_file']) && $data['files']['image_file']['error'] === UPLOAD_ERR_OK) {
            $imgRes = $this->processFile($data['files']['image_file'], 'images', ['jpg', 'jpeg', 'png']);
            if ($imgRes['success']) {
                $rutaImagen = $imgRes['path'];
                // Optional: Delete old image if it exists and isn't a default
            }
        }

        // Merge existing with new
        $titulo = $data['titulo'] ?? $current['titulo'];
        $artista = $data['artista'] ?? $current['artista'];
        $nivel = $data['nivel'] ?? $current['nivel'];
        $album = $data['album'] ?? $current['album'];
        $duracion = $data['duracion'] ?? $current['duracion'];
        $fecha = $data['fecha_lanzamiento'] ?? $current['fecha_lanzamiento'];
        
        $hashtags = $this->parseHashtags($data['hashtags'] ?? $current['hashtags']);

        // Update database (Cancion.php needs to support rutaImagen update in actualizer)
        // Wait, verifying if Cancion::actualizar supports image path logic?
        // Checking Cancion.php signature... 
        // It does NOT support ruta_imagen. I need to update Cancion.php signature too.
        
        // Let's assume I will update Cancion.php next.
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

    private function processFile($file, $subDir, $allowedExts) {
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($ext, $allowedExts)) return ['success' => false, 'message' => 'Formato inválido'];

        $fileName = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', basename($file['name']));
        $targetDir = __DIR__ . '/../uploads/' . $subDir . '/'; // Adjusted path to be inside backend/uploads
        if (!is_dir($targetDir)) mkdir($targetDir, 0755, true);

        if (move_uploaded_file($file['tmp_name'], $targetDir . $fileName)) {
            return ['success' => true, 'path' => 'uploads/' . $subDir . '/' . $fileName];
        }
        return ['success' => false, 'message' => 'Error al subir archivo'];
    }

    private function parseHashtags($input) {
        if (is_array($input)) return $input;
        if (is_string($input)) {
            // Try JSON decode first
            $json = json_decode($input, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($json)) return $json;
            // Else comma separated
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
            if (!$this->homeConfigModel->actualizarOrden($item['id'], $item['orden'])) {
                $success = false;
            }
        }
        return $success;
    }
}
?>
