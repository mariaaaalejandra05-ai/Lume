<?php
// Asistente virtual de Lume (Lumi)
// Responde preguntas frecuentes analizando las palabras clave que escribe el usuario

require_once __DIR__ . '/../conexion.php';

$datos = obtenerDatosPost();
$pregunta = strtolower(trim($datos['mensaje'] ?? ''));

// Si no enviaron nada
if (empty($pregunta)) {
    responder(false, "Escribe una pregunta para Lumi.");
}

$respuesta = "";
$sugerencias = [];

// Revisamos palabras clave para responder con información de Lume
if (strpos($pregunta, 'quien') !== false || strpos($pregunta, 'dueña') !== false || strpos($pregunta, 'creador') !== false || strpos($pregunta, 'maria') !== false || strpos($pregunta, 'angeles') !== false) {
    $respuesta = "¡Hola! Lume es un emprendimiento fundado por María González y Ángeles Navas. Creamos pulseras y accesorios artesanales modernos, de calidad y a precios accesibles.";
    $sugerencias = ["¿Qué precios tienen?", "¿Cómo personalizar una pulsera?", "¿Hacen envíos?"];

} elseif (strpos($pregunta, 'precio') !== false || strpos($pregunta, 'cuanto vale') !== false || strpos($pregunta, 'costo') !== false) {
    $respuesta = "Nuestras pulseras van desde los $16.000 hasta los $32.000 COP en los sets especiales para parejas. Todo está elaborado a mano con materiales duraderos.";
    $sugerencias = ["Ver pulseras de pareja", "¿Cómo personalizar?", "Comprar por WhatsApp"];

} elseif (strpos($pregunta, 'personaliz') !== false || strpos($pregunta, 'inicial') !== false || strpos($pregunta, 'letra') !== false || strpos($pregunta, 'nombre') !== false) {
    $respuesta = "¡Sí, personalizamos tus pulseras! Puedes elegir la inicial de tu persona especial o tuya, además del color del hilo que más te guste (rojo, negro, beige, etc.).";
    $sugerencias = ["Ver catálogo", "¿Cuánto tarda el envío?", "Escribir al WhatsApp"];

} elseif (strpos($pregunta, 'pareja') !== false || strpos($pregunta, 'novio') !== false || strpos($pregunta, 'novia') !== false || strpos($pregunta, 'duo') !== false) {
    $respuesta = "¡Nuestro set de parejas es uno de los más pedidos! Incluye dos pulseras ajustables con piedras naturales de Ónix y Cuarzo blanco, simbolizando la unión y el equilibrio.";
    $sugerencias = ["¿Qué precio tiene?", "¿Hacen envíos a mi ciudad?"];

} elseif (strpos($pregunta, 'cuidado') !== false || strpos($pregunta, 'mojar') !== false || strpos($pregunta, 'limpiar') !== false) {
    $respuesta = "Para cuidar tus accesorios Lume: evita aplicarles perfume directo, límpialos con un pañito suave y seco, y guárdalos en su bolsita cuando no los uses.";
    $sugerencias = ["¿De qué material son?", "Ver pulseras"];

} elseif (strpos($pregunta, 'envio') !== false || strpos($pregunta, 'domicilio') !== false || strpos($pregunta, 'entrega') !== false) {
    $respuesta = "Hacemos envíos a todo el país. Los pedidos personalizados tardan entre 1 y 2 días en tejerse, y la entrega suele tomar de 2 a 4 días según la ciudad.";
    $sugerencias = ["Hacer un pedido", "Ver productos"];

} else {
    $respuesta = "¡Hola! Soy Lumi, la asistente de Lume ✨. Te puedo ayudar con información sobre precios, pulseras de parejas, opciones para personalizar iniciales o cómo hacer tu pedido.";
    $sugerencias = ["¿Quiénes crearon Lume?", "¿Qué precios tienen?", "¿Cómo personalizar?"];
}

responder(true, "Respuesta generada", [
    "respuesta" => $respuesta,
    "sugerencias" => $sugerencias
]);
