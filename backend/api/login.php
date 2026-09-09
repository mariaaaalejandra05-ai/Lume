<?php
// Archivo para validar el inicio de sesión del panel de administración
require_once __DIR__ . '/../conexion.php';

$datos = obtenerDatosPost();

$correo = trim($datos['correo'] ?? '');
$clave = trim($datos['clave'] ?? '');

// Comparamos el correo y la contraseña
if ($correo === 'admin@lume.com' && $clave === 'lume123') {
    responder(true, "Bienvenida al panel de Lume", [
        "usuario" => "María González",
        "correo" => "admin@lume.com",
        "rol" => "admin"
    ]);
} else {
    responder(false, "Correo o contraseña incorrectos. Recuerda: admin@lume.com / lume123");
}
