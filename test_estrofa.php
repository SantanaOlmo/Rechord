<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/backend/models/Estrofa.php';

if (class_exists('Estrofa')) {
    echo "Class Estrofa exists.";
    $e = new Estrofa();
    echo " Instantiated.";
} else {
    echo "Class Estrofa NOT found.";
}
?>
