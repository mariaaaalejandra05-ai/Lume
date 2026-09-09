<?php
// Configuración básica del backend de Lume
// Proyecto de María González

// Cabeceras de seguridad para proteger el servidor y evitar ataques
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: SAMEORIGIN");
header("X-XSS-Protection: 1; mode=block");

// Permitir peticiones desde el frontend (CORS)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Si el navegador pregunta con OPTIONS, terminamos aquí
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Función sencilla para recibir y limpiar los datos JSON que envía JavaScript
function obtenerDatosPost() {
    $datos = file_get_contents("php://input");
    $arreglo = json_decode($datos, true) ?? $_POST;
    
    // Limpiamos los textos para evitar inyecciones de código
    if (is_array($arreglo)) {
        foreach ($arreglo as $clave => $valor) {
            if (is_string($valor)) {
                $arreglo[$clave] = htmlspecialchars(trim($valor), ENT_QUOTES, 'UTF-8');
            }
        }
    }
    return $arreglo;
}

// Función para enviar respuestas seguras en formato JSON
function responder($exito, $mensaje, $datos = null) {
    echo json_encode([
        "ok" => $exito,
        "mensaje" => htmlspecialchars($mensaje, ENT_QUOTES, 'UTF-8'),
        "datos" => $datos
    ], JSON_UNESCAPED_UNICODE);
    exit();
}
