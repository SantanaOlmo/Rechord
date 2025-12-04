<?php
require_once __DIR__ . '/../models/Estrofa.php';
require_once __DIR__ . '/../utils/helper.php';

class EstrofaController {
    private $estrofaModel;

    public function __construct() {
        $this->estrofaModel = new Estrofa();
    }

    public function getEstrofas() {
        setApiHeaders();
        if (!isset($_GET['id_cancion'])) {
            sendResponse(["message" => "Falta id_cancion"], 400);
        }
        $estrofas = $this->estrofaModel->obtenerPorCancion($_GET['id_cancion']);
        sendResponse(["estrofas" => $estrofas]);
    }

    public function getEstrofa($id) {
        // Not implemented/needed yet
    }

    public function crearEstrofa($data) {
        setApiHeaders();
        if (!isset($data['id_cancion'], $data['contenido'])) {
            sendResponse(["message" => "Datos incompletos"], 400);
        }
        
        $orden = $data['orden'] ?? 0;
        $tiempoInicio = $data['tiempo_inicio'] ?? 0;
        $tiempoFin = $data['tiempo_fin'] ?? 0;

        $id = $this->estrofaModel->crear($data['id_cancion'], $data['contenido'], $orden, $tiempoInicio, $tiempoFin);
        
        if ($id) {
            sendResponse(["message" => "Estrofa creada", "id_estrofa" => $id], 201);
        } else {
            sendResponse(["message" => "Error al crear estrofa"], 500);
        }
    }

    public function actualizarEstrofa($data) {
        setApiHeaders();
<<<<<<< HEAD
        
        // Check for Bulk Update (Array)
        if (isset($data[0]) && is_array($data[0])) {
            $success = true;
            foreach ($data as $item) {
                if (isset($item['id_estrofa'])) {
                    if (!$this->estrofaModel->actualizar($item['id_estrofa'], $item['contenido'], $item['tiempo_inicio'], $item['tiempo_fin'])) {
                        $success = false;
                    }
                }
            }
            
            if ($success) sendResponse(["message" => "Estrofas actualizadas correctamente"]);
            else sendResponse(["message" => "Error al actualizar algunas estrofas"], 500);
            return;
        }

        // Single Update
=======
>>>>>>> c82b7bf (feat(likes): Implementada funcionalidad de likes y rediseño de tarjetas. Actualizado project_structure.json)
        if (!isset($data['id_estrofa'])) {
            sendResponse(["message" => "Falta id_estrofa"], 400);
        }
        
        if ($this->estrofaModel->actualizar($data['id_estrofa'], $data['contenido'], $data['tiempo_inicio'], $data['tiempo_fin'])) {
            sendResponse(["message" => "Estrofa actualizada"]);
        } else {
            sendResponse(["message" => "Error al actualizar estrofa"], 500);
        }
    }

    public function eliminarEstrofa($id) {
        setApiHeaders();
        if ($this->estrofaModel->eliminar($id)) {
            sendResponse(["message" => "Estrofa eliminada"]);
        } else {
            sendResponse(["message" => "Error al eliminar estrofa"], 500);
        }
    }
}
