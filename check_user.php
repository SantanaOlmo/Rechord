<?php
require_once 'db/conexion.php';

try {
    $pdo = Conexion::obtenerInstancia()->obtenerPDO();
    $stmt = $pdo->query("SELECT * FROM usuario WHERE nombre = 'Rechord'");
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    print_r($user);
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
