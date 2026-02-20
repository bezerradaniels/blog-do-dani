<?php
require_once __DIR__ . '/database.php';
corsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

$uploadDir = __DIR__ . '/uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

if (!isset($_FILES['image'])) {
    jsonResponse(['error' => 'No image file provided'], 400);
}

$file = $_FILES['image'];
$allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

if (!in_array($file['type'], $allowedTypes)) {
    jsonResponse(['error' => 'Invalid file type. Allowed: jpg, png, gif, webp'], 400);
}

if ($file['size'] > 5 * 1024 * 1024) {
    jsonResponse(['error' => 'File too large. Max 5MB'], 400);
}

$ext = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = uniqid('img_') . '.' . $ext;
$destination = $uploadDir . $filename;

if (!move_uploaded_file($file['tmp_name'], $destination)) {
    jsonResponse(['error' => 'Failed to save file'], 500);
}

jsonResponse(['url' => '/api/uploads/' . $filename], 201);
