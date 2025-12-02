<?php
require_once 'config.php';

header('Content-Type: application/json');

try {
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
    $pdo = new PDO($dsn, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $tables = [];
    $stmt = $pdo->query("SHOW TABLES");
    while ($row = $stmt->fetch(PDO::FETCH_NUM)) {
        $tableName = $row[0];
        $tableData = ['name' => $tableName, 'columns' => []];
        
        $stmtCols = $pdo->query("DESCRIBE `$tableName`");
        while ($col = $stmtCols->fetch(PDO::FETCH_ASSOC)) {
            $tableData['columns'][] = [
                'field' => $col['Field'],
                'type' => $col['Type'],
                'key' => $col['Key'],
                'default' => $col['Default'],
                'extra' => $col['Extra']
            ];
        }
        $tables[$tableName] = $tableData;
    }

    $json = json_encode($tables, JSON_PRETTY_PRINT);
    file_put_contents('schema_output.json', $json);
    echo "Schema saved to schema_output.json";

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
