<?php
require_once __DIR__ . '/../../db/conexion.php';

try {
    $conexion = Conexion::obtenerInstancia();
    $pdo = $conexion->obtenerPDO();

    echo "Verificando estructura de la tabla USUARIO...\n";

    // Check if 'role' column exists
    $stmt = $pdo->query("SHOW COLUMNS FROM USUARIO LIKE 'rol'");
    $result = $stmt->fetch();

    if (!$result) {
        echo "La columna 'rol' no existe. Añadiéndola...\n";
        // Default to 'user', not null
        $pdo->exec("ALTER TABLE USUARIO ADD COLUMN rol VARCHAR(20) NOT NULL DEFAULT 'user'");
        echo "Columna 'rol' añadida correctamente.\n";
    } else {
        echo "La columna 'rol' ya existe.\n";
    }

    // Set a specific user as admin for testing (e.g., the first user found or a specific email if known)
    // For this migration, let's just make the first user an admin if no admin exists
    $stmt = $pdo->query("SELECT count(*) FROM USUARIO WHERE rol = 'admin'");
    $adminCount = $stmt->fetchColumn();

    if ($adminCount == 0) {
        echo "No hay administradores. Convirtiendo al primer usuario en admin...\n";
        // Get first user
        $stmt = $pdo->query("SELECT id_usuario FROM USUARIO ORDER BY id_usuario ASC LIMIT 1");
        $firstUser = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($firstUser) {
            $updateStmt = $pdo->prepare("UPDATE USUARIO SET rol = 'admin' WHERE id_usuario = ?");
            $updateStmt->execute([$firstUser['id_usuario']]);
            echo "Usuario ID {$firstUser['id_usuario']} ahora es ADMINISTRADOR.\n";
        } else {
            echo "No hay usuarios en la base de datos para hacer admin.\n";
        }
    } else {
        echo "Ya existe al menos un administrador.\n";
    }

    echo "Migración completada.\n";

} catch (Exception $e) {
    die("Error en la migración: " . $e->getMessage() . "\n");
}
