<?php
require_once '../../db/conexion.php';
// require_once '../utils/helpers.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// Helper to send json
function sendJson($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

try {
    $conexion = Conexion::obtenerInstancia();
    $pdo = $conexion->obtenerPDO();

    // GET /cancion_fondos.php?id_cancion=123
    if ($method === 'GET') {
        $id_cancion = $_GET['id_cancion'] ?? null;
        if (!$id_cancion) sendJson(['error' => 'Missing id_cancion'], 400);

        $stmt = $pdo->prepare("SELECT * FROM cancion_fondos WHERE id_cancion = ? ORDER BY orden ASC, id_fondo ASC");
        $stmt->execute([$id_cancion]);
        $fondos = $stmt->fetchAll(PDO::FETCH_ASSOC);

        sendJson($fondos);
    }

    // POST /cancion_fondos.php
    // Action: upload
    if ($method === 'POST' && $action === 'upload') {
        $id_cancion = $_POST['id_cancion'] ?? null;
        if (!$id_cancion) sendJson(['error' => 'Missing id_cancion'], 400);
        if (!isset($_FILES['file'])) sendJson(['error' => 'No file uploaded'], 400);

        // Upload Logic
        $uploadDir = '../uploads/backgrounds/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

        $file = $_FILES['file'];
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        
        $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        if (!in_array($ext, $allowed)) {
            sendJson(['error' => 'Invalid file type. Allowed: jpg, png, gif, webp'], 400);
        }

        $filename = 'bg_' . $id_cancion . '_' . uniqid() . '.' . $ext;
        $targetPath = $uploadDir . $filename;

        // Simplify relative path for DB
        $dbPath = 'uploads/backgrounds/' . $filename;

        if (move_uploaded_file($file['tmp_name'], $targetPath)) {
            $stmt = $pdo->prepare("INSERT INTO cancion_fondos (id_cancion, ruta_fondo, orden) VALUES (?, ?, 0)");
            $stmt->execute([$id_cancion, $dbPath]);
            
            sendJson(['success' => true, 'id_fondo' => $pdo->lastInsertId(), 'ruta_fondo' => $dbPath]);
        } else {
            sendJson(['error' => 'Upload failed'], 500);
        }
    }

    // DELETE /cancion_fondos.php?id_fondo=123
    if ($method === 'DELETE') {
        $id_fondo = $_GET['id_fondo'] ?? null;
        if (!$id_fondo) sendJson(['error' => 'Missing id_fondo'], 400);

        // Get path to delete file
        $stmt = $pdo->prepare("SELECT ruta_fondo FROM cancion_fondos WHERE id_fondo = ?");
        $stmt->execute([$id_fondo]);
        $fondo = $stmt->fetch();

        if ($fondo) {
            $filePath = '../' . $fondo['ruta_fondo'];
            if (file_exists($filePath)) unlink($filePath);
            
            $delParams = [$id_fondo];
            $stmt = $pdo->prepare("DELETE FROM cancion_fondos WHERE id_fondo = ?");
            $stmt->execute($delParams);
            sendJson(['success' => true]);
        } else {
            sendJson(['error' => 'Not found'], 404);
        }
    }

} catch (Exception $e) {
    sendJson(['error' => $e->getMessage()], 500);
}
