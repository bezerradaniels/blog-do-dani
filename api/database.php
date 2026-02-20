<?php
function getDB(): PDO {
    $dbPath = __DIR__ . '/blog.db';
    $isNew = !file_exists($dbPath);

    $pdo = new PDO("sqlite:$dbPath");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    if ($isNew) {
        initDB($pdo);
    } else {
        migrateDB($pdo);
    }

    return $pdo;
}

function initDB(PDO $pdo): void {
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            slug TEXT NOT NULL UNIQUE,
            color TEXT NOT NULL DEFAULT '#2563eb'
        );

        CREATE TABLE IF NOT EXISTS authors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT '',
            bio TEXT NOT NULL DEFAULT '',
            avatar TEXT NOT NULL DEFAULT ''
        );

        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            slug TEXT NOT NULL UNIQUE,
            excerpt TEXT NOT NULL DEFAULT '',
            content TEXT NOT NULL DEFAULT '',
            featured_image TEXT NOT NULL DEFAULT '',
            category_id INTEGER NOT NULL,
            author_id INTEGER NOT NULL DEFAULT 1,
            tags TEXT NOT NULL DEFAULT '[]',
            read_time INTEGER NOT NULL DEFAULT 5,
            views INTEGER NOT NULL DEFAULT 0,
            status TEXT NOT NULL DEFAULT 'draft',
            featured INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL DEFAULT (datetime('now')),
            updated_at TEXT NOT NULL DEFAULT (datetime('now')),
            FOREIGN KEY (category_id) REFERENCES categories(id),
            FOREIGN KEY (author_id) REFERENCES authors(id)
        );

        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            name TEXT NOT NULL,
            avatar TEXT NOT NULL DEFAULT '',
            role TEXT NOT NULL DEFAULT 'collaborator',
            created_at TEXT NOT NULL DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS ads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL DEFAULT '',
            image TEXT NOT NULL DEFAULT '',
            link TEXT NOT NULL DEFAULT '',
            link_text TEXT NOT NULL DEFAULT 'Saiba mais',
            active INTEGER NOT NULL DEFAULT 1,
            position TEXT NOT NULL DEFAULT 'sidebar',
            created_at TEXT NOT NULL DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            post_id INTEGER NOT NULL,
            author_name TEXT NOT NULL,
            avatar TEXT NOT NULL DEFAULT '',
            content TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT (datetime('now')),
            FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
        );
    ");

    // Seed categories
    $cats = [
        ['SEO', 'seo', '#2563eb'],
        ['Marketing de Conteúdo', 'conteudo', '#7c3aed'],
        ['Tráfego', 'trafego', '#059669'],
        ['Social Media', 'social-media', '#e11d48'],
        ['Analytics', 'analytics', '#d97706'],
        ['E-mail Marketing', 'email-marketing', '#0891b2'],
        ['Branding', 'branding', '#be185d'],
        ['PPC', 'ppc', '#4f46e5'],
    ];
    $stmt = $pdo->prepare("INSERT INTO categories (name, slug, color) VALUES (?, ?, ?)");
    foreach ($cats as $c) {
        $stmt->execute($c);
    }

    // Seed authors
    $authors = [
        ['Ana Silva', 'Editora Chefe', 'Apaixonada por dados e storytelling. Ajuda marcas a encontrar sua voz no caos digital há mais de 10 anos.', 'https://i.pravatar.cc/150?img=1'],
        ['Carlos Mendes', 'Growth Hacker', 'Especialista em estratégias de crescimento e automação de marketing.', 'https://i.pravatar.cc/150?img=3'],
        ['Sofia Monteiro', 'Especialista em SEO', 'Consultora de SEO com foco em estratégias de conteúdo e link building.', 'https://i.pravatar.cc/150?img=5'],
    ];
    $stmt = $pdo->prepare("INSERT INTO authors (name, role, bio, avatar) VALUES (?, ?, ?, ?)");
    foreach ($authors as $a) {
        $stmt->execute($a);
    }

    // Seed posts
    $postsData = [
        [
            'O Futuro do SEO em 2024: O que você precisa saber',
            'futuro-do-seo-2024',
            'Descubra as principais tendências e mudanças nos algoritmos de busca que impactarão drasticamente sua estratégia de marketing digital este ano.',
            '<p class="text-lg text-text-muted leading-relaxed mb-6">Uma análise profunda sobre as novas tecnologias de busca generativa e como adaptar sua estratégia de conteúdo para sobreviver à era dos algoritmos inteligentes.</p><p class="mb-4">Nos últimos doze meses, o cenário de Search Engine Optimization (SEO) passou por uma transformação mais radical do que na última década inteira. A introdução da Experiência Generativa de Pesquisa (SGE) pelo Google não é apenas uma mudança de algoritmo; é uma redefinição fundamental de como a informação é recuperada e consumida na web.</p><p class="mb-4">Para profissionais de marketing, isso significa que as velhas táticas de "preenchimento de palavras-chave" e backlinks de baixa qualidade estão oficialmente mortas. O foco mudou diretamente para a <strong>intenção do usuário</strong> e a <strong>profundidade semântica do conteúdo</strong>.</p><h2 class="text-2xl font-bold text-text mt-8 mb-4">Entendendo a Mudança para o Busca Semântica</h2><p class="mb-4">A IA não está apenas lendo palavras; ela está entendendo conceitos. Quando um usuário pergunta "qual o melhor tênis para correr maratona", o motor de busca não procura mais apenas páginas que repetem essa frase exata. Ele busca conteúdos: avaliações, durabilidade, reviews de especialistas e comparações técnicas.</p><blockquote class="border-l-4 border-primary bg-blue-50 p-6 my-6 rounded-r-lg italic text-text">"O conteúdo que vence em 2024 é aquele que responde perguntas que o usuário ainda nem sabe que tem."</blockquote><p class="mb-4">Isso exige uma nova abordagem na criação de conteúdo, focada em tópicos (topic clusters) em vez de palavras-chave isoladas.</p><h2 class="text-2xl font-bold text-text mt-8 mb-4">Estratégias Práticas para Adaptação</h2><ul class="list-disc pl-6 mb-6 space-y-2"><li>Priorize a experiência e autoridade (E-E-A-T) em cada peça de conteúdo.</li><li>Otimize para respostas diretas e snippets em destaque.</li><li>Invista em multimídia: vídeos e infográficos são cada vez mais priorizados.</li><li>Analise conteúdo antigo com novas informações e contextos mais ricos.</li></ul><p class="mb-4">A adaptação não é opcional. As marcas que continuarem a tratar o SEO como um jogo de números verão seu tráfego orgânico despencar, enquanto aquelas que abraçarem a IA como uma ferramenta de aprimoramento da experiência humana irão prosperar.</p>',
            'https://picsum.photos/seed/seo2024/800/450',
            1, 1, '["SEO","InteligênciaArtificial","MarketingDigital"]', 8, 15200, 'published', 1,
            '2024-03-15 10:00:00'
        ],
        [
            'Estratégias de Conteúdo B2B que Convertem',
            'estrategias-conteudo-b2b',
            'Aprenda como criar conteúdo técnico e aprofundado que realmente ressoa com tomadores de decisão em empresas B2B.',
            '<p class="mb-4">O marketing de conteúdo B2B exige uma abordagem diferente do B2C. Seu público são profissionais que buscam soluções específicas para problemas complexos.</p><h2 class="text-2xl font-bold text-text mt-8 mb-4">Conheça Seu Público</h2><p class="mb-4">Antes de criar qualquer peça de conteúdo, mapeie as personas de decisão dentro das empresas-alvo. Entenda suas dores, desafios e objetivos.</p><ul class="list-disc pl-6 mb-6 space-y-2"><li>Crie white papers e estudos de caso detalhados.</li><li>Use dados e estatísticas para embasar seus argumentos.</li><li>Foque em ROI e resultados mensuráveis.</li></ul>',
            'https://picsum.photos/seed/b2b/800/450',
            2, 2, '["B2B","Conteúdo","Estratégia"]', 7, 8400, 'published', 0,
            '2024-03-12 14:00:00'
        ],
        [
            'Otimizando Ads em Redes Sociais: ROI Máximo',
            'otimizando-ads-redes-sociais',
            'Dicas práticas para reduzir o custo por clique e aumentar o retorno sobre investimento em suas campanhas pagas.',
            '<p class="mb-4">Anúncios em redes sociais podem ser extremamente eficazes quando bem otimizados. O segredo está na segmentação precisa e na criatividade dos anúncios.</p><h2 class="text-2xl font-bold text-text mt-8 mb-4">Segmentação é Tudo</h2><p class="mb-4">Utilize lookalike audiences e retargeting para alcançar pessoas com maior probabilidade de conversão.</p>',
            'https://picsum.photos/seed/ads/800/450',
            4, 3, '["Ads","ROI","SocialMedia"]', 5, 6200, 'published', 0,
            '2024-03-10 09:00:00'
        ],
        [
            'Guia Completo de Migração do GA4',
            'guia-migracao-ga4',
            'Tudo o que você precisa fazer antes do prazo final para garantir que seus dados históricos sejam preservados.',
            '<p class="mb-4">A migração do Universal Analytics para o Google Analytics 4 é uma das mudanças mais significativas no mundo da análise de dados web.</p><h2 class="text-2xl font-bold text-text mt-8 mb-4">Passo a Passo</h2><ul class="list-disc pl-6 mb-6 space-y-2"><li>Exporte seus dados históricos do UA.</li><li>Configure corretamente os eventos no GA4.</li><li>Valide a coleta de dados antes de desativar o UA.</li></ul>',
            'https://picsum.photos/seed/ga4/800/450',
            5, 1, '["Analytics","GA4","Google"]', 10, 12100, 'published', 0,
            '2024-03-08 11:00:00'
        ],
        [
            'Soft Skills Essenciais para Marketing em 2024',
            'soft-skills-marketing-2024',
            'Por que a adaptabilidade e a comunicação clara estão se tornando mais valiosas que o conhecimento técnico puro.',
            '<p class="mb-4">No cenário atual de marketing digital, as habilidades técnicas são apenas metade da equação. Soft skills como comunicação, empatia e pensamento crítico são cada vez mais valorizadas.</p>',
            'https://picsum.photos/seed/skills/800/450',
            2, 2, '["Carreira","SoftSkills","Marketing"]', 4, 3800, 'published', 0,
            '2024-03-05 16:00:00'
        ],
        [
            'Como construir backlinks de alta qualidade sem gastar nada',
            'backlinks-alta-qualidade-gratis',
            'Estratégias práticas de link building focadas em relacionamento e criação de conteúdo viral para aquisição orgânica de links.',
            '<p class="mb-4">Link building continua sendo um dos pilares mais importantes do SEO. A boa notícia é que você não precisa de um grande orçamento para conseguir backlinks de qualidade.</p><h2 class="text-2xl font-bold text-text mt-8 mb-4">Estratégias Gratuitas</h2><ul class="list-disc pl-6 mb-6 space-y-2"><li>Guest posting em blogs relevantes.</li><li>Criação de infográficos compartilháveis.</li><li>Broken link building.</li><li>Participação ativa em comunidades do nicho.</li></ul>',
            'https://picsum.photos/seed/links/800/450',
            1, 3, '["SEO","LinkBuilding","Backlinks"]', 12, 9800, 'published', 0,
            '2024-02-28 08:00:00'
        ],
        [
            'SEO para Mobile: Otimizando para a era Mobile-First',
            'seo-mobile-first',
            'Com a indexação mobile-first do Google, garantir que seu site seja responsivo e rápido nunca foi tão importante.',
            '<p class="mb-4">O Google agora prioriza a versão mobile do seu site para indexação e ranking. Se seu site não está otimizado para dispositivos móveis, você está perdendo posições.</p>',
            'https://picsum.photos/seed/mobile/800/450',
            1, 1, '["SEO","Mobile","Performance"]', 6, 7200, 'published', 0,
            '2024-02-25 13:00:00'
        ],
        [
            'Top 10 Ferramentas de Automação de Marketing',
            'ferramentas-automacao-marketing',
            'Uma análise detalhada das melhores ferramentas para automatizar seus fluxos de marketing e aumentar a produtividade.',
            '<p class="mb-4">A automação de marketing permite escalar suas operações sem aumentar proporcionalmente sua equipe. Conheça as melhores ferramentas disponíveis.</p>',
            'https://picsum.photos/seed/tools/800/450',
            6, 2, '["Automação","Ferramentas","Produtividade"]', 9, 11500, 'published', 0,
            '2024-02-20 10:00:00'
        ],
        [
            'Guia Completo de Core Web Vitals para 2024',
            'core-web-vitals-2024',
            'Entenda as novas métricas de experiência do usuário do Google e como elas impactam seu ranking nos resultados de busca.',
            '<p class="mb-4">Core Web Vitals são métricas essenciais que o Google usa para avaliar a experiência do usuário no seu site. Em 2024, essas métricas ganharam ainda mais peso no algoritmo.</p>',
            'https://picsum.photos/seed/cwv/800/450',
            1, 3, '["SEO","Performance","CoreWebVitals"]', 8, 6500, 'published', 0,
            '2024-02-15 09:00:00'
        ],
        [
            'O Guia Definitivo de Link Building',
            'guia-definitivo-link-building',
            'Tudo que você precisa saber sobre construção de links em 2024, desde outreach até digital PR.',
            '<p class="mb-4">Link building é uma arte e uma ciência. Este guia cobre desde as técnicas básicas até estratégias avançadas de digital PR.</p>',
            'https://picsum.photos/seed/linkbuild/800/450',
            1, 1, '["SEO","LinkBuilding"]', 15, 6500, 'published', 0,
            '2024-02-10 14:00:00'
        ],
    ];

    $stmt = $pdo->prepare("INSERT INTO posts (title, slug, excerpt, content, featured_image, category_id, author_id, tags, read_time, views, status, featured, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    foreach ($postsData as $p) {
        $p[] = $p[12]; // updated_at = created_at
        $stmt->execute($p);
    }

    // Seed admin user (password: admin123)
    $stmt = $pdo->prepare("INSERT INTO users (username, password, name, avatar, role) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute(['admin', password_hash('admin123', PASSWORD_DEFAULT), 'Administrador', 'https://i.pravatar.cc/150?img=68', 'admin']);

    // Seed comments
    $commentsData = [
        [1, 'Lucas Silva', 'https://i.pravatar.cc/150?img=11', 'Ótima análise, Sofia! A parte sobre E-E-A-T é crucial. Tenho visto muitos dos meus projetos caírem por falta de autoridade no conteúdo.', '2024-03-16 08:00:00'],
        [1, 'Maria Santos', 'https://i.pravatar.cc/150?img=21', 'Excelente artigo! Seria legal um follow-up sobre como implementar topic clusters na prática.', '2024-03-16 12:00:00'],
        [1, 'Pedro Oliveira', 'https://i.pravatar.cc/150?img=15', 'Concordo 100%. A busca semântica está mudando tudo. Precisamos nos adaptar rapidamente.', '2024-03-17 09:00:00'],
    ];
    $stmt = $pdo->prepare("INSERT INTO comments (post_id, author_name, avatar, content, created_at) VALUES (?, ?, ?, ?, ?)");
    foreach ($commentsData as $c) {
        $stmt->execute($c);
    }
}

function migrateDB(PDO $pdo): void {
    // Add role column if missing
    $cols = $pdo->query("PRAGMA table_info(users)")->fetchAll();
    $hasRole = array_filter($cols, fn($c) => $c['name'] === 'role');
    if (empty($hasRole)) {
        $pdo->exec("ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'collaborator'");
        $pdo->exec("UPDATE users SET role = 'admin' WHERE id = 1");
    }

    // Create ads table if missing
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS ads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL DEFAULT '',
            image TEXT NOT NULL DEFAULT '',
            link TEXT NOT NULL DEFAULT '',
            link_text TEXT NOT NULL DEFAULT 'Saiba mais',
            active INTEGER NOT NULL DEFAULT 1,
            position TEXT NOT NULL DEFAULT 'sidebar',
            created_at TEXT NOT NULL DEFAULT (datetime('now'))
        )
    ");
}

function corsHeaders(): void {
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: http://localhost:5173');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Credentials: true');

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

function startSession(): void {
    if (session_status() === PHP_SESSION_NONE) {
        session_set_cookie_params([
            'lifetime' => 86400,
            'path' => '/',
            'httponly' => true,
            'samesite' => 'Lax',
        ]);
        session_start();
    }
}

function requireAuth(): void {
    startSession();
    if (empty($_SESSION['user_id'])) {
        jsonResponse(['error' => 'Unauthorized'], 401);
    }
}

function jsonResponse($data, int $status = 200): void {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function getInput(): array {
    return json_decode(file_get_contents('php://input'), true) ?? [];
}
