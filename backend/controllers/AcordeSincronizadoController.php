<?php
/**
 * Controlador para gestionar acordes sincronizados con canciones
 */

require_once __DIR__ . '/../db/conexion.php';
require_once __DIR__ . '/../utils/helper.php';

class AcordeSincronizadoController {
    private $pdo;

    public function __construct() {
        $conexion = Conexion::obtenerInstancia();
        $this->pdo = $conexion->obtenerPDO();
    }

    /**
     * Obtiene todos los acordes sincronizados de una canción
     * @param int $id_cancion ID de la canción
     */
    public function getAcordesCancion($id_cancion) {
        setApiHeaders();
        
        try {
            $stmt = $this->pdo->prepare("
                SELECT 
                    acs.id_sincronia_acorde,
                    acs.id_cancion,
                    acs.id_acorde,
                    acs.tiempo_inicio,
                    acs.tiempo_fin,
                    a.nombre as nombre_acorde,
                    a.color_hex
                FROM ACORDE_SINCRONIZADO acs
                INNER JOIN ACORDE a ON acs.id_acorde = a.id_acorde
                WHERE acs.id_cancion = ?
                ORDER BY acs.tiempo_inicio ASC
            ");
            $stmt->execute([$id_cancion]);
            $acordes = $stmt->fetchAll();
            
            sendResponse([
                "message" => "Acordes sincronizados obtenidos",
                "acordes" => $acordes
            ], 200);
        } catch (PDOException $e) {
            error_log("Error al obtener acordes: " . $e->getMessage());
            sendResponse([
                "message" => "Error al obtener acordes sincronizados",
                "error" => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Agrega un nuevo acorde sincronizado
     * @param array $data Datos del acorde sincronizado
     */
    public function agregarAcorde($data) {
        setApiHeaders();
        
        if (!isset($data['id_cancion']) || !isset($data['id_acorde']) || 
            !isset($data['tiempo_inicio']) || !isset($data['tiempo_fin'])) {
            sendResponse([
                "message" => "Faltan campos requeridos: id_cancion, id_acorde, tiempo_inicio, tiempo_fin"
            ], 400);
        }

        try {
            $stmt = $this->pdo->prepare("
                INSERT INTO ACORDE_SINCRONIZADO 
                (id_cancion, id_acorde, tiempo_inicio, tiempo_fin)
                VALUES (?, ?, ?, ?)
            ");
            
            $stmt->execute([
                $data['id_cancion'],
                $data['id_acorde'],
                $data['tiempo_inicio'],
                $data['tiempo_fin']
            ]);
            
            $id = $this->pdo->lastInsertId();
            
            sendResponse([
                "message" => "Acorde sincronizado agregado exitosamente",
                "id_sincronia_acorde" => $id
            ], 201);
        } catch (PDOException $e) {
            error_log("Error al agregar acorde: " . $e->getMessage());
            sendResponse([
                "message" => "Error al agregar acorde sincronizado",
                "error" => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Actualiza un acorde sincronizado existente
     * @param array $data Datos actualizados del acorde
     */
    public function actualizarAcorde($data) {
        setApiHeaders();
        
        if (!isset($data['id_sincronia_acorde'])) {
            sendResponse([
                "message" => "Falta el campo id_sincronia_acorde"
            ], 400);
        }

        try {
            $campos = [];
            $valores = [];
            
            if (isset($data['id_acorde'])) {
                $campos[] = "id_acorde = ?";
                $valores[] = $data['id_acorde'];
            }
            if (isset($data['tiempo_inicio'])) {
                $campos[] = "tiempo_inicio = ?";
                $valores[] = $data['tiempo_inicio'];
            }
            if (isset($data['tiempo_fin'])) {
                $campos[] = "tiempo_fin = ?";
                $valores[] = $data['tiempo_fin'];
            }
            
            if (empty($campos)) {
                sendResponse([
                    "message" => "No hay campos para actualizar"
                ], 400);
            }
            
            $valores[] = $data['id_sincronia_acorde'];
            $sql = "UPDATE ACORDE_SINCRONIZADO SET " . implode(", ", $campos) . " WHERE id_sincronia_acorde = ?";
            
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($valores);
            
            if ($stmt->rowCount() > 0) {
                sendResponse([
                    "message" => "Acorde sincronizado actualizado exitosamente"
                ], 200);
            } else {
                sendResponse([
                    "message" => "No se encontró el acorde sincronizado o no hubo cambios"
                ], 404);
            }
        } catch (PDOException $e) {
            error_log("Error al actualizar acorde: " . $e->getMessage());
            sendResponse([
                "message" => "Error al actualizar acorde sincronizado",
                "error" => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Elimina un acorde sincronizado
     * @param int $id_sincronia ID del acorde sincronizado
     */
    public function eliminarAcorde($id_sincronia) {
        setApiHeaders();
        
        if (!isset($id_sincronia) || !is_numeric($id_sincronia)) {
            sendResponse([
                "message" => "ID de sincronización inválido"
            ], 400);
        }

        try {
            $stmt = $this->pdo->prepare("DELETE FROM ACORDE_SINCRONIZADO WHERE id_sincronia_acorde = ?");
            $stmt->execute([$id_sincronia]);
            
            if ($stmt->rowCount() > 0) {
                sendResponse([
                    "message" => "Acorde sincronizado eliminado exitosamente"
                ], 200);
            } else {
                sendResponse([
                    "message" => "No se encontró el acorde sincronizado"
                ], 404);
            }
        } catch (PDOException $e) {
            error_log("Error al eliminar acorde: " . $e->getMessage());
            sendResponse([
                "message" => "Error al eliminar acorde sincronizado",
                "error" => $e->getMessage()
            ], 500);
        }
    }
}


