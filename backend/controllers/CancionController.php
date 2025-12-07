<?php
require_once __DIR__ . '/../services/CancionService.php';
require_once __DIR__ . '/../utils/helper.php';

class CancionController {
    private $service;

    public function __construct() {
        $this->service = new CancionService();
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
                $canciones = $this->service->search($_GET['search'], $idUsuario);
            } else {
                $canciones = $this->service->getAll($idUsuario);
            }
            sendResponse(["canciones" => $canciones]);
        } catch (Exception $e) {
            sendResponse(["message" => $e->getMessage()], 500);
        }
    }

    public function getHomeData() {
        setApiHeaders();
        try {
            $sections = $this->service->getHomeSections($this->getUserId());
            sendResponse(["sections" => $sections]);
        } catch (Exception $e) {
            sendResponse(["message" => $e->getMessage()], 500);
        }
    }

    public function getCancion($id) {
        setApiHeaders();
        $cancion = $this->service->getById($id);
        if ($cancion) sendResponse(["cancion" => $cancion]);
        else sendResponse(["message" => "No encontrada"], 404);
    }

    public function toggleLike($data) {
        setApiHeaders();
        if (!isset($data['id_usuario'], $data['id_cancion'])) {
            sendResponse(["message" => "Faltan datos"], 400);
        }
        $res = $this->service->toggleLike($data['id_usuario'], $data['id_cancion']);
        sendResponse(["message" => "Like actualizado", "is_liked" => $res]);
    }

    public function crearCancion($postData, $files) {
        setApiHeaders();
        try {
            $id = $this->service->create($postData['id_usuario'] ?? null, $postData, $files);
            sendResponse(["message" => "Creada", "id_cancion" => $id], 201);
        } catch (Exception $e) {
            sendResponse(["message" => $e->getMessage()], 400);
        }
    }

    public function actualizarCancion($postData, $files = []) {
        setApiHeaders();
        if (!isset($postData['id_cancion'])) sendResponse(["message" => "ID requerido"], 400);
        
        // Merge files into data for service
        if (!empty($files)) {
            $postData['files'] = $files;
        }

        try {
            if ($this->service->update($postData['id_cancion'], $postData)) {
                sendResponse(["message" => "Actualizada"]);
            } else {
                sendResponse(["message" => "No se pudo actualizar"], 500);
            }
        } catch (Exception $e) {
            sendResponse(["message" => $e->getMessage()], 400);
        }
    }

    public function eliminarCancion($id) {
        setApiHeaders();
        if ($this->service->delete($id)) sendResponse(["message" => "Eliminada"]);
        else sendResponse(["message" => "No se pudo eliminar"], 500);
    }
    
    public function addHomeCategory($data) {
        setApiHeaders();
        // Check Admin logic needed here or in service? keeping thin.
        if ($this->service->addHomeCategory($data['tipo'], $data['valor'], $data['titulo'], $data['orden'] ?? 99)) {
            sendResponse(["message" => "Categoría añadida"]);
        } else sendResponse(["message" => "Error"], 500);
    }

    public function deleteHomeCategory($id) {
        setApiHeaders();
        if ($this->service->deleteHomeCategory($id)) {
            sendResponse(["message" => "Categoría eliminada"]);
        } else sendResponse(["message" => "Error"], 500);
    }

    public function updateConfigOrder($items) {
        setApiHeaders();
        if ($this->service->updateConfigOrder($items)) {
            sendResponse(["message" => "Orden actualizado"]);
        } else sendResponse(["message" => "Error actualizando alguno"], 500);
    }
}
?>
