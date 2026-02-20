<?php
require_once __DIR__ . '/database.php';
corsHeaders();

$db = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $db->query("SELECT * FROM authors ORDER BY name");
    $authors = $stmt->fetchAll();
    foreach ($authors as &$a) {
        $a['id'] = (int)$a['id'];
    }
    jsonResponse($authors);
}

if ($method === 'POST') {
    requireAuth();
    $input = getInput();
    if (empty($input['name'])) jsonResponse(['error' => 'Nome é obrigatório'], 400);

    $stmt = $db->prepare("INSERT INTO authors (name, role, bio, avatar) VALUES (?, ?, ?, ?)");
    $stmt->execute([
        $input['name'],
        $input['role'] ?? '',
        $input['bio'] ?? '',
        $input['avatar'] ?? '',
    ]);

    $id = (int)$db->lastInsertId();
    $stmt = $db->prepare("SELECT * FROM authors WHERE id = ?");
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    $row['id'] = (int)$row['id'];
    jsonResponse($row, 201);
}

if ($method === 'PUT') {
    requireAuth();
    $id = $_GET['id'] ?? null;
    if (!$id) jsonResponse(['error' => 'ID obrigatório'], 400);

    $input = getInput();
    $fields = [];
    $params = [];

    if (isset($input['name'])) { $fields[] = "name = ?"; $params[] = $input['name']; }
    if (isset($input['role'])) { $fields[] = "role = ?"; $params[] = $input['role']; }
    if (isset($input['bio'])) { $fields[] = "bio = ?"; $params[] = $input['bio']; }
    if (isset($input['avatar'])) { $fields[] = "avatar = ?"; $params[] = $input['avatar']; }

    if (empty($fields)) jsonResponse(['error' => 'Nada para atualizar'], 400);
    $params[] = $id;

    $db->prepare("UPDATE authors SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);

    $stmt = $db->prepare("SELECT * FROM authors WHERE id = ?");
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

    $db->prepare("DELETE FROM authors WHERE id = ?")->execute([$id]);
    jsonResponse(['success' => true]);
}
