<?php
// API para inicio de sesión en el panel de administración
require_once __DIR__ . '/../conexion.php';

$datos = obtenerDatosPost();

$correo = trim($datos['correo'] ?? '');
$clave = trim($datos['clave'] ?? '');

// Verificamos las credenciales de administración
if ($correo === 'admin@lume.com' && $clave === 'lume123') {
    responder(true, "Bienvenida al panel de Lume", [
        "usuario" => "María González y Ángeles Navas",
        "correo" => "admin@lume.com",
        "rol" => "admin"
    ]);
} else {
    responder(false, "Correo o contraseña incorrectos. Recuerda: admin@lume.com / lume123");
}
