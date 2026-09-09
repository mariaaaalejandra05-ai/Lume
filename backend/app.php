<?php
// Proyecto Lume - Backend
// Creado por: María González
// Archivo principal del backend para probar que todo funcione

require_once __DIR__ . '/conexion.php';

responder(true, "Backend de Lume funcionando correctamente", [
    "proyecto" => "Lume - Joyería y Pulseras Artesanales",
    "fundadora" => "María González",
    "rutas_disponibles" => [
        "GET /backend/api/productos.php" => "Ver catálogo de productos",
        "POST /backend/api/productos.php" => "Agregar un producto nuevo",
        "DELETE /backend/api/productos.php?id=X" => "Eliminar un producto",
        "POST /backend/api/contacto.php" => "Enviar mensaje desde el formulario",
        "GET /backend/api/contacto.php" => "Ver mensajes de los clientes",
        "POST /backend/api/login.php" => "Iniciar sesión como administrador",
        "POST /backend/api/chat-ia.php" => "Asistente virtual de preguntas frecuentes"
    ]
]);
