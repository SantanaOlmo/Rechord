<?php
require_once __DIR__ . '/../models/Sala.php';

class RoomManager {
    private $salaModel;

    public function __construct() {
        $this->salaModel = new Sala();
    }

    public function createRoom($userId) {
        // Generar código de sala único (ej. 6 caracteres alfanuméricos)
        $roomId = strtoupper(substr(bin2hex(random_bytes(3)), 0, 6));
        
        // Persistir en DB
        if ($this->salaModel->crear($roomId, $userId)) {
            return $roomId;
        }
        throw new Exception("Error al crear la sala");
    }

    public function joinRoom($roomId, $userId) {
        $sala = $this->salaModel->obtenerPorCodigo($roomId);
        if (!$sala) {
            throw new Exception("Sala no encontrada o inactiva");
        }
        // Aquí podríamos registrar al usuario en una tabla 'SALA_USUARIOS' si fuera necesario
        return true;
    }

    public function leaveRoom($roomId, $userId) {
        // Lógica para remover usuario (opcional si es stateless o si persistimos miembros)
        // Por ahora, si es el maestro el que sale, podríamos cerrar la sala
        $sala = $this->salaModel->obtenerPorCodigo($roomId);
        if ($sala && $sala['id_maestro'] == $userId) {
            $this->salaModel->deshabilitar($roomId);
        }
    }

    public function updatePlaybackState($roomId, $action, $position, $songId) {
        // Validar que la sala exista
        $sala = $this->salaModel->obtenerPorCodigo($roomId);
        if (!$sala) throw new Exception("Sala no válida");

        // Actualizar estado en DB (Snapshot para nuevos usuarios)
        $isPlaying = ($action === 'PLAY' || $action === 'RESUME');
        $this->salaModel->actualizarEstado($roomId, $songId, $position, $isPlaying);

        return true;
    }
}
