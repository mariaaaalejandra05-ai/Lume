<?php
/**
 * Lume - API Endpoint: Autenticación
 * POST: Login (verifica usuario y crea sesión)
 * GET: Verificar sesión activa
 * DELETE o POST action=logout: Cerrar sesión
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        $data = getJsonInput();
        $action = $data['action'] ?? ($_GET['action'] ?? 'login');

        if ($action === 'logout') {
            $_SESSION = [];
            if (ini_get("session.use_cookies")) {
                $params = session_get_cookie_params();
                setcookie(session_name(), '', time() - 42000,
                    $params["path"], $params["domain"],
                    $params["secure"], $params["httponly"]
                );
            }
            session_destroy();
            jsonResponse(true, "Sesión cerrada correctamente");
        }

        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';

        if (empty($email) || empty($password)) {
            jsonResponse(false, "Correo y contraseña son requeridos", null, 400);
        }

        $user = LumeDB::verifyUser($email, $password);

        if ($user) {
            $_SESSION['user'] = $user;
            // Generar un token de sesión simulado seguro
            $token = bin2hex(random_bytes(24));
            $_SESSION['token'] = $token;

            jsonResponse(true, "Inicio de sesión exitoso", [
                "user" => $user,
                "token" => $token
            ]);
        } else {
            jsonResponse(false, "Credenciales incorrectas. Verifique su correo o contraseña.", null, 401);
        }
        break;

    case 'GET':
        // Verificar si existe sesión activa
        if (!empty($_SESSION['user'])) {
            jsonResponse(true, "Sesión activa", [
                "user" => $_SESSION['user'],
                "token" => $_SESSION['token'] ?? 'authenticated'
            ]);
        } else {
            jsonResponse(false, "No hay sesión activa", null, 401);
        }
        break;

    default:
        jsonResponse(false, "Método no permitido", null, 405);
        break;
}
