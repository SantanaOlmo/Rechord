<?php
require_once 'db/conexion.php';

try {
    $pdo = Conexion::obtenerInstancia()->obtenerPDO();
    $sql = file_get_contents('fix_chat_autoinc.sql');
    
    // Split by line or semicolon if needed, but PDO exec usually handles multiple queries if driver allows, 
    // or we split manually. MySQL usually requires splitting for prepared statements but exec might work.
    // Safer to split.
    $statements = array_filter(array_map('trim', explode(';', $sql)));

    foreach ($statements as $stmt) {
        if (!empty($stmt)) {
            echo "Executing: " . substr($stmt, 0, 50) . "...\n";
            $pdo->exec($stmt);
        }
    }
    echo "SQL Fix Applied Successfully.\n";

} catch (Exception $e) {
    echo "Error applying fix: " . $e->getMessage() . "\n";
}
