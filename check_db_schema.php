<?php
require_once 'db/conexion.php';

try {
    $pdo = Conexion::obtenerInstancia()->obtenerPDO();
    
    echo "--- chat_mensajes ---\n";
    $stmt = $pdo->query("SHOW CREATE TABLE chat_mensajes");
    print_r($stmt->fetch(PDO::FETCH_ASSOC));

    echo "\n--- chat_conversaciones ---\n";
    $stmt = $pdo->query("SHOW CREATE TABLE chat_conversaciones");
    print_r($stmt->fetch(PDO::FETCH_ASSOC));

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
