<?php
require_once __DIR__ . '/../services/RoomManager.php';

class WSRouter {
    private $roomManager;

    public function __construct() {
        $this->roomManager = new RoomManager();
    }

    public function handle($connectionId, $message) {
        $data = json_decode($message, true);
        if (!$data || !isset($data['action'])) {
            return ['status' => 'error', 'message' => 'Invalid JSON or missing action'];
        }

        $action = $data['action'];
        $payload = $data['payload'] ?? [];
        $userId = $payload['userId'] ?? 0; // In real WS, userId comes from session/token associated with connectionId

        try {
            switch ($action) {
                case 'CREATE_ROOM':
                    $roomId = $this->roomManager->createRoom($userId);
                    return ['status' => 'success', 'action' => 'ROOM_CREATED', 'payload' => ['roomId' => $roomId]];
                
                case 'JOIN_ROOM':
                    $roomId = $payload['roomId'] ?? '';
                    if ($this->roomManager->joinRoom($roomId, $userId)) {
                        return ['status' => 'success', 'action' => 'ROOM_JOINED', 'payload' => ['roomId' => $roomId]];
                    }
                    return ['status' => 'error', 'message' => 'Could not join room'];

                case 'LEAVE_ROOM':
                    $roomId = $payload['roomId'] ?? '';
                    $this->roomManager->leaveRoom($roomId, $userId);
                    return ['status' => 'success', 'action' => 'ROOM_LEFT'];

                case 'UPDATE_PLAYBACK':
                    $roomId = $payload['roomId'] ?? '';
                    $stateAction = $payload['stateAction'] ?? 'PAUSE'; // PLAY, PAUSE, SEEK
                    $position = $payload['position'] ?? 0;
                    $songId = $payload['songId'] ?? 0;
                    
                    $this->roomManager->updatePlaybackState($roomId, $stateAction, $position, $songId);
                    
                    // The Router would typically broadcast this to other clients in the room via the Server instance
                    return [
                        'status' => 'broadcast', 
                        'recipients' => 'room:' . $roomId, 
                        'data' => [
                            'action' => 'PLAYBACK_UPDATED',
                            'payload' => [
                                'stateAction' => $stateAction,
                                'position' => $position,
                                'songId' => $songId
                            ]
                        ]
                    ];

                default:
                    return ['status' => 'error', 'message' => 'Unknown action'];
            }
        } catch (Exception $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }
}
