<?php
// API para gestionar los productos de Lume (listar, agregar y eliminar)
require_once __DIR__ . '/../conexion.php';

$archivo = __DIR__ . '/../data/productos.json';

// Si el archivo no existe, creamos los productos iniciales
if (!file_exists($archivo)) {
    $iniciales = [
        [
            "id" => 1,
            "nombre" => "Pulsera Hilo Rojo Destino",
            "categoria" => "pulseras",
            "precio" => 18000,
            "descripcion" => "Tejida a mano con nudo franciscano y dije en oro golfi. Simboliza protección y conexión.",
            "materiales" => "Hilo encerado de alta resistencia y dije dorado",
            "imagen" => "https://images.unsplash.com/photo-1611591475883-8a39ec8c6c57?auto=format&fit=crop&w=800&q=80",
            "personalizable" => true,
            "stock" => 20
        ],
        [
            "id" => 2,
            "nombre" => "Dúo de Pulseras para Pareja",
            "categoria" => "parejas",
            "precio" => 32000,
            "descripcion" => "Set de 2 pulseras ajustables con piedras naturales de Ónix negro mate y Cuarzo blanco.",
            "materiales" => "Piedras semipreciosas de 8mm e hilo reforzado",
            "imagen" => "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80",
            "personalizable" => true,
            "stock" => 15
        ],
        [
            "id" => 3,
            "nombre" => "Pulsera con Inicial Personalizada",
            "categoria" => "personalizadas",
            "precio" => 22000,
            "descripcion" => "Pulsera hecha a mano con la letra que tú elijas en dije de nácar o medalla dorada.",
            "materiales" => "Hilo italiano de color a elección y dije de acero inoxidable",
            "imagen" => "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
            "personalizable" => true,
            "stock" => 25
        ],
        [
            "id" => 4,
            "nombre" => "Gargantilla Destellos de Luz",
            "categoria" => "joyas",
            "precio" => 28000,
            "descripcion" => "Collar delicado con cadena de acero inoxidable y dije de circonia brillante.",
            "materiales" => "Acero inoxidable resistente al agua y circonia",
            "imagen" => "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
            "personalizable" => false,
            "stock" => 12
        ],
        [
            "id" => 5,
            "nombre" => "Pulsera Mostacilla Flor Silvestre",
            "categoria" => "pulseras",
            "precio" => 16000,
            "descripcion" => "Tejida a mano con mostacilla checa formando florecitas en tonos pastel.",
            "materiales" => "Mostacilla checa de calidad y broche ajustable",
            "imagen" => "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
            "personalizable" => true,
            "stock" => 18
        ],
        [
            "id" => 6,
            "nombre" => "Tobillera Bohemia Marina",
            "categoria" => "joyas",
            "precio" => 19000,
            "descripcion" => "Tobillera artesanal con caracolas naturales seleccionadas y cuentas doradas.",
            "materiales" => "Caracolas naturales y esferas en acero",
            "imagen" => "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
            "personalizable" => false,
            "stock" => 14
        ]
    ];
    file_put_contents($archivo, json_encode($iniciales, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

// Leemos la lista de productos
$productos = json_decode(file_get_contents($archivo), true) ?? [];
$metodo = $_SERVER['REQUEST_METHOD'];

// 1. GET: Consultar productos
if ($metodo === 'GET') {
    responder(true, "Productos obtenidos correctamente", $productos);
}

// 2. POST: Agregar nuevo producto
if ($metodo === 'POST') {
    $nuevo = obtenerDatosPost();

    if (empty($nuevo['nombre']) || empty($nuevo['precio'])) {
        responder(false, "El nombre y el precio son obligatorios");
    }

    // Calculamos el nuevo ID
    $nuevoId = 1;
    foreach ($productos as $p) {
        if ($p['id'] >= $nuevoId) {
            $nuevoId = $p['id'] + 1;
        }
    }

    $productoGuardar = [
        "id" => $nuevoId,
        "nombre" => trim($nuevo['nombre']),
        "categoria" => trim($nuevo['categoria'] ?? 'pulseras'),
        "precio" => (int)$nuevo['precio'],
        "descripcion" => trim($nuevo['descripcion'] ?? ''),
        "materiales" => trim($nuevo['materiales'] ?? 'Materiales artesanales'),
        "imagen" => trim($nuevo['imagen'] ?? 'https://images.unsplash.com/photo-1611591475883-8a39ec8c6c57?w=800'),
        "personalizable" => !empty($nuevo['personalizable']),
        "stock" => (int)($nuevo['stock'] ?? 10)
    ];

    $productos[] = $productoGuardar;
    file_put_contents($archivo, json_encode($productos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    responder(true, "Producto agregado al catálogo", $productoGuardar);
}

// 3. DELETE: Eliminar producto
if ($metodo === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        responder(false, "Falta el ID del producto");
    }

    $nuevaLista = [];
    foreach ($productos as $p) {
        if ($p['id'] != $id) {
            $nuevaLista[] = $p;
        }
    }

    file_put_contents($archivo, json_encode($nuevaLista, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    responder(true, "Producto eliminado exitosamente");
}
