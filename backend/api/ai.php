<?php
/**
 * Lume - API Endpoint: Asistente Virtual Inteligente ("Lumi")
 * Responde preguntas contextuales sobre el emprendimiento Lume,
 * sus fundadoras María González y Ángeles Navas, productos, precios,
 * personalización, cuidados y envíos.
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'POST') {
    jsonResponse(false, "Método no permitido. Utilice POST", null, 405);
}

$input = getJsonInput();
$query = trim($input['query'] ?? ($input['message'] ?? ''));

if (empty($query)) {
    jsonResponse(false, "La consulta no puede estar vacía", null, 400);
}

$dbData = LumeDB::load();
$brand = $dbData['brand'] ?? [];
$products = $dbData['products'] ?? [];

// Normalizar la consulta para análisis semántico
$normalized = mb_strtolower($query, 'UTF-8');
$normalized = str_replace(['á','é','í','ó','ú','ñ'], ['a','e','i','o','u','n'], $normalized);

$reply = "";
$suggestions = [];
$recommendedProducts = [];

// Base de conocimiento semántica de Lume
if (preg_match('/(quien|quienes|fundador|fundadora|creador|equipo|duena|maria|angeles)/i', $normalized)) {
    $reply = "✨ ¡Hola! Lume fue fundado con mucho cariño por María González y Ángeles Navas. Ellas son dos emprendedoras apasionadas por diseñar accesorios y pulseras artesanales modernas, con significado y a precios accesibles para todos.";
    $suggestions = ["¿Qué pulseras tienen?", "¿Cómo puedo personalizar una pulsera?", "¿Hacen envíos?"];
} elseif (preg_match('/(precio|costo|cuanto vale|cuanto cuesta|valor|economico|barato)/i', $normalized)) {
    $reply = "Nuestras pulseras y joyas artesanales tienen precios muy accesibles, que van desde los $16.000 hasta los $32.000 COP (sets especiales de pareja). Todo está hecho a mano con materiales duraderos como acero inoxidable, oro golfi e hilo impermeable.";
    $suggestions = ["Ver pulseras de pareja", "Ver pulseras personalizadas", "¿Cómo comprar?"];
    $recommendedProducts = array_slice($products, 0, 3);
} elseif (preg_match('/(personaliz|inicial|letra|nombre|dije|hilo|color)/i', $normalized)) {
    $reply = "¡Nos encanta personalizar tus accesorios! 🥰 Puedes elegir la inicial de tu persona favorita, el color del hilo (rojo, negro, beige, palo de rosa, etc.) y dijes especiales en oro golfi o acero quirúrgico. ¡Hacemos que tu accesorio sea único!";
    $suggestions = ["Ver Pulsera con Inicial", "Escribir por WhatsApp", "¿Tienen para parejas?"];
    $recommendedProducts = array_values(array_filter($products, function($p) {
        return !empty($p['customizable']);
    }));
} elseif (preg_match('/(pareja|novio|novia|duo|san valentin|aniversario)/i', $normalized)) {
    $reply = "¡Nuestro Set Dúo de Parejas es el más pedido! 🖤🤍 Incluye dos pulseras ajustables tejidas con piedras naturales de Ónix negro mate y Cuarzo blanco, que representan el equilibrio, la complicidad y el amor. Cuesta solo $32.000 el par.";
    $suggestions = ["Ver Pulseras de Pareja", "Pedir por WhatsApp", "¿Cómo saber mi talla?"];
    $recommendedProducts = array_values(array_filter($products, function($p) {
        return ($p['category'] ?? '') === 'parejas';
    }));
} elseif (preg_match('/(cuidado|limpiar|agua|banar|oxida|dura|despinta)/i', $normalized)) {
    $reply = "Para que tus pulseras y joyas Lume te duren por siempre, te recomendamos: 1) Evitar el contacto directo con perfumes y cloro, 2) Limpiarlas suavemente con un paño seco y suave, y 3) Guardarlas en su bolsita protectora cuando no las uses.";
    $suggestions = ["¿De qué material son?", "Ver catálogo", "Contactar a Lume"];
} elseif (preg_match('/(envio|domicilio|entrega|tiempo|tarda|ciudad|donde estan)/i', $normalized)) {
    $reply = "Hacemos envíos a todo el país. 📦 Si es un pedido personalizado, nos toma entre 1 y 2 días hábiles confeccionarlo a mano, y el envío suele tardar de 2 a 4 días hábiles según tu ciudad. ¡También coordinamos entregas locales!";
    $suggestions = ["¿Cuánto cuesta el envío?", "Quiero hacer un pedido", "Ver productos"];
} elseif (preg_match('/(material|oro|plata|acero|piedra|hilo)/i', $normalized)) {
    $reply = "En Lume seleccionamos materiales de excelente calidad: hilos de macramé encerados de alta tenacidad, piedras naturales semipreciosas (cuarzo, ónix, amatista), mostacilla checa calibrada y herrajes en acero inoxidable y oro golfi hipoalergénico.";
    $suggestions = ["¿Se pueden mojar?", "Ver catálogo", "¿Cómo personalizar?"];
} elseif (preg_match('/(hola|buenas|saludos|que tal|buen dia)/i', $normalized)) {
    $reply = "¡Hola! Bienvenida a Lume ✨. Soy Lumi, tu asesora virtual de accesorios y pulseras artesanales. Estoy aquí para ayudarte a elegir la joya perfecta, responder dudas sobre personalización, materiales o precios. ¿En qué puedo ayudarte hoy?";
    $suggestions = ["Ver colección más vendida", "¿Cómo personalizar una pulsera?", "¿Quiénes crearon Lume?"];
} elseif (preg_match('/(catalogo|producto|mostrar|joya|pulsera|que venden)/i', $normalized)) {
    $reply = "En Lume elaboramos pulseras artesanales de macramé, sets de pareja con piedras naturales, pulseras tejidas con mostacilla y joyas delicadas en acero. ¡Aquí tienes algunas de nuestras piezas favoritas!";
    $suggestions = ["Pulseras personalizadas", "Joya gargantilla", "Hacer un pedido"];
    $recommendedProducts = array_slice($products, 0, 4);
} else {
    $reply = "¡Gracias por tu mensaje! En Lume elaboramos a mano pulseras modernas y personalizadas. Con gusto puedo contarte sobre nuestros productos, materiales, precios, cómo personalizar o ponerte en contacto directo con María y Ángeles.";
    $suggestions = ["Ver catálogo de pulseras", "¿Cómo personalizar?", "¿Quiénes crearon Lume?", "Hablar por WhatsApp"];
    $recommendedProducts = array_slice($products, 0, 2);
}

// Registrar la interacción
LumeDB::logAiInteraction($query, $reply);

jsonResponse(true, "Respuesta de Lumi", [
    "reply" => $reply,
    "suggestions" => $suggestions,
    "recommendedProducts" => $recommendedProducts
]);
