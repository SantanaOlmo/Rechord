<?php
require_once __DIR__ . '/../models/HeroConfig.php';

class HeroController {
    private $hero;

    public function __construct() {
        $this->hero = new HeroConfig();
    }

    public function getAll() {
        return $this->hero->obtenerTodos();
    }

    public function getActive() {
        return $this->hero->obtenerActivos();
    }

    public function uploadVideo($file, $titulo) {
        // Check for upload errors
        if ($file['error'] !== UPLOAD_ERR_OK) {
            switch ($file['error']) {
                case UPLOAD_ERR_INI_SIZE:
                case UPLOAD_ERR_FORM_SIZE:
                    throw new Exception("El archivo es demasiado grande. Límite del servidor excedido.");
                case UPLOAD_ERR_PARTIAL:
                    throw new Exception("La subida se interrumpió.");
                case UPLOAD_ERR_NO_FILE:
                    throw new Exception("No se envió ningún archivo.");
                default:
                    throw new Exception("Error desconocido en la subida: " . $file['error']);
            }
        }

        // Correct path to backend/uploads
        // Script is in api/, so ../.. points to backend/
        // We use absolute path to ensure no ambiguity
        $target_base =  __DIR__ . "/../uploads/hero_videos/";
        
        if (!file_exists($target_base)) {
            if (!mkdir($target_base, 0777, true)) {
                 throw new Exception("No se pudo crear el directorio de subida.");
            }
        }

        $fileType = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));
        // Clean filename log
        $cleanTitle = preg_replace("/[^a-zA-Z0-9]/", "", $titulo);
        if (empty($cleanTitle)) $cleanTitle = "video";
        $newFileName = time() . "_" . $cleanTitle . "." . $fileType;
        $target_file = $target_base . $newFileName;

        if ($fileType != "mp4" && $fileType != "webm" && $fileType != "mov") {
             throw new Exception("Solo se permiten archivos MP4, WEBM o MOV.");
        }

        if (move_uploaded_file($file["tmp_name"], $target_file)) {
            $this->hero->titulo = $titulo;
            $this->hero->ruta_video = "uploads/hero_videos/" . $newFileName;
            if ($this->hero->crear()) {
                return ["message" => "Video subido correctamente", "ruta" => $this->hero->ruta_video];
            } else {
                throw new Exception("Error al guardar en base de datos.");
            }
        } else {
            // Check if directory is writable
            if (!is_writable($target_base)) {
                 throw new Exception("El directorio de subida no tiene permisos de escritura.");
            }
            throw new Exception("Error al mover el archivo subido.");
        }
    }

    public function toggleActive($id) {
        if ($this->hero->toggleActivo($id)) {
            return ["message" => "Estado de video actualizado"];
        }
        throw new Exception("Error al actualizar el video.");
    }
    
    public function delete($id) {
        $video = $this->hero->obtenerPorId($id);
        if ($video) {
            // Fix unlink path
            $path = __DIR__ . "/../../backend/" . $video['ruta_video'];
            if (file_exists($path)) {
                unlink($path);
            }
            if ($this->hero->eliminar($id)) {
                return ["message" => "Video eliminado"];
            }
        }
        throw new Exception("Error al eliminar");
    }

    public function updateOrder($items) {
        // Items: [{id, orden}, ...]
        $success = true;
        foreach ($items as $item) {
            // We assume method updateOrden exists in model, or we create it
            // Ideally transactional
            if (!$this->hero->actualizarOrden($item['id'], $item['orden'])) {
                $success = false;
            }
        }
        if ($success) {
            return ["message" => "Orden actualizado"];
        }
        throw new Exception("Error al actualizar orden");
    }
}
?>
