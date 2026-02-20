<?php
require_once __DIR__ . '/database.php';
corsHeaders();
startSession();

$db = getDB();
$method = $_SERVER['REQUEST_METHOD'];

function formatUser(array $u): array {
    $u['id'] = (int)$u['id'];
    unset($u['password']);
    return $u;
}

if ($method === 'GET') {
    requireAuth();
    $stmt = $db->query("SELECT id, username, name, avatar, role, created_at FROM users ORDER BY created_at ASC");
    $users = array_map('formatUser', $stmt->fetchAll());
    jsonResponse($users);
}

if ($method === 'POST') {
    requireAuth();
    $input = getInput();

    $username = trim($input['username'] ?? '');
    $password = $input['password'] ?? '';
    $name     = trim($input['name'] ?? '');
    $role     = $input['role'] ?? 'collaborator';
    $avatar   = $input['avatar'] ?? '';

    if (!$username || !$password || !$name) {
        jsonResponse(['error' => 'Usuário, senha e nome são obrigatórios'], 400);
    }
    if (strlen($password) < 6) {
        jsonResponse(['error' => 'A senha deve ter pelo menos 6 caracteres'], 400);
    }
    if (!in_array($role, ['admin', 'collaborator'])) {
        jsonResponse(['error' => 'Função inválida'], 400);
    }

    // Check username uniqueness
    $check = $db->prepare("SELECT id FROM users WHERE username = ?");
    $check->execute([$username]);
    if ($check->fetch()) {
        jsonResponse(['error' => 'Este nome de usuário já está em uso'], 409);
    }

    $stmt = $db->prepare("INSERT INTO users (username, password, name, avatar, role) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$username, password_hash($password, PASSWORD_DEFAULT), $name, $avatar, $role]);

    $id = (int)$db->lastInsertId();
    $row = $db->prepare("SELECT id, username, name, avatar, role, created_at FROM users WHERE id = ?");
    $row->execute([$id]);
    jsonResponse(formatUser($row->fetch()), 201);
}

if ($method === 'PUT') {
    requireAuth();
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) jsonResponse(['error' => 'ID obrigatório'], 400);

    // Prevent editing own role/username to avoid lockout
    $currentUserId = (int)$_SESSION['user_id'];

    $input = getInput();
    $fields = [];
    $params = [];

    if (isset($input['name']))   { $fields[] = "name = ?";   $params[] = $input['name']; }
    if (isset($input['avatar'])) { $fields[] = "avatar = ?"; $params[] = $input['avatar']; }
    if (isset($input['role']) && $id !== $currentUserId) {
        if (!in_array($input['role'], ['admin', 'collaborator'])) {
            jsonResponse(['error' => 'Função inválida'], 400);
        }
        $fields[] = "role = ?";
        $params[] = $input['role'];
    }
    if (isset($input['username']) && $id !== $currentUserId) {
        $check = $db->prepare("SELECT id FROM users WHERE username = ? AND id != ?");
        $check->execute([$input['username'], $id]);
        if ($check->fetch()) jsonResponse(['error' => 'Nome de usuário já em uso'], 409);
        $fields[] = "username = ?";
        $params[] = $input['username'];
    }
    if (!empty($input['password'])) {
        if (strlen($input['password']) < 6) jsonResponse(['error' => 'Senha deve ter pelo menos 6 caracteres'], 400);
        $fields[] = "password = ?";
        $params[] = password_hash($input['password'], PASSWORD_DEFAULT);
    }

    if (empty($fields)) jsonResponse(['error' => 'Nada para atualizar'], 400);
    $params[] = $id;

    $db->prepare("UPDATE users SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);

    $row = $db->prepare("SELECT id, username, name, avatar, role, created_at FROM users WHERE id = ?");
    $row->execute([$id]);
    $user = $row->fetch();
    if (!$user) jsonResponse(['error' => 'Não encontrado'], 404);
    jsonResponse(formatUser($user));
}

if ($method === 'DELETE') {
    requireAuth();
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) jsonResponse(['error' => 'ID obrigatório'], 400);

    // Prevent self-deletion
    if ($id === (int)$_SESSION['user_id']) {
        jsonResponse(['error' => 'Você não pode excluir sua própria conta'], 403);
    }

    // Prevent deleting the last admin
    $adminCount = (int)$db->query("SELECT COUNT(*) FROM users WHERE role = 'admin'")->fetchColumn();
    $targetRole = $db->prepare("SELECT role FROM users WHERE id = ?");
    $targetRole->execute([$id]);
    $target = $targetRole->fetch();
    if ($target && $target['role'] === 'admin' && $adminCount <= 1) {
        jsonResponse(['error' => 'Não é possível excluir o único administrador'], 403);
    }

    $db->prepare("DELETE FROM users WHERE id = ?")->execute([$id]);
    jsonResponse(['success' => true]);
}
