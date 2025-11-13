[![back](assets/icons/back.png)](00_project_overview.md)

# Development Setup

Guía completa para configurar y ejecutar el entorno de desarrollo de **ReChord** utilizando **Docker**.  
Este documento explica cómo levantar la base de datos MySQL, el servidor PHP para la API y cómo preparar el entorno frontend.

- [Development Setup](#development-setup)
  - [Instalación de Docker](#instalación-de-docker)
  - [Configure Docker Compose](#configure-docker-compose)
  - [Preparar el archivo de inicialización de la base de datos](#preparar-el-archivo-de-inicialización-de-la-base-de-datos)
  - [Start the environment](#start-the-environment)


## ![Docker](assets/icons/MaterialIconThemeDocker.png)Instalación de Docker

Check if Docker is installed:

````bash
docker -v
docker compose version
````

if not go to : [Docker web](https://www.docker.com/get-started/)

## Configure Docker Compose

Now create the file docker-compose.yml in the project root with the following content:

````yaml
version: "3.9"

services:
  php-apache:
    image: php:8.2-apache
    container_name: rechord_backend
    volumes:
      - ./backend:/var/www/html
    ports:
      - "8080:80"
    depends_on:
      - db
    environment:
      - MYSQL_HOST=db
      - MYSQL_USER=root
      - MYSQL_PASSWORD=root
      - MYSQL_DATABASE=rechord
    command: bash -c "docker-php-ext-install pdo pdo_mysql && apache2-foreground"

  db:
    image: mysql:8.0
    container_name: rechord_db
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: rechord
    volumes:
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "3307:3306"

  phpmyadmin:
    image: phpmyadmin/phpmyadmin
    container_name: rechord_phpmyadmin
    restart: always
    ports:
      - "8081:80"
    environment:
      PMA_HOST: db
      MYSQL_ROOT_PASSWORD: root
````

## ![mysql](assets/icons/DeviconPlainMysqlWordmark.png)Preparar el archivo de inicialización de la base de datos

````sql
-- Crear base de datos (si no existe)
CREATE DATABASE IF NOT EXISTS rechord;
USE rechord;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    bio TEXT
);

-- Tabla de canciones
CREATE TABLE IF NOT EXISTS cancion (
    id_cancion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    artista VARCHAR(200),
    nivel VARCHAR(50),
    archivo_mp3 VARCHAR(255),
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

-- Tabla de estrofas
CREATE TABLE IF NOT EXISTS estrofa (
    id_estrofa INT AUTO_INCREMENT PRIMARY KEY,
    id_cancion INT NOT NULL,
    texto TEXT NOT NULL,
    orden INT,
    FOREIGN KEY (id_cancion) REFERENCES cancion(id_cancion) ON DELETE CASCADE
);

-- Tabla de acordes
CREATE TABLE IF NOT EXISTS acorde (
    id_acorde INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    imagen_svg VARCHAR(255),
    descripcion TEXT
);

-- Tabla intermedia estrofa-acorde
CREATE TABLE IF NOT EXISTS estrofa_acorde (
    id_estrofa_acorde INT AUTO_INCREMENT PRIMARY KEY,
    id_estrofa INT NOT NULL,
    id_acorde INT NOT NULL,
    posicion_en_texto INT,
    FOREIGN KEY (id_estrofa) REFERENCES estrofa(id_estrofa) ON DELETE CASCADE,
    FOREIGN KEY (id_acorde) REFERENCES acorde(id_acorde) ON DELETE CASCADE
);

-- Carpetas de canciones
CREATE TABLE IF NOT EXISTS carpeta (
    id_carpeta INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

-- Relación canciones-carpetas
CREATE TABLE IF NOT EXISTS cancion_carpeta (
    id_cancion_carpeta INT AUTO_INCREMENT PRIMARY KEY,
    id_cancion INT NOT NULL,
    id_carpeta INT NOT NULL,
    FOREIGN KEY (id_cancion) REFERENCES cancion(id_cancion) ON DELETE CASCADE,
    FOREIGN KEY (id_carpeta) REFERENCES carpeta(id_carpeta) ON DELETE CASCADE
);

-- Likes de canciones
CREATE TABLE IF NOT EXISTS like_cancion (
    id_like INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_cancion INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_cancion) REFERENCES cancion(id_cancion) ON DELETE CASCADE
);

-- Seguimientos entre usuarios
CREATE TABLE IF NOT EXISTS seguir_usuario (
    id_seguir INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario_seguidor INT NOT NULL,
    id_usuario_seguido INT NOT NULL,
    FOREIGN KEY (id_usuario_seguidor) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario_seguido) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

````

## Start the environment

````bash
# Construye y levanta los contenedores en segundo plano
docker compose up -d

# Verifica que todo está corriendo
docker compose ps
````
