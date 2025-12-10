-- Actualizaciones corregidas para la base de datos

-- 1. La columna 'orden' en HERO_VIDEOS ya existe en el esquema original, así que NO la añadimos.
-- (Si necesitaras forzarlo en una DB vieja, usarías un procedimiento almacenado para verificar existencia, 
-- pero aquí asumimos que la DB coincide con rechord.sql o que el error anterior confirmó su existencia).

-- 2. Crear Usuario Reset/Sistema 'Rechord'
-- Corrección: La columna de contraseña es 'password_hash', no 'password'.
INSERT INTO `usuario` (`nombre`, `email`, `password_hash`, `rol`, `foto_perfil`)
SELECT 'Rechord', 'admin@rechord.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'assets/images/rechord-logo.png'
WHERE NOT EXISTS (SELECT * FROM `usuario` WHERE `nombre` = 'Rechord');
