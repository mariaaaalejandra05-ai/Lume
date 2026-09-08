<?php
/**
 * Lume - API Endpoint: Productos (CRUD)
 * GET: Listar productos (con filtro opcional de categoría y búsqueda)
 * POST: Crear nuevo producto (requiere autenticación)
 * PUT: Actualizar producto (requiere autenticación)
 * DELETE: Eliminar producto (requiere autenticación)
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Si se solicita un ID específico
        if (isset($_GET['id'])) {
            $product = LumeDB::getProductById($_GET['id']);
            if ($product) {
                jsonResponse(true, "Producto encontrado", $product);
            } else {
                jsonResponse(false, "Producto no encontrado", null, 404);
            }
        }

        $category = $_GET['category'] ?? null;
        $search = $_GET['search'] ?? null;
        $products = LumeDB::getProducts($category, $search);
        jsonResponse(true, "Listado de productos", $products);
        break;

    case 'POST':
        $data = getJsonInput();
        if (empty($data['name']) || !isset($data['price'])) {
            jsonResponse(false, "El nombre y el precio son obligatorios", null, 400);
        }
        $created = LumeDB::createProduct($data);
        jsonResponse(true, "Producto creado exitosamente", $created, 201);
        break;

    case 'PUT':
        $id = $_GET['id'] ?? null;
        $data = getJsonInput();
        if (!$id && isset($data['id'])) {
            $id = $data['id'];
        }
        if (!$id) {
            jsonResponse(false, "Se requiere el ID del producto para actualizar", null, 400);
        }
        $updated = LumeDB::updateProduct($id, $data);
        if ($updated) {
            jsonResponse(true, "Producto actualizado correctamente", $updated);
        } else {
            jsonResponse(false, "No se encontró el producto para actualizar", null, 404);
        }
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            $data = getJsonInput();
            $id = $data['id'] ?? null;
        }
        if (!$id) {
            jsonResponse(false, "Se requiere el ID del producto para eliminar", null, 400);
        }
        $deleted = LumeDB::deleteProduct($id);
        if ($deleted) {
            jsonResponse(true, "Producto eliminado exitosamente");
        } else {
            jsonResponse(false, "No se pudo eliminar el producto o no existe", null, 404);
        }
        break;

    default:
        jsonResponse(false, "Método no permitido", null, 405);
        break;
}
