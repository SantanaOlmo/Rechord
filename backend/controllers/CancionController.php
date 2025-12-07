<?php
require_once __DIR__ . '/../services/CancionManager.php';
require_once __DIR__ . '/../utils/helper.php';

class CancionController {
    private $manager;

    public function __construct() {
        $this->manager = new CancionManager();
    }

    private function getUserId() {
        $headers = getallheaders();
        return $headers['X-User-Id'] ?? null;
    }

    public function getCanciones() {
        setApiHeaders();
        $idUsuario = $this->getUserId();
        try {
            if (isset($_GET['search']) && !empty($_GET['search'])) {
                $canciones = $this->manager->searchCanciones($_GET['search'], $idUsuario);
            } else {
                $canciones = $this->manager->getAll($idUsuario);
            }
            sendResponse(["canciones" => $canciones]);
        } catch (Exception $e) {
            sendResponse(["message" => $e->getMessage()], 500);
        }
    }

    public function getHomeData() {
        setApiHeaders();
        try {
            $sections = $this->manager->getHomeSections($this->getUserId());
            sendResponse(["sections" => $sections]);
        } catch (Exception $e) {
            sendResponse(["message" => $e->getMessage()], 500);
        }
    }

    public function getCancion($id) {
        setApiHeaders();
        $cancion = $this->manager->getById($id);
        if ($cancion) sendResponse(["cancion" => $cancion]);
        else sendResponse(["message" => "No encontrada"], 404);
    }

    public function toggleLike($data) {
        setApiHeaders();
        if (!isset($data['id_usuario'], $data['id_cancion'])) {
            sendResponse(["message" => "Faltan datos"], 400);
        }
        $res = $this->manager->toggleLike($data['id_usuario'], $data['id_cancion']);
        sendResponse(["message" => "Like actualizado", "is_liked" => $res]);
    }

    /**
     * Endpoint: CREAR Canción
     */
    public function crearCancion($postData, $files) {
        setApiHeaders();
        try {
            // Delegamos TODO al Manager: validación, archivos, lógica.
            $id = $this->manager->uploadCancion($postData, $files, $postData['id_usuario'] ?? null);
            sendResponse(["message" => "Canción creada exitosamente", "id_cancion" => $id], 201);
        } catch (Exception $e) {
            sendResponse(["message" => $e->getMessage()], 400);
        }
    }

    public function actualizarCancion($postData, $files = []) {
        setApiHeaders();
        if (!isset($postData['id_cancion'])) sendResponse(["message" => "ID requerido"], 400);
        
        try {
            // Pasamos archivos al Manager para que decida si actualiza o no
            if ($this->manager->updateCancion($postData['id_cancion'], $postData, $files)) {
                sendResponse(["message" => "Canción actualizada"]);
            } else {
                sendResponse(["message" => "No se pudo actualizar"], 500);
            }
        } catch (Exception $e) {
            sendResponse(["message" => $e->getMessage()], 400);
        }
    }

    public function eliminarCancion($id) {
        setApiHeaders();
        if ($this->manager->delete($id)) sendResponse(["message" => "Eliminada"]);
        else sendResponse(["message" => "No se pudo eliminar"], 500);
    }
    
    // --- Home Config Admin ---

    public function addHomeCategory($data) {
        setApiHeaders();
        if ($this->manager->addHomeCategory($data['tipo'], $data['valor'], $data['titulo'], $data['orden'] ?? 99)) {
            sendResponse(["message" => "Categoría añadida"]);
        } else sendResponse(["message" => "Error"], 500);
    }

    public function deleteHomeCategory($id) {
        setApiHeaders();
        if ($this->manager->deleteHomeCategory($id)) {
            sendResponse(["message" => "Categoría eliminada"]);
        } else sendResponse(["message" => "Error"], 500);
    }

    public function updateConfigOrder($items) {
        setApiHeaders();
        if ($this->manager->updateConfigOrder($items)) {
            sendResponse(["message" => "Orden actualizado"]);
        } else sendResponse(["message" => "Error actualizando alguno"], 500);
    }
}
?>
