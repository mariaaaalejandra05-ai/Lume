<?php
/**
 * Lume - API Endpoint: Contacto y Consultas
 * POST: Registrar nueva consulta de un cliente
 * GET: Obtener lista de consultas (para el panel de administración)
 * PUT: Actualizar estado de una consulta (leído/atendido)
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        $data = getJsonInput();

        $name = trim($data['name'] ?? '');
        $email = trim($data['email'] ?? '');
        $subject = trim($data['subject'] ?? '');
        $message = trim($data['message'] ?? '');

        // Validaciones en backend
        $errors = [];
        if (empty($name)) {
            $errors[] = "El nombre es obligatorio.";
        }
        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors[] = "Debe proporcionar un correo electrónico válido.";
        }
        if (empty($message) || strlen($message) < 5) {
            $errors[] = "El mensaje debe tener al menos 5 caracteres.";
        }

        if (!empty($errors)) {
            jsonResponse(false, implode(" ", $errors), null, 422);
        }

        $created = LumeDB::createInquiry($data);
        jsonResponse(true, "¡Gracias por contactar a Lume! Te responderemos muy pronto.", $created, 201);
        break;

    case 'GET':
        $inquiries = LumeDB::getInquiries();
        jsonResponse(true, "Listado de consultas", $inquiries);
        break;

    case 'PUT':
        $data = getJsonInput();
        $id = $data['id'] ?? ($_GET['id'] ?? null);
        $status = $data['status'] ?? 'leido';

        if (!$id) {
            jsonResponse(false, "Se requiere el ID de la consulta", null, 400);
        }

        $updated = LumeDB::updateInquiryStatus($id, $status);
        if ($updated) {
            jsonResponse(true, "Estado de consulta actualizado", $updated);
        } else {
            jsonResponse(false, "No se encontró la consulta", null, 404);
        }
        break;

    default:
        jsonResponse(false, "Método no permitido", null, 405);
        break;
}
