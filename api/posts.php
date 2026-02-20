<?php
require_once __DIR__ . '/database.php';
corsHeaders();

$db = getDB();
$method = $_SERVER['REQUEST_METHOD'];

function formatPost(array $row): array {
    $row['tags'] = json_decode($row['tags'], true) ?: [];
    $row['featured'] = (bool)$row['featured'];
    $row['views'] = (int)$row['views'];
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
    return $row;
}

$baseQuery = "
    SELECT p.*,
        c.id as cat_id, c.name as cat_name, c.slug as cat_slug, c.color as cat_color,
        a.name as author_name, a.role as author_role, a.bio as author_bio, a.avatar as author_avatar
    FROM posts p
    JOIN categories c ON p.category_id = c.id
    JOIN authors a ON p.author_id = a.id
";

if ($method === 'GET') {
    // Single featured post
    if (isset($_GET['featured']) && $_GET['featured'] === '1') {
        $stmt = $db->prepare("$baseQuery WHERE p.featured = 1 AND p.status = 'published' LIMIT 1");
        $stmt->execute();
        $row = $stmt->fetch();
        if ($row) {
            jsonResponse(formatPost($row));
        }
        jsonResponse(null, 404);
    }

    // Search
    if (isset($_GET['search'])) {
        $q = '%' . $_GET['search'] . '%';
        $stmt = $db->prepare("$baseQuery WHERE p.status = 'published' AND (p.title LIKE ? OR p.excerpt LIKE ?) ORDER BY p.created_at DESC LIMIT 20");
        $stmt->execute([$q, $q]);
        $posts = array_map('formatPost', $stmt->fetchAll());
        jsonResponse($posts);
    }

    // Paginated list
    $page = max(1, (int)($_GET['page'] ?? 1));
    $perPage = 10;
    $offset = ($page - 1) * $perPage;

    $where = [];
    $params = [];

    if (isset($_GET['category'])) {
        $where[] = "c.slug = ?";
        $params[] = $_GET['category'];
    }

    if (isset($_GET['status'])) {
        $where[] = "p.status = ?";
        $params[] = $_GET['status'];
    } else {
        // Default: only published for public
        if (!isset($_GET['all'])) {
            $where[] = "p.status = 'published'";
        }
    }

    $whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';

    // Count total
    $countStmt = $db->prepare("SELECT COUNT(*) FROM posts p JOIN categories c ON p.category_id = c.id $whereClause");
    $countStmt->execute($params);
    $total = (int)$countStmt->fetchColumn();

    // Fetch page
    $stmt = $db->prepare("$baseQuery $whereClause ORDER BY p.created_at DESC LIMIT ? OFFSET ?");
    $stmt->execute([...$params, $perPage, $offset]);
    $posts = array_map('formatPost', $stmt->fetchAll());

    jsonResponse([
        'data' => $posts,
        'current_page' => $page,
        'total_pages' => max(1, (int)ceil($total / $perPage)),
        'total' => $total,
    ]);
}

if ($method === 'POST') {
    requireAuth();
    $input = getInput();

    if (empty($input['title'])) {
        jsonResponse(['error' => 'Title is required'], 400);
    }

    $slug = $input['slug'] ?? preg_replace('/[^a-z0-9-]/', '', preg_replace('/\s+/', '-', mb_strtolower($input['title'])));
    $tags = json_encode($input['tags'] ?? [], JSON_UNESCAPED_UNICODE);

    $stmt = $db->prepare("
        INSERT INTO posts (title, slug, excerpt, content, featured_image, category_id, author_id, tags, read_time, status, featured)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        $input['title'],
        $slug,
        $input['excerpt'] ?? '',
        $input['content'] ?? '',
        $input['featured_image'] ?? '',
        $input['category']['id'] ?? $input['category_id'] ?? 1,
        $input['author']['id'] ?? $input['author_id'] ?? 1,
        $tags,
        $input['read_time'] ?? 5,
        $input['status'] ?? 'draft',
        $input['featured'] ?? false ? 1 : 0,
    ]);

    $id = (int)$db->lastInsertId();
    $stmt = $db->prepare("$baseQuery WHERE p.id = ?");
    $stmt->execute([$id]);
    jsonResponse(formatPost($stmt->fetch()), 201);
}

if ($method === 'PUT') {
    requireAuth();
    $id = $_GET['id'] ?? null;
    if (!$id) jsonResponse(['error' => 'ID required'], 400);

    $input = getInput();
    $fields = [];
    $params = [];

    $allowed = ['title', 'slug', 'excerpt', 'content', 'featured_image', 'read_time', 'status', 'featured'];
    foreach ($allowed as $field) {
        if (isset($input[$field])) {
            if ($field === 'featured') {
                $fields[] = "$field = ?";
                $params[] = $input[$field] ? 1 : 0;
            } else {
                $fields[] = "$field = ?";
                $params[] = $input[$field];
            }
        }
    }

    if (isset($input['tags'])) {
        $fields[] = "tags = ?";
        $params[] = json_encode($input['tags'], JSON_UNESCAPED_UNICODE);
    }

    if (isset($input['category']['id'])) {
        $fields[] = "category_id = ?";
        $params[] = $input['category']['id'];
    } elseif (isset($input['category_id'])) {
        $fields[] = "category_id = ?";
        $params[] = $input['category_id'];
    }

    $fields[] = "updated_at = datetime('now')";
    $params[] = $id;

    $db->prepare("UPDATE posts SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);

    $stmt = $db->prepare("$baseQuery WHERE p.id = ?");
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) jsonResponse(['error' => 'Not found'], 404);
    jsonResponse(formatPost($row));
}

if ($method === 'DELETE') {
    requireAuth();
    $id = $_GET['id'] ?? null;
    if (!$id) jsonResponse(['error' => 'ID required'], 400);

    $db->prepare("DELETE FROM posts WHERE id = ?")->execute([$id]);
    jsonResponse(['success' => true]);
}
