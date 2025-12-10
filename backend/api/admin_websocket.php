<?php
require_once '../config/database.php';
require_once '../controllers/UsuarioController.php';

header("Content-Type: application/json");
session_start();

// 1. Verify Admin Session (Basic check, enhance as needed)
// Assuming authService stores user info in session or headers. 
// For simplicity, we'll check if a known admin session exists or rely on the password verification.
// Ideally, use JWT or Session validation from UsuarioController.

$input = json_decode(file_get_contents("php://input"), true);
$action = $_GET['action'] ?? $input['action'] ?? '';

$response = ["status" => "error", "message" => "Invalid request"];

// Helper to check if port 8080 is open
function isPortOpen($host, $port, $timeout = 1) {
    $connection = @fsockopen($host, $port, $errno, $errstr, $timeout);
    if (is_resource($connection)) {
        fclose($connection);
        return true;
    }
    return false;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'status') {
    $isOpen = isPortOpen('127.0.0.1', 8080);
    echo json_encode(["status" => "success", "isRunning" => $isOpen]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $password = $input['password'] ?? '';
    $userId = $input['userId'] ?? 0;

    // 2. Validate Password
    $db = new Database();
    $conn = $db->getConnection();
    
    // Fetch user hash - This logic assumes you pass the current admin's ID
    $query = "SELECT password_hash, rol FROM usuario WHERE id_usuario = :id LIMIT 1";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(":id", $userId);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || $user['rol'] !== 'admin' || !password_verify($password, $user['password_hash'])) {
        http_response_code(403);
        echo json_encode(["status" => "error", "message" => "Unauthorized or Invalid Password"]);
        exit;
    }

    if ($action === 'start') {
        if (isPortOpen('127.0.0.1', 8080)) {
            echo json_encode(["status" => "success", "message" => "Server already running"]);
        } else {
            // Start Background Process (Windows)
            // Point to the correct PHP executable and script path.
            // Using absolute paths based on user environment would be safer, but relative for now.
            $phpPath = "c:\\xampp\\php\\php.exe"; 
            $scriptPath = realpath(__DIR__ . '/../server/WebSocketServer.php');
            $logPath = realpath(__DIR__ . '/../../ws_log.txt');
            
            // start /B runs in background. 
            $cmd = "start /B \"\" \"$phpPath\" \"$scriptPath\" > \"$logPath\" 2>&1";
            pclose(popen($cmd, "r"));
            
            // Wait a bit to check status
            sleep(2);
            $isRunning = isPortOpen('127.0.0.1', 8080);
            
            if ($isRunning) {
                echo json_encode(["status" => "success", "message" => "Server started"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Failed to start server. Check logs."]);
            }
        }
    } elseif ($action === 'stop') {
        // Kill PHP process running WebSocketServer.php
        // This is a bit "nuclear" as it might kill other PHP scripts if not careful, 
        // but typically WebSocketServer.php is the only long-running generic PHP script.
        // A better way is to store PID. For now, taskkill by windowtitle or similar is hard in PHP without PID.
        // We will try to kill php.exe processes that look like they are the server (risky).
        // SAFEST: Kill any php.exe? No.
        // REALSTIC WINDOWS DEV ENV: Just kill the specific task if possible.
        // Fallback: Instruct user to kill it manually if this fails.
        // Actually, let's look for the port 8080 usage and kill that PID.
        
        $pid = null;
        // netstat to find PID on port 8080
        exec("netstat -ano | findstr :8080", $output);
        foreach ($output as $line) {
            if (strpos($line, 'LISTENING') !== false) {
                $parts = preg_split('/\s+/', trim($line));
                $pid = end($parts);
                break;
            }
        }

        if ($pid) {
            exec("taskkill /F /PID $pid");
            echo json_encode(["status" => "success", "message" => "Server stopped (PID: $pid)"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Could not find process on port 8080"]);
        }
    }
}
?>
