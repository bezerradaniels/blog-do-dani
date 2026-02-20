<?php
require_once __DIR__ . '/database.php';
corsHeaders();

$db = getDB();
$slug = $_GET['slug'] ?? null;

if (!$slug) {
    jsonResponse(['error' => 'Slug is required'], 400);
}

$stmt = $db->prepare("
    SELECT p.*,
        c.id as cat_id, c.name as cat_name, c.slug as cat_slug, c.color as cat_color,
        a.name as author_name, a.role as author_role, a.bio as author_bio, a.avatar as author_avatar
    FROM posts p
    JOIN categories c ON p.category_id = c.id
    JOIN authors a ON p.author_id = a.id
    WHERE p.slug = ?
");
$stmt->execute([$slug]);
$row = $stmt->fetch();

if (!$row) {
    jsonResponse(['error' => 'Post not found'], 404);
}

// Increment views
$db->prepare("UPDATE posts SET views = views + 1 WHERE id = ?")->execute([$row['id']]);

$row['tags'] = json_decode($row['tags'], true) ?: [];
$row['featured'] = (bool)$row['featured'];
$row['views'] = (int)$row['views'] + 1;
$row['read_time'] = (int)$row['read_time'];
$row['id'] = (int)$row['id'];
$row['category'] = [
    'id' => (int)$row['cat_id'],
    'name' => $row['cat_name'],
    'slug' => $row['cat_slug'],
    'color' => $row['cat_color'],
];
$row['author'] = [
    'id' => (int)$row['author_id'],
    'name' => $row['author_name'],
    'role' => $row['author_role'],
    'bio' => $row['author_bio'],
    'avatar' => $row['author_avatar'],
];
unset($row['cat_id'], $row['cat_name'], $row['cat_slug'], $row['cat_color'],
      $row['author_name'], $row['author_role'], $row['author_bio'], $row['author_avatar']);

jsonResponse($row);
