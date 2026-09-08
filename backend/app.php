<?php
/**
 * Lume - Punto de Entrada del Backend
 * Emprendimiento de Joyas y Pulseras Artesanales
 * Creado por María González y Ángeles Navas
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

// Información del servicio backend
$brandInfo = [
    "app" => "Lume Backend API",
    "version" => "2.0.0",
    "status" => "online",
    "brand" => [
        "name" => "Lume",
        "description" => "Emprendimiento de pulseras y accesorios artesanales modernos y personalizados",
        "founders" => ["María González", "Ángeles Navas"]
    ],
    "endpoints" => [
        "GET /backend/api/products.php" => "Listar catálogo de productos (filtros: category, search)",
        "POST /backend/api/products.php" => "Crear nuevo producto (admin)",
        "PUT /backend/api/products.php?id={id}" => "Actualizar producto existente",
        "DELETE /backend/api/products.php?id={id}" => "Eliminar producto",
        "POST /backend/api/auth.php" => "Login administrativo (email, password)",
        "GET /backend/api/auth.php" => "Verificar estado de sesión",
        "POST /backend/api/contact.php" => "Registrar consulta de cliente",
        "GET /backend/api/contact.php" => "Listar consultas recibidas (admin)",
        "POST /backend/api/ai.php" => "Asistente inteligente Lumi (query)"
    ]
];

jsonResponse(true, "Servicio Backend de Lume operativo", $brandInfo);
