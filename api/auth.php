<?php
require_once __DIR__ . '/database.php';
corsHeaders();
startSession();

$db = getDB();
$method = $_SERVER['REQUEST_METHOD'];

$action = $_GET['action'] ?? '';

if ($method === 'POST' && $action === 'login') {
    $input = getInput();
    $username = $input['username'] ?? '';
    $password = $input['password'] ?? '';

    if (!$username || !$password) {
        jsonResponse(['error' => 'Usuário e senha são obrigatórios'], 400);
    }

    $stmt = $db->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password'])) {
        jsonResponse(['error' => 'Usuário ou senha incorretos'], 401);
    }

    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_name'] = $user['name'];
    $_SESSION['user_avatar'] = $user['avatar'];

    jsonResponse([
        'user' => [
            'id' => (int)$user['id'],
            'username' => $user['username'],
            'name' => $user['name'],
            'avatar' => $user['avatar'],
        ]
    ]);
}

if ($method === 'POST' && $action === 'logout') {
    session_destroy();
    jsonResponse(['success' => true]);
}

if ($method === 'GET' && $action === 'me') {
    if (empty($_SESSION['user_id'])) {
        jsonResponse(['user' => null]);
    }

    $stmt = $db->prepare("SELECT id, username, name, avatar FROM users WHERE id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch();

    if (!$user) {
        session_destroy();
        jsonResponse(['user' => null]);
    }

    $user['id'] = (int)$user['id'];
    jsonResponse(['user' => $user]);
}

if ($method === 'POST' && $action === 'change_password') {
    if (empty($_SESSION['user_id'])) {
        jsonResponse(['error' => 'Unauthorized'], 401);
    }

    $input = getInput();
    $currentPassword = $input['current_password'] ?? '';
    $newPassword = $input['new_password'] ?? '';

    if (!$currentPassword || !$newPassword) {
        jsonResponse(['error' => 'Preencha todos os campos'], 400);
    }

    if (strlen($newPassword) < 6) {
        jsonResponse(['error' => 'A nova senha deve ter pelo menos 6 caracteres'], 400);
    }

    $stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($currentPassword, $user['password'])) {
        jsonResponse(['error' => 'Senha atual incorreta'], 401);
    }

    $hash = password_hash($newPassword, PASSWORD_DEFAULT);
    $db->prepare("UPDATE users SET password = ? WHERE id = ?")->execute([$hash, $_SESSION['user_id']]);

    jsonResponse(['success' => true]);
}

jsonResponse(['error' => 'Invalid action'], 400);
