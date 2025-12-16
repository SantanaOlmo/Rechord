<?php
require_once __DIR__ . '/../models/Cancion.php';
require_once __DIR__ . '/../models/HomeConfig.php';
require_once __DIR__ . '/../models/Estrofa.php';
require_once __DIR__ . '/../models/SongSection.php';

class CancionManager {
    private $cancionModel;
    private $homeConfigModel;
    private $estrofaModel;
    private $songSectionModel;

    public function __construct() {
        $this->cancionModel = new Cancion();
        $this->homeConfigModel = new HomeConfig();
        $this->songSectionModel = new SongSection();
        
        if (!class_exists('Estrofa')) {
            error_log("CRITICAL: Class Estrofa NOT FOUND in CancionManager. Included files: " . implode(", ", get_included_files()));
        }
        $this->estrofaModel = new Estrofa();
    }

    public function getAll($idUsuario) {
        return $this->cancionModel->obtenerTodas($idUsuario);
    }

    public function searchCanciones($term, $idUsuario) {
        return $this->cancionModel->buscar($term, $idUsuario);
    }

    public function getById($id) {
        $cancion = $this->cancionModel->obtenerPorId($id);
        if ($cancion) {
            // Attach Song Sections
            $sections = $this->songSectionModel->obtenerPorCancion($id);
            // Parse Chords JSON for frontend convenience? 
            // Or let frontend parse it. Frontend expects JSON likely.
            // Model returns associative array from DB. `chords` is JSON string column?
            // `fetch(PDO::FETCH_ASSOC)` returns `chords` as string if it's JSON type in MySQL but retrieved via PDO normally.
            
            // Let's decode it here to be clean, or leave as is.
            // Frontend logic in SyncController: 
            // `state.settings.songSections` is array of objects.
            // If I return `song_sections` as array of DB rows, `chords` might be string.
            // I should map it.
            if ($sections) {
                foreach ($sections as &$sec) {
                    if (isset($sec['chords']) && is_string($sec['chords'])) {
                        $sec['chords'] = json_decode($sec['chords'], true);
                    }
                    // Map start_time -> start, end_time -> end for frontend compat if needed
                    // Frontend uses `start` and `end`. DB uses `start_time` and `end_time`.
                    $sec['start'] = (float)$sec['start_time'];
                    $sec['end'] = (float)$sec['end_time'];
                }
            }
            $cancion['song_sections'] = $sections;
        }
        return $cancion;
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

        // Synchronizer Fields
        $bpm = $data['bpm'] ?? $current['bpm'] ?? 120;
        $metrica_numerador = $data['metrica_numerador'] ?? $current['metrica_numerador'] ?? 4;
        $metrica_denominador = $data['metrica_denominador'] ?? $current['metrica_denominador'] ?? 4;
        $beat_marker = $data['beat_marker'] ?? $current['beat_marker'] ?? 0;
        $subdivision = $data['subdivision'] ?? $current['subdivision'] ?? '1/4';
        $velocity = $data['velocity'] ?? $current['velocity'] ?? 100;
        $acordes = $data['acordes'] ?? $current['acordes'] ?? null;

        // Lyrics Update Logic
        if (isset($data['lyrics'])) {
            $this->updateLyrics($id, $data['lyrics']);
        }

        // Song Sections Logic
        if (isset($data['song_sections'])) {
            $sections = is_string($data['song_sections']) ? json_decode($data['song_sections'], true) : $data['song_sections'];
            if (is_array($sections)) {
                $this->songSectionModel->eliminarPorCancion($id);
                foreach ($sections as $sec) {
                    $this->songSectionModel->crear(
                        $id, 
                        $sec['label'] ?? 'Section', 
                        $sec['start'] ?? 0, 
                        $sec['end'] ?? 10, 
                        json_encode($sec['chords'] ?? [])
                    );
                }
            }
        }

        // Modelo
        return $this->cancionModel->actualizar($id, $titulo, $artista, $nivel, $album, $duracion, $hashtags, $fecha, $rutaImagen, $bpm, $metrica_numerador, $metrica_denominador, $beat_marker, $subdivision, $velocity, $acordes);
    }

    private function updateLyrics($idCancion, $lyricsText) {
        // Fetch existing logic to PRESERVE TIMINGS
        $existing = $this->estrofaModel->obtenerPorCancion($idCancion); 
        $existingMap = [];
        foreach ($existing as $e) {
            $existingMap[$e['orden']] = $e;
        }

        // Split new lyrics
        $rawStanzas = preg_split('/\n\s*\n/', trim($lyricsText));
        $newVerses = [];
        foreach ($rawStanzas as $txt) {
            if (trim($txt) !== '') $newVerses[] = trim($txt);
        }

        // Strategy: 
        // 1. Update existing orders with new content (Preserves ID and Timing)
        // 2. Insert new orders if any
        // 3. Delete excess orders if any
        
        // This is imperfect for "Insert at middle" (shift), but better than wiping all.
        // For distinct "Split" (1->2), the second part becomes a NEW verse (0:00), first keeps timing.
        // This prevents "Ghost" duplicate IDs becoming invalid.

        $countNew = count($newVerses);
        $countOld = count($existing);

        for ($i = 0; $i < $countNew; $i++) {
            $content = $newVerses[$i];
            
            if (isset($existingMap[$i])) {
                // Update Existing (Preserve ID and Times)
                $old = $existingMap[$i];
                $this->estrofaModel->actualizar($old['id_estrofa'], $content, $old['tiempo_inicio'], $old['tiempo_fin']);
                // Remove from map to track what's left
                unset($existingMap[$i]);
            } else {
                // Create New (Time 0)
                $this->estrofaModel->crear($idCancion, $content, $i, 0, 0);
            }
        }

        // Delete remaining (truncated verses)
        foreach ($existingMap as $rem) {
            $this->estrofaModel->eliminar($rem['id_estrofa']);
        }
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
    public function getAllHomeConfigs() {
        return $this->homeConfigModel->obtenerTodasConfiguraciones();
    }
    public function toggleHomeVisibility($id, $estado) {
        return $this->homeConfigModel->toggleVisibilidad($id, $estado);
    }
    public function updateHomeCategory($id, $tipo, $valor, $titulo, $activo = null) {
        return $this->homeConfigModel->actualizarCategoria($id, $tipo, $valor, $titulo, $activo);
    }
}
