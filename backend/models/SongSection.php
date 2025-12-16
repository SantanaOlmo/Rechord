<?php
require_once __DIR__ . '/../../db/conexion.php';

class SongSection {
    private $pdo;

    public function __construct() {
        $conexion = Conexion::obtenerInstancia();
        $this->pdo = $conexion->obtenerPDO();
    }

    public function obtenerPorCancion($songId) {
        $stmt = $this->pdo->prepare("SELECT * FROM song_sections WHERE song_id = ? ORDER BY start_time ASC");
        $stmt->execute([$songId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function crear($songId, $label, $start, $end, $chords) {
        // Prepare Chords JSON
        $chordsJson = is_array($chords) ? json_encode($chords) : $chords;
        if (empty($chordsJson)) $chordsJson = '[]';

        $sql = "INSERT INTO song_sections (song_id, label, start_time, end_time, chords) VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->pdo->prepare($sql);
        
        if ($stmt->execute([$songId, $label, $start, $end, $chordsJson])) {
            return $this->pdo->lastInsertId();
        }
        // Debug error
        // error_log(print_r($stmt->errorInfo(), true));
        return false;
    }

    public function eliminarPorCancion($songId) {
        $stmt = $this->pdo->prepare("DELETE FROM song_sections WHERE song_id = ?");
        return $stmt->execute([$songId]);
    }
}
