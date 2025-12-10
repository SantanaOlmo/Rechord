<?php
$url = 'http://localhost/rechordb/backend/api/chat.php';
$data = [
    'action' => 'send',
    'sender_id' => 3, 
    'receiver_id' => 4,
    'content' => 'Test message final verification'
];

$options = [
    'http' => [
        'header'  => "Content-type: application/json\r\n",
        'method'  => 'POST',
        'content' => json_encode($data),
        'ignore_errors' => true
    ]
];

$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);

echo "Headers:\n";
print_r($http_response_header);
echo "\nBody:\n";
var_dump($result);
