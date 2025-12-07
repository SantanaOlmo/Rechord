<?php
require_once __DIR__ . '/../../db/conexion.php';

class Cancion {
    private $pdo;

    public function __construct() {
        $conexion = Conexion::obtenerInstancia();
        $this->pdo = $conexion->obtenerPDO();
    }

    public function crear($id_usuario, $titulo, $artista, $nivel, $rutaMp3, $rutaImagen = null, $album = null, $duracion = 0, $hashtags = null, $fecha_lanzamiento = null) {
        $sql = "INSERT INTO CANCION (id_usuario, titulo, artista, nivel, ruta_mp3, ruta_imagen, album, duracion, hashtags, fecha_lanzamiento, fecha_creacion) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
        
        $stmt = $this->pdo->prepare($sql);
        
        // Hashtags to JSON string if array
        $hashtagsJson = is_array($hashtags) ? json_encode($hashtags) : $hashtags;

        if ($stmt->execute([$id_usuario, $titulo, $artista, $nivel, $rutaMp3, $rutaImagen, $album, $duracion, $hashtagsJson, $fecha_lanzamiento])) {
            return $this->pdo->lastInsertId();
        }
        return false;
    }

    public function actualizar($id, $titulo, $artista, $nivel, $album, $duracion, $hashtags, $fecha_lanzamiento, $rutaImagen = null) {
        $sql = "UPDATE CANCION SET titulo = ?, artista = ?, nivel = ?, album = ?, duracion = ?, hashtags = ?, fecha_lanzamiento = ?";
        $params = [$titulo, $artista, $nivel, $album, $duracion, $hashtagsJson = is_array($hashtags) ? json_encode($hashtags) : $hashtags, $fecha_lanzamiento];
        
        if ($rutaImagen) {
            $sql .= ", ruta_imagen = ?";
            $params[] = $rutaImagen;
        }

        $sql .= " WHERE id_cancion = ?";
        $params[] = $id;

        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute($params);
    }

    public function obtenerPorId($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM CANCION WHERE id_cancion = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function obtenerTodas($idUsuario = null) {
        // ... (Existing logic for liked status is good, just adding order)
        // Note: For "Recent" we use this one.
        $sql = "SELECT c.*";
        if ($idUsuario) {
            $sql .= ", (SELECT COUNT(*) FROM LIKE_CANCION l WHERE l.id_cancion = c.id_cancion AND l.id_usuario = ?) as is_liked";
        } else {
            $sql .= ", 0 as is_liked";
        }
        $sql .= " FROM CANCION c ORDER BY c.fecha_creacion DESC";
        
        $stmt = $this->pdo->prepare($sql);
        if ($idUsuario) $stmt->execute([$idUsuario]);
        else $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerPopulares($limit = 10, $idUsuario = null) {
        $sql = "SELECT c.*, COUNT(l.id_like) as total_likes";
        if ($idUsuario) {
            $sql .= ", (SELECT COUNT(*) FROM LIKE_CANCION l2 WHERE l2.id_cancion = c.id_cancion AND l2.id_usuario = ?) as is_liked";
        } else {
            $sql .= ", 0 as is_liked";
        }
        
        $sql .= " FROM CANCION c 
                  LEFT JOIN LIKE_CANCION l ON c.id_cancion = l.id_cancion 
                  GROUP BY c.id_cancion 
                  HAVING total_likes > 0
                  ORDER BY total_likes DESC, c.fecha_creacion DESC 
                  LIMIT " . (int)$limit;

        $stmt = $this->pdo->prepare($sql);
        if ($idUsuario) $stmt->execute([$idUsuario]);
        else $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerPorHashtag($hashtag, $idUsuario = null) {
        // MySQL 5.7+ JSON support: JSON_CONTAINS(hashtags, '"tag"') or LIKE '%"tag"%'
        // Using LIKE for broader compatibility if JSON type isn't strictly enforced or old MariaDB
        // But ideal is JSON_SEARCH or JSON_CONTAINS. Let's use JSON_SEARCH for exact match in array
        // "One of the hashtags" matches.
        
        $sql = "SELECT c.*";
        if ($idUsuario) {
            $sql .= ", (SELECT COUNT(*) FROM LIKE_CANCION l WHERE l.id_cancion = c.id_cancion AND l.id_usuario = ?) as is_liked";
        } else {
            $sql .= ", 0 as is_liked";
        }
        
        // JSON_CONTAINS requires the target to be a JSON doc, passing keys
        // Simpler approach for simple array: WHERE JSON_SEARCH(hashtags, 'one', ?) IS NOT NULL
        $sql .= " FROM CANCION c WHERE JSON_SEARCH(c.hashtags, 'one', ?) IS NOT NULL ORDER BY c.fecha_creacion DESC";

        $stmt = $this->pdo->prepare($sql);
        $params = [$hashtag];
        if ($idUsuario) array_unshift($params, $idUsuario);

        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function toggleLike($idUsuario, $idCancion) {
        // Verificar si ya existe el like
        $stmt = $this->pdo->prepare("SELECT id_like FROM LIKE_CANCION WHERE id_usuario = ? AND id_cancion = ?");
        $stmt->execute([$idUsuario, $idCancion]);
        $like = $stmt->fetch();

        if ($like) {
            // Quitar like
            $stmt = $this->pdo->prepare("DELETE FROM LIKE_CANCION WHERE id_usuario = ? AND id_cancion = ?");
            $stmt->execute([$idUsuario, $idCancion]);
            return false; // Liked = false
        } else {
            // Dar like
            $stmt = $this->pdo->prepare("INSERT INTO LIKE_CANCION (id_usuario, id_cancion) VALUES (?, ?)");
            $stmt->execute([$idUsuario, $idCancion]);
            return true; // Liked = true
        }
    }

    public function buscar($term, $idUsuario = null) {
        $termWild = "%$term%";
        $termStart = "$term%";

        $sql = "SELECT c.*, 
                (CASE 
                    WHEN c.titulo = ? THEN 1 
                    WHEN c.titulo LIKE ? THEN 2 
                    ELSE 3 
                END) as relevance";

        if ($idUsuario) {
            $sql .= ", (SELECT COUNT(*) FROM LIKE_CANCION l WHERE l.id_cancion = c.id_cancion AND l.id_usuario = ?) as is_liked";
        } else {
            $sql .= ", 0 as is_liked";
        }
        
        $sql .= " FROM CANCION c WHERE c.titulo LIKE ? OR c.artista LIKE ? OR c.hashtags LIKE ? 
                  ORDER BY relevance ASC, c.titulo ASC LIMIT 20";
        
        $stmt = $this->pdo->prepare($sql);
        
        // Params: ExactTerm, StartTerm, [User], WildTerm, WildTerm, WildTerm
        $params = [$term, $termStart];
        if ($idUsuario) $params[] = $idUsuario;
        array_push($params, $termWild, $termWild, $termWild);
        
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function eliminar($id) {
        $stmt = $this->pdo->prepare("DELETE FROM CANCION WHERE id_cancion = ?");
        return $stmt->execute([$id]);
    }
}
