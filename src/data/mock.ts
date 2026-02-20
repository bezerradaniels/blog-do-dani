import type { Post, Category, Author, Comment } from '../types';

export const categories: Category[] = [
  { id: 1, name: 'SEO', slug: 'seo', color: '#2563eb' },
  { id: 2, name: 'Marketing de Conteúdo', slug: 'conteudo', color: '#7c3aed' },
  { id: 3, name: 'Tráfego', slug: 'trafego', color: '#059669' },
  { id: 4, name: 'Social Media', slug: 'social-media', color: '#e11d48' },
  { id: 5, name: 'Analytics', slug: 'analytics', color: '#d97706' },
  { id: 6, name: 'E-mail Marketing', slug: 'email-marketing', color: '#0891b2' },
  { id: 7, name: 'Branding', slug: 'branding', color: '#be185d' },
  { id: 8, name: 'PPC', slug: 'ppc', color: '#4f46e5' },
];

export const authors: Author[] = [
  { id: 1, name: 'Ana Silva', role: 'Editora Chefe', bio: 'Apaixonada por dados e storytelling. Ajuda marcas a encontrar sua voz no caos digital há mais de 10 anos.', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: 2, name: 'Carlos Mendes', role: 'Growth Hacker', bio: 'Especialista em estratégias de crescimento e automação de marketing.', avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: 3, name: 'Sofia Monteiro', role: 'Especialista em SEO', bio: 'Consultora de SEO com foco em estratégias de conteúdo e link building.', avatar: 'https://i.pravatar.cc/150?img=5' },
];

export const posts: Post[] = [
  {
    id: 1,
    title: 'O Futuro do SEO em 2024: O que você precisa saber',
    slug: 'futuro-do-seo-2024',
    excerpt: 'Descubra as principais tendências e mudanças nos algoritmos de busca que impactarão drasticamente sua estratégia de marketing digital este ano.',
    content: `<p class="text-lg text-text-muted leading-relaxed mb-6">Uma análise profunda sobre as novas tecnologias de busca generativa e como adaptar sua estratégia de conteúdo para sobreviver à era dos algoritmos inteligentes.</p>

<p class="mb-4">Nos últimos doze meses, o cenário de Search Engine Optimization (SEO) passou por uma transformação mais radical do que na última década inteira. A introdução da Experiência Generativa de Pesquisa (SGE) pelo Google não é apenas uma mudança de algoritmo; é uma redefinição fundamental de como a informação é recuperada e consumida na web.</p>

<p class="mb-4">Para profissionais de marketing, isso significa que as velhas táticas de "preenchimento de palavras-chave" e backlinks de baixa qualidade estão oficialmente mortas. O foco mudou diretamente para a <strong>intenção do usuário</strong> e a <strong>profundidade semântica do conteúdo</strong>.</p>

<h2 class="text-2xl font-bold text-text mt-8 mb-4">Entendendo a Mudança para o Busca Semântica</h2>

<p class="mb-4">A IA não está apenas lendo palavras; ela está entendendo conceitos. Quando um usuário pergunta "qual o melhor tênis para correr maratona", o motor de busca não procura mais apenas páginas que repetem essa frase exata. Ele busca conteúdos: avaliações, durabilidade, reviews de especialistas e comparações técnicas.</p>

<blockquote class="border-l-4 border-primary bg-blue-50 p-6 my-6 rounded-r-lg italic text-text">
"O conteúdo que vence em 2024 é aquele que responde perguntas que o usuário ainda nem sabe que tem."
</blockquote>

<p class="mb-4">Isso exige uma nova abordagem na criação de conteúdo, focada em tópicos (topic clusters) em vez de palavras-chave isoladas.</p>

<h2 class="text-2xl font-bold text-text mt-8 mb-4">Estratégias Práticas para Adaptação</h2>

<ul class="list-disc pl-6 mb-6 space-y-2">
<li>Priorize a experiência e autoridade (E-E-A-T) em cada peça de conteúdo.</li>
<li>Otimize para respostas diretas e snippets em destaque.</li>
<li>Invista em multimídia: vídeos e infográficos são cada vez mais priorizados.</li>
<li>Analise conteúdo antigo com novas informações e contextos mais ricos.</li>
</ul>

<p class="mb-4">A adaptação não é opcional. As marcas que continuarem a tratar o SEO como um jogo de números verão seu tráfego orgânico despencar, enquanto aquelas que abraçarem a IA como uma ferramenta de aprimoramento da experiência humana irão prosperar.</p>`,
    featured_image: 'https://picsum.photos/seed/seo2024/800/450',
    category: categories[0],
    author: authors[0],
    tags: ['SEO', 'InteligênciaArtificial', 'MarketingDigital'],
    read_time: 8,
    views: 15200,
    status: 'published',
    featured: true,
    created_at: '2024-03-15T10:00:00Z',
    updated_at: '2024-03-15T10:00:00Z',
  },
  {
    id: 2,
    title: 'Estratégias de Conteúdo B2B que Convertem',
    slug: 'estrategias-conteudo-b2b',
    excerpt: 'Aprenda como criar conteúdo técnico e aprofundado que realmente ressoa com tomadores de decisão em empresas B2B.',
    content: '<p>Conteúdo completo do artigo sobre estratégias B2B...</p>',
    featured_image: 'https://picsum.photos/seed/b2b/800/450',
    category: categories[1],
    author: authors[1],
    tags: ['B2B', 'Conteúdo', 'Estratégia'],
    read_time: 7,
    views: 8400,
    status: 'published',
    featured: false,
    created_at: '2024-03-12T14:00:00Z',
    updated_at: '2024-03-12T14:00:00Z',
  },
  {
    id: 3,
    title: 'Otimizando Ads em Redes Sociais: ROI Máximo',
    slug: 'otimizando-ads-redes-sociais',
    excerpt: 'Dicas práticas para reduzir o custo por clique e aumentar o retorno sobre investimento em suas campanhas pagas.',
    content: '<p>Conteúdo completo sobre otimização de anúncios...</p>',
    featured_image: 'https://picsum.photos/seed/ads/800/450',
    category: categories[3],
    author: authors[2],
    tags: ['Ads', 'ROI', 'SocialMedia'],
    read_time: 5,
    views: 6200,
    status: 'published',
    featured: false,
    created_at: '2024-03-10T09:00:00Z',
    updated_at: '2024-03-10T09:00:00Z',
  },
  {
    id: 4,
    title: 'Guia Completo de Migração do GA4',
    slug: 'guia-migracao-ga4',
    excerpt: 'Tudo o que você precisa fazer antes do prazo final para garantir que seus dados históricos sejam preservados.',
    content: '<p>Conteúdo completo sobre migração GA4...</p>',
    featured_image: 'https://picsum.photos/seed/ga4/800/450',
    category: categories[4],
    author: authors[0],
    tags: ['Analytics', 'GA4', 'Google'],
    read_time: 10,
    views: 12100,
    status: 'published',
    featured: false,
    created_at: '2024-03-08T11:00:00Z',
    updated_at: '2024-03-08T11:00:00Z',
  },
  {
    id: 5,
    title: 'Soft Skills Essenciais para Marketing em 2024',
    slug: 'soft-skills-marketing-2024',
    excerpt: 'Por que a adaptabilidade e a comunicação clara estão se tornando mais valiosas que o conhecimento técnico puro.',
    content: '<p>Conteúdo completo sobre soft skills...</p>',
    featured_image: 'https://picsum.photos/seed/skills/800/450',
    category: categories[1],
    author: authors[1],
    tags: ['Carreira', 'SoftSkills', 'Marketing'],
    read_time: 4,
    views: 3800,
    status: 'published',
    featured: false,
    created_at: '2024-03-05T16:00:00Z',
    updated_at: '2024-03-05T16:00:00Z',
  },
  {
    id: 6,
    title: 'Como construir backlinks de alta qualidade sem gastar nada',
    slug: 'backlinks-alta-qualidade-gratis',
    excerpt: 'Estratégias práticas de link building focadas em relacionamento e criação de conteúdo viral para aquisição orgânica de links.',
    content: '<p>Conteúdo completo sobre link building...</p>',
    featured_image: 'https://picsum.photos/seed/links/800/450',
    category: categories[0],
    author: authors[2],
    tags: ['SEO', 'LinkBuilding', 'Backlinks'],
    read_time: 12,
    views: 9800,
    status: 'published',
    featured: false,
    created_at: '2024-02-28T08:00:00Z',
    updated_at: '2024-02-28T08:00:00Z',
  },
  {
    id: 7,
    title: 'SEO para Mobile: Otimizando para a era Mobile-First',
    slug: 'seo-mobile-first',
    excerpt: 'Com a indexação mobile-first do Google, garantir que seu site seja responsivo e rápido nunca foi tão importante.',
    content: '<p>Conteúdo completo sobre SEO mobile...</p>',
    featured_image: 'https://picsum.photos/seed/mobile/800/450',
    category: categories[0],
    author: authors[0],
    tags: ['SEO', 'Mobile', 'Performance'],
    read_time: 6,
    views: 7200,
    status: 'published',
    featured: false,
    created_at: '2024-02-25T13:00:00Z',
    updated_at: '2024-02-25T13:00:00Z',
  },
  {
    id: 8,
    title: 'Top 10 Ferramentas de Automação de Marketing',
    slug: 'ferramentas-automacao-marketing',
    excerpt: 'Uma análise detalhada das melhores ferramentas para automatizar seus fluxos de marketing e aumentar a produtividade.',
    content: '<p>Conteúdo completo sobre automação...</p>',
    featured_image: 'https://picsum.photos/seed/tools/800/450',
    category: categories[5],
    author: authors[1],
    tags: ['Automação', 'Ferramentas', 'Produtividade'],
    read_time: 9,
    views: 11500,
    status: 'published',
    featured: false,
    created_at: '2024-02-20T10:00:00Z',
    updated_at: '2024-02-20T10:00:00Z',
  },
  {
    id: 9,
    title: 'Guia Completo de Core Web Vitals para 2024',
    slug: 'core-web-vitals-2024',
    excerpt: 'Entenda as novas métricas de experiência do usuário do Google e como elas impactam seu ranking nos resultados de busca.',
    content: '<p>Conteúdo completo sobre Core Web Vitals...</p>',
    featured_image: 'https://picsum.photos/seed/cwv/800/450',
    category: categories[0],
    author: authors[2],
    tags: ['SEO', 'Performance', 'CoreWebVitals'],
    read_time: 8,
    views: 6500,
    status: 'published',
    featured: false,
    created_at: '2024-02-15T09:00:00Z',
    updated_at: '2024-02-15T09:00:00Z',
  },
  {
    id: 10,
    title: 'O Guia Definitivo de Link Building',
    slug: 'guia-definitivo-link-building',
    excerpt: 'Tudo que você precisa saber sobre construção de links em 2024, desde outreach até digital PR.',
    content: '<p>Conteúdo completo sobre link building avançado...</p>',
    featured_image: 'https://picsum.photos/seed/linkbuild/800/450',
    category: categories[0],
    author: authors[0],
    tags: ['SEO', 'LinkBuilding'],
    read_time: 15,
    views: 6500,
    status: 'published',
    featured: false,
    created_at: '2024-02-10T14:00:00Z',
    updated_at: '2024-02-10T14:00:00Z',
  },
];

export const comments: Comment[] = [
  { id: 1, post_id: 1, author_name: 'Lucas Silva', avatar: 'https://i.pravatar.cc/150?img=11', content: 'Ótima análise, Sofia! A parte sobre E-E-A-T é crucial. Tenho visto muitos dos meus projetos caírem por falta de autoridade no conteúdo.', created_at: '2024-03-16T08:00:00Z' },
  { id: 2, post_id: 1, author_name: 'Maria Santos', avatar: 'https://i.pravatar.cc/150?img=21', content: 'Excelente artigo! Seria legal um follow-up sobre como implementar topic clusters na prática.', created_at: '2024-03-16T12:00:00Z' },
  { id: 3, post_id: 1, author_name: 'Pedro Oliveira', avatar: 'https://i.pravatar.cc/150?img=15', content: 'Concordo 100%. A busca semântica está mudando tudo. Precisamos nos adaptar rapidamente.', created_at: '2024-03-17T09:00:00Z' },
];
