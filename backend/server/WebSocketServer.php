<?php
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;

require dirname(__DIR__) . '/../vendor/autoload.php';
require dirname(__DIR__) . '/websocket/WSRouter.php';

class WebSocketServer implements MessageComponentInterface {
    protected $clients;
    protected $router;
    
    // Map connection ID to User ID if authentication were implemented
    protected $users = []; 

    public function __construct() {
        $this->clients = new \SplObjectStorage;
        $this->router = new WSRouter();
        echo "WebSocket Server Initialized\n";
    }

    public function onOpen(ConnectionInterface $conn) {
        $this->clients->attach($conn);
        echo "New connection! ({$conn->resourceId})\n";
    }

    public function onMessage(ConnectionInterface $from, $msg) {
        echo "Message from {$from->resourceId}: $msg\n";
        
        // Delegate to WSRouter
        $response = $this->router->handle($from->resourceId, $msg);

        if (!$response) return;

        // Handle Router Response
        if (isset($response['status'])) {
            if ($response['status'] === 'broadcast') {
                $this->broadcast($response['data'], $response['recipients'] ?? null);
            } elseif ($response['status'] === 'success' || $response['status'] === 'error') {
                // Determine if we need to reply to sender (often useful for ACK)
                // For now, let's reply to sender with the result
                $from->send(json_encode($response));
            }
        }
    }

    public function onClose(ConnectionInterface $conn) {
        $this->clients->detach($conn);
        echo "Connection {$conn->resourceId} has disconnected\n";
        
        // Ensure user leaves any rooms logic? 
        // Ideally WSRouter/RoomManager should handle sudden disconnects if we tracked them.
        // For now, simple detach.
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "An error has occurred: {$e->getMessage()}\n";
        $conn->close();
    }

    private function broadcast($data, $targetGroup = null) {
        // Simple broadcast to all. 
        // In a real app, $targetGroup (e.g., "room:123") would act as a filter.
        // Since SplObjectStorage doesn't index by room, we broadcast to all 
        // and let frontend filter, OR (better) we implement room tracking here.
        // Given current architecture constraints, we will broadcast to ALL connected clients
        // and let the frontend ignore if not relevant, OR implement a simple room map here.
        
        // Optimization: For this iteration, broadcast to ALL.
        $msg = json_encode($data);
        foreach ($this->clients as $client) {
            $client->send($msg);
        }
    }
}

// Run the Server
$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new WebSocketServer()
        )
    ),
    8080
);

echo "Server running at port 8080...\n";
$server->run();
