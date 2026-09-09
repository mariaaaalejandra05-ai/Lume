<?php
// API para recibir y guardar los mensajes enviados desde el formulario de contacto
require_once __DIR__ . '/../conexion.php';

$archivo = __DIR__ . '/../data/mensajes.json';

if (!file_exists($archivo)) {
    $iniciales = [
        [
            "id" => 1,
            "nombre" => "Camila Restrepo",
            "correo" => "camila@correo.com",
            "telefono" => "3129876543",
            "asunto" => "Personalización de pulseras",
            "mensaje" => "Hola María! Quisiera pedir 3 pulseras con iniciales doradas para regalar a mis amigas.",
            "fecha" => date("d/m/Y H:i")
        ]
    ];
    file_put_contents($archivo, json_encode($iniciales, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

$mensajes = json_decode(file_get_contents($archivo), true) ?? [];
$metodo = $_SERVER['REQUEST_METHOD'];

// GET: Consultar los mensajes (para el panel de administración)
if ($metodo === 'GET') {
    responder(true, "Mensajes obtenidos", $mensajes);
}

// POST: Recibir nuevo mensaje del formulario
if ($metodo === 'POST') {
    $datos = obtenerDatosPost();

    $nombre = trim($datos['nombre'] ?? '');
    $correo = trim($datos['correo'] ?? '');
    $telefono = trim($datos['telefono'] ?? '');
    $asunto = trim($datos['asunto'] ?? '');
    $mensaje = trim($datos['mensaje'] ?? '');

    // Validamos que los campos obligatorios no estén vacíos
    if (empty($nombre) || empty($correo) || empty($mensaje)) {
        responder(false, "Por favor completa tu nombre, correo y mensaje.");
    }

    $nuevoMensaje = [
        "id" => count($mensajes) + 1,
        "nombre" => $nombre,
        "correo" => $correo,
        "telefono" => $telefono,
        "asunto" => $asunto ?: "Consulta general",
        "mensaje" => $mensaje,
        "fecha" => date("d/m/Y H:i")
    ];

    // Agregamos el mensaje al inicio de la lista
    array_unshift($mensajes, $nuevoMensaje);
    file_put_contents($archivo, json_encode($mensajes, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

    responder(true, "¡Mensaje recibido con éxito! María te responderá pronto.", $nuevoMensaje);
}
