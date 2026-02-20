<?php
require_once __DIR__ . '/database.php';
corsHeaders();

$db = getDB();
$method = $_SERVER['REQUEST_METHOD'];

function formatAd(array $a): array {
    $a['id'] = (int)$a['id'];
    $a['active'] = (bool)$a['active'];
    return $a;
}

if ($method === 'GET') {
    $position = $_GET['position'] ?? null;
    $activeOnly = isset($_GET['active']);

    $sql = "SELECT * FROM ads";
    $params = [];
    $where = [];

    if ($position) { $where[] = "position = ?"; $params[] = $position; }
    if ($activeOnly) { $where[] = "active = 1"; }
    if ($where) $sql .= " WHERE " . implode(" AND ", $where);
    $sql .= " ORDER BY created_at DESC";

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $ads = array_map('formatAd', $stmt->fetchAll());
    jsonResponse($ads);
}

if ($method === 'POST') {
    requireAuth();
    $input = getInput();
    if (empty($input['title'])) jsonResponse(['error' => 'Título é obrigatório'], 400);

    $stmt = $db->prepare("INSERT INTO ads (title, description, image, link, link_text, active, position) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $input['title'],
        $input['description'] ?? '',
        $input['image'] ?? '',
        $input['link'] ?? '',
        $input['link_text'] ?? 'Saiba mais',
        isset($input['active']) ? (int)$input['active'] : 1,
        $input['position'] ?? 'sidebar',
    ]);

    $id = (int)$db->lastInsertId();
    $row = $db->prepare("SELECT * FROM ads WHERE id = ?");
    $row->execute([$id]);
    jsonResponse(formatAd($row->fetch()), 201);
}

if ($method === 'PUT') {
    requireAuth();
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) jsonResponse(['error' => 'ID obrigatório'], 400);

    $input = getInput();
    $fields = [];
    $params = [];

    if (isset($input['title']))       { $fields[] = "title = ?";       $params[] = $input['title']; }
    if (isset($input['description'])) { $fields[] = "description = ?"; $params[] = $input['description']; }
    if (isset($input['image']))       { $fields[] = "image = ?";       $params[] = $input['image']; }
    if (isset($input['link']))        { $fields[] = "link = ?";        $params[] = $input['link']; }
    if (isset($input['link_text']))   { $fields[] = "link_text = ?";   $params[] = $input['link_text']; }
    if (isset($input['active']))      { $fields[] = "active = ?";      $params[] = (int)$input['active']; }
    if (isset($input['position']))    { $fields[] = "position = ?";    $params[] = $input['position']; }

    if (empty($fields)) jsonResponse(['error' => 'Nada para atualizar'], 400);
    $params[] = $id;

    $db->prepare("UPDATE ads SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);

    $row = $db->prepare("SELECT * FROM ads WHERE id = ?");
    $row->execute([$id]);
    $ad = $row->fetch();
    if (!$ad) jsonResponse(['error' => 'Não encontrado'], 404);
    jsonResponse(formatAd($ad));
}

if ($method === 'DELETE') {
    requireAuth();
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) jsonResponse(['error' => 'ID obrigatório'], 400);

    $db->prepare("DELETE FROM ads WHERE id = ?")->execute([$id]);
    jsonResponse(['success' => true]);
}
