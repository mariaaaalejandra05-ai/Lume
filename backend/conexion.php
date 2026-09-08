<?php
// Archivo de configuración básica del backend de Lume
// Emprendimiento de María González y Ángeles Navas

// Permitir peticiones desde el frontend (CORS)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Si es una petición OPTIONS del navegador, terminamos aquí
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Función simple para leer datos en formato JSON enviados por JavaScript
function obtenerDatosPost() {
    $datos = file_get_contents("php://input");
    return json_decode($datos, true) ?? $_POST;
}

// Función sencilla para responder al frontend
function responder($exito, $mensaje, $datos = null) {
    echo json_encode([
        "ok" => $exito,
        "mensaje" => $mensaje,
        "datos" => $datos
    ], JSON_UNESCAPED_UNICODE);
    exit();
}
