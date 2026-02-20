# MarketingPro Blog

Blog de marketing digital com frontend React e backend PHP.

## Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS 4, React Router, Lucide Icons
- **Backend:** PHP 8+ com SQLite (banco criado automaticamente no primeiro acesso)

## Páginas

| Rota | Descrição |
|------|-----------|
| `/` | Home — hero com artigo em destaque, lista de posts, sidebar |
| `/categoria/:slug` | Listagem por categoria com filtros e paginação |
| `/artigo/:slug` | Artigo completo com autor, comentários e sidebar |
| `/dashboard` | Painel admin para criar, editar, publicar e excluir artigos |

## Como rodar

### 1. Instalar dependências do frontend

```bash
npm install
```

### 2. Iniciar o servidor PHP (backend API)

```bash
php -S localhost:8000 -t api
```

O banco SQLite (`api/blog.db`) é criado e populado automaticamente no primeiro request.

### 3. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

Acesse **http://localhost:5173**

O Vite está configurado com proxy: todas as chamadas `/api/*` são redirecionadas para o PHP em `localhost:8000`.

## API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/posts.php?page=1` | Lista posts paginados |
| GET | `/api/posts.php?category=seo` | Filtra por categoria |
| GET | `/api/posts.php?search=termo` | Busca posts |
| GET | `/api/posts.php?featured=1` | Post em destaque |
| GET | `/api/post.php?slug=xxx` | Post por slug (incrementa views) |
| POST | `/api/posts.php` | Criar post |
| PUT | `/api/posts.php?id=1` | Atualizar post |
| DELETE | `/api/posts.php?id=1` | Excluir post |
| GET | `/api/categories.php` | Listar categorias |
| GET | `/api/authors.php` | Listar autores |
| GET | `/api/comments.php?post_id=1` | Listar comentários |
| POST | `/api/comments.php` | Adicionar comentário |
| POST | `/api/upload.php` | Upload de imagem (multipart) |

## Build para produção

```bash
npm run build
```

Os arquivos estáticos são gerados em `dist/`.
