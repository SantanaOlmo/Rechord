<?php
//DECLARO LOS ATRIBUTOS DE LA BASE DE DATOS COMO CONSTANTES
define('DB_HOST', '127.0.0.1');
define('DB_NAME', 'rechord');
define('DB_USER', 'rechord_user');
define('DB_PASS', 'N]aBMDER!s_WXlKe');
define('DB_CHARSET', 'utf8mb4');

$dsn = "mysql:host=" . DB_HOST .
";dbname=" . DB_NAME .
";charset=" . DB_CHARSET;
?>