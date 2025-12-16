<?php
require_once __DIR__ . '/conexion.php';

try {
    $conexion = Conexion::obtenerInstancia();
    $pdo = $conexion->obtenerPDO();
    
    $sql = file_get_contents(__DIR__ . '/add_acordes_column.sql');
    
    // Check if column exists first to avoid error
    $check = $pdo->query("SHOW COLUMNS FROM CANCION LIKE 'acordes'");
    if ($check->rowCount() == 0) {
        $pdo->exec($sql);
        echo "Migration successful: 'acordes' column added.\n";
    } else {
        echo "Column 'acordes' already exists. Skipping.\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
