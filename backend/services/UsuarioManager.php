<?php
require_once __DIR__ . '/../models/Usuario.php';

class UsuarioManager {
    private $usuarioModel;

    public function __construct() {
        $this->usuarioModel = new Usuario();
    }

    public function searchUsuarios($termino) {
        // Sanitize or additional logic if needed
        if (empty($termino) || strlen($termino) < 2) {
            return [];
        }
        return $this->usuarioModel->buscarUsuario($termino);
    }
}
