<?php
require_once __DIR__ . '/database.php';
corsHeaders();

$db = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $db->query("SELECT * FROM categories ORDER BY name");
    $categories = $stmt->fetchAll();
    foreach ($categories as &$c) {
        $c['id'] = (int)$c['id'];
    }
    jsonResponse($categories);
}

if ($method === 'POST') {
    requireAuth();
    $input = getInput();
    if (empty($input['name'])) jsonResponse(['error' => 'Nome é obrigatório'], 400);

    $slug = $input['slug'] ?? preg_replace('/[^a-z0-9-]/', '', preg_replace('/\s+/', '-', mb_strtolower($input['name'])));
    $color = $input['color'] ?? '#2563eb';

    $stmt = $db->prepare("INSERT INTO categories (name, slug, color) VALUES (?, ?, ?)");
    $stmt->execute([$input['name'], $slug, $color]);

    $id = (int)$db->lastInsertId();
    jsonResponse(['id' => $id, 'name' => $input['name'], 'slug' => $slug, 'color' => $color], 201);
}

if ($method === 'PUT') {
    requireAuth();
    $id = $_GET['id'] ?? null;
    if (!$id) jsonResponse(['error' => 'ID obrigatório'], 400);

    $input = getInput();
    $fields = [];
    $params = [];

    if (isset($input['name'])) { $fields[] = "name = ?"; $params[] = $input['name']; }
    if (isset($input['slug'])) { $fields[] = "slug = ?"; $params[] = $input['slug']; }
    if (isset($input['color'])) { $fields[] = "color = ?"; $params[] = $input['color']; }

    if (empty($fields)) jsonResponse(['error' => 'Nada para atualizar'], 400);
    $params[] = $id;

    $db->prepare("UPDATE categories SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);

    $stmt = $db->prepare("SELECT * FROM categories WHERE id = ?");
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) jsonResponse(['error' => 'Não encontrado'], 404);
    $row['id'] = (int)$row['id'];
    jsonResponse($row);
}

if ($method === 'DELETE') {
    requireAuth();
    $id = $_GET['id'] ?? null;
    if (!$id) jsonResponse(['error' => 'ID obrigatório'], 400);

    $db->prepare("DELETE FROM categories WHERE id = ?")->execute([$id]);
    jsonResponse(['success' => true]);
}
