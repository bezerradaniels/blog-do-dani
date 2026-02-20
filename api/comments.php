<?php
require_once __DIR__ . '/database.php';
corsHeaders();

$db = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $postId = $_GET['post_id'] ?? null;
    if (!$postId) {
        jsonResponse(['error' => 'post_id is required'], 400);
    }

    $stmt = $db->prepare("SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC");
    $stmt->execute([$postId]);
    $comments = $stmt->fetchAll();

    foreach ($comments as &$c) {
        $c['id'] = (int)$c['id'];
        $c['post_id'] = (int)$c['post_id'];
    }

    jsonResponse($comments);
}

if ($method === 'POST') {
    $input = getInput();

    if (empty($input['post_id']) || empty($input['author_name']) || empty($input['content'])) {
        jsonResponse(['error' => 'post_id, author_name, and content are required'], 400);
    }

    $stmt = $db->prepare("
        INSERT INTO comments (post_id, author_name, avatar, content)
        VALUES (?, ?, ?, ?)
    ");
    $stmt->execute([
        $input['post_id'],
        $input['author_name'],
        'https://i.pravatar.cc/150?u=' . urlencode($input['author_name']),
        $input['content'],
    ]);

    $id = (int)$db->lastInsertId();
    $stmt = $db->prepare("SELECT * FROM comments WHERE id = ?");
    $stmt->execute([$id]);
    $comment = $stmt->fetch();
    $comment['id'] = (int)$comment['id'];
    $comment['post_id'] = (int)$comment['post_id'];

    jsonResponse($comment, 201);
}
