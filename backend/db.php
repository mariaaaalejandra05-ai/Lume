<?php
/**
 * Lume - Capa de Base de Datos y Persistencia
 * Emprendimiento de Joyas y Pulseras Artesanales
 * Creado por María González y Ángeles Navas
 */

class LumeDB {
    private static $dataFile = __DIR__ . '/data/store.json';
    private static $seedFile = __DIR__ . '/data/seed.json';

    /**
     * Inicializa el almacén de datos a partir de seed.json si aún no existe
     */
    private static function init() {
        if (!file_exists(self::$dataFile)) {
            if (file_exists(self::$seedFile)) {
                copy(self::$seedFile, self::$dataFile);
            } else {
                $initial = [
                    "brand" => ["name" => "Lume"],
                    "users" => [],
                    "products" => [],
                    "inquiries" => [],
                    "ai_interactions" => []
                ];
                file_put_contents(self::$dataFile, json_encode($initial, JSON_PRETTY_PRINT));
            }
        }
    }

    /**
     * Carga todos los datos del almacén
     */
    public static function load() {
        self::init();
        $content = file_get_contents(self::$dataFile);
        $data = json_decode($content, true);
        return is_array($data) ? $data : [];
    }

    /**
     * Guarda los datos en el almacén
     */
    public static function save($data) {
        return file_put_contents(self::$dataFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }

    // ==========================================
    // MÉTODOS DE PRODUCTOS
    // ==========================================

    public static function getProducts($category = null, $search = null) {
        $data = self::load();
        $products = $data['products'] ?? [];

        if ($category && $category !== 'todos' && $category !== 'all') {
            $category = strtolower($category);
            $products = array_values(array_filter($products, function($p) use ($category) {
                return strtolower($p['category'] ?? '') === $category;
            }));
        }

        if ($search) {
            $search = strtolower(trim($search));
            $products = array_values(array_filter($products, function($p) use ($search) {
                $name = strtolower($p['name'] ?? '');
                $desc = strtolower($p['description'] ?? '');
                $mat = strtolower($p['materials'] ?? '');
                return strpos($name, $search) !== false || strpos($desc, $search) !== false || strpos($mat, $search) !== false;
            }));
        }

        return $products;
    }

    public static function getProductById($id) {
        $data = self::load();
        foreach ($data['products'] as $p) {
            if ($p['id'] == $id) {
                return $p;
            }
        }
        return null;
    }

    public static function createProduct($productData) {
        $data = self::load();
        $maxId = 0;
        foreach ($data['products'] as $p) {
            if ($p['id'] > $maxId) {
                $maxId = (int)$p['id'];
            }
        }
        $newProduct = [
            'id' => $maxId + 1,
            'name' => trim($productData['name'] ?? 'Nueva Pulsera'),
            'category' => trim($productData['category'] ?? 'pulseras'),
            'price' => (float)($productData['price'] ?? 0),
            'badge' => trim($productData['badge'] ?? ''),
            'description' => trim($productData['description'] ?? ''),
            'materials' => trim($productData['materials'] ?? ''),
            'customizable' => !empty($productData['customizable']),
            'stock' => (int)($productData['stock'] ?? 10),
            'image' => trim($productData['image'] ?? 'https://images.unsplash.com/photo-1611591475883-8a39ec8c6c57?auto=format&fit=crop&w=800&q=80'),
            'created_at' => date('Y-m-d H:i:s')
        ];

        $data['products'][] = $newProduct;
        self::save($data);
        return $newProduct;
    }

    public static function updateProduct($id, $productData) {
        $data = self::load();
        $found = false;
        $updatedProduct = null;

        foreach ($data['products'] as $idx => $p) {
            if ($p['id'] == $id) {
                $data['products'][$idx] = array_merge($p, [
                    'name' => trim($productData['name'] ?? $p['name']),
                    'category' => trim($productData['category'] ?? $p['category']),
                    'price' => isset($productData['price']) ? (float)$productData['price'] : $p['price'],
                    'badge' => isset($productData['badge']) ? trim($productData['badge']) : ($p['badge'] ?? ''),
                    'description' => trim($productData['description'] ?? $p['description']),
                    'materials' => trim($productData['materials'] ?? ($p['materials'] ?? '')),
                    'customizable' => isset($productData['customizable']) ? !empty($productData['customizable']) : $p['customizable'],
                    'stock' => isset($productData['stock']) ? (int)$productData['stock'] : $p['stock'],
                    'image' => trim($productData['image'] ?? $p['image']),
                    'updated_at' => date('Y-m-d H:i:s')
                ]);
                $found = true;
                $updatedProduct = $data['products'][$idx];
                break;
            }
        }

        if ($found) {
            self::save($data);
            return $updatedProduct;
        }
        return null;
    }

    public static function deleteProduct($id) {
        $data = self::load();
        $initialCount = count($data['products']);
        $data['products'] = array_values(array_filter($data['products'], function($p) use ($id) {
            return $p['id'] != $id;
        }));

        if (count($data['products']) < $initialCount) {
            self::save($data);
            return true;
        }
        return false;
    }

    // ==========================================
    // MÉTODOS DE CONTACTO Y CONSULTAS
    // ==========================================

    public static function getInquiries() {
        $data = self::load();
        $inquiries = $data['inquiries'] ?? [];
        usort($inquiries, function($a, $b) {
            return strtotime($b['date'] ?? 0) - strtotime($a['date'] ?? 0);
        });
        return $inquiries;
    }

    public static function createInquiry($inquiryData) {
        $data = self::load();
        $maxId = 0;
        foreach ($data['inquiries'] as $inq) {
            if ($inq['id'] > $maxId) {
                $maxId = (int)$inq['id'];
            }
        }

        $newInquiry = [
            'id' => $maxId + 1,
            'name' => trim($inquiryData['name'] ?? ''),
            'email' => trim($inquiryData['email'] ?? ''),
            'phone' => trim($inquiryData['phone'] ?? ''),
            'subject' => trim($inquiryData['subject'] ?? 'Consulta general'),
            'message' => trim($inquiryData['message'] ?? ''),
            'date' => date('Y-m-d H:i:s'),
            'status' => 'nuevo'
        ];

        $data['inquiries'][] = $newInquiry;
        self::save($data);
        return $newInquiry;
    }

    public static function updateInquiryStatus($id, $status) {
        $data = self::load();
        foreach ($data['inquiries'] as $idx => $inq) {
            if ($inq['id'] == $id) {
                $data['inquiries'][$idx]['status'] = $status;
                self::save($data);
                return $data['inquiries'][$idx];
            }
        }
        return null;
    }

    // ==========================================
    // MÉTODOS DE AUTENTICACIÓN
    // ==========================================

    public static function verifyUser($email, $password) {
        $data = self::load();
        $users = $data['users'] ?? [];
        foreach ($users as $u) {
            if (strtolower(trim($u['email'])) === strtolower(trim($email)) && $u['password'] === $password) {
                return [
                    'id' => $u['id'],
                    'name' => $u['name'],
                    'email' => $u['email'],
                    'role' => $u['role']
                ];
            }
        }
        return null;
    }

    // ==========================================
    // MÉTODOS DE IA Y REGISTRO
    // ==========================================

    public static function logAiInteraction($userQuery, $botResponse) {
        $data = self::load();
        if (!isset($data['ai_interactions'])) {
            $data['ai_interactions'] = [];
        }
        $data['ai_interactions'][] = [
            'id' => count($data['ai_interactions']) + 1,
            'query' => $userQuery,
            'response' => $botResponse,
            'timestamp' => date('Y-m-d H:i:s')
        ];
        // Conservar las últimas 100 interacciones
        if (count($data['ai_interactions']) > 100) {
            $data['ai_interactions'] = array_slice($data['ai_interactions'], -100);
        }
        self::save($data);
    }
}
