<?php
// Proyecto Lume - Backend
// Integrantes: María González y Ángeles Navas
// Descripción: Sistema backend para gestionar los productos, mensajes y el asistente virtual

require_once __DIR__ . '/conexion.php';

responder(true, "Backend de Lume funcionando correctamente", [
    "proyecto" => "Lume - Joyería y Pulseras Artesanales",
    "integrantes" => ["María González", "Ángeles Navas"],
    "rutas_disponibles" => [
        "GET /backend/api/productos.php" => "Ver catálogo de productos",
        "POST /backend/api/productos.php" => "Agregar un producto (admin)",
        "DELETE /backend/api/productos.php?id=X" => "Eliminar un producto (admin)",
        "POST /backend/api/contacto.php" => "Enviar mensaje de cliente",
        "GET /backend/api/contacto.php" => "Ver mensajes recibidos",
        "POST /backend/api/login.php" => "Iniciar sesión de administrador",
        "POST /backend/api/chat-ia.php" => "Asistente virtual de preguntas frecuentes"
    ]
]);
