<?php
require_once __DIR__ . '/../../db/conexion.php';

class Usuario {
    private $pdo;

    public function __construct() {
        $conexion = Conexion::obtenerInstancia();
        $this->pdo = $conexion->obtenerPDO();
    }

    public function registrar($nombre, $email, $password) {
        $stmt = $this->pdo->prepare("SELECT id_usuario FROM USUARIO WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            return 'duplicate_email';
        }

        $passwordHash = password_hash($password, PASSWORD_DEFAULT);

        $stmt = $this->pdo->prepare("INSERT INTO USUARIO (nombre, email, password_hash) VALUES (?, ?, ?)");
        if ($stmt->execute([$nombre, $email, $passwordHash])) {
            return $this->pdo->lastInsertId();
        }
        return false;
    }

    public function login($email, $password) {
        $stmt = $this->pdo->prepare("SELECT * FROM USUARIO WHERE email = ?");
        $stmt->execute([$email]);
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($usuario && password_verify($password, $usuario['password_hash'])) {
            unset($usuario['password_hash']);
            return $usuario;
        }
        return false;
    }

    public function obtenerTodos() {
        $stmt = $this->pdo->query("SELECT id_usuario, nombre, email, rol, fecha_registro, foto_perfil, banner, bio FROM USUARIO");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerPorId($id) {
        $stmt = $this->pdo->prepare("SELECT id_usuario, nombre, email, rol, fecha_registro, foto_perfil, banner, bio FROM USUARIO WHERE id_usuario = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function actualizarFoto($id, $rutaFoto) {
        $stmt = $this->pdo->prepare("UPDATE USUARIO SET foto_perfil = ? WHERE id_usuario = ?");
        return $stmt->execute([$rutaFoto, $id]);
    }

    public function actualizarBanner($id, $rutaBanner) {
        $stmt = $this->pdo->prepare("UPDATE USUARIO SET banner = ? WHERE id_usuario = ?");
        return $stmt->execute([$rutaBanner, $id]);
    }

    public function actualizarDatos($id, $nombre, $email, $bio) {
        $stmt = $this->pdo->prepare("UPDATE USUARIO SET nombre = ?, email = ?, bio = ? WHERE id_usuario = ?");
        return $stmt->execute([$nombre, $email, $bio, $id]);
    }

    public function eliminar($id) {
        $stmt = $this->pdo->prepare("DELETE FROM USUARIO WHERE id_usuario = ?");
        return $stmt->execute([$id]);
    }
}