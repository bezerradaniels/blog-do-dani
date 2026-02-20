import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PostCard from '../components/PostCard';
import Sidebar from '../components/Sidebar';
import { posts as mockPosts, categories as mockCategories, authors as mockAuthors } from '../data/mock';
import type { Post } from '../types';

type FilterType = 'recent' | 'popular' | 'most_read';

export default function Category() {
  const { slug } = useParams<{ slug: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<FilterType>('recent');
  const [page, setPage] = useState(1);
  const perPage = 4;

  const category = mockCategories.find(c => c.slug === slug);

  useEffect(() => {
    let filtered = mockPosts.filter(p => p.status === 'published');
    if (slug) {
      filtered = filtered.filter(p => p.category.slug === slug);
    }

    switch (filter) {
      case 'popular':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'most_read':
        filtered.sort((a, b) => b.read_time - a.read_time);
        break;
      default:
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    setPosts(filtered);
    setPage(1);
  }, [slug, filter]);

  const totalPages = Math.ceil(posts.length / perPage);
  const paginatedPosts = posts.slice((page - 1) * perPage, page * perPage);

  const trendingTags = ['#InteligênciaArtificial', '#ChatGPT', '#SEO2024', '#Copywriting', '#EmailMarketing', '#Branding'];

  return (
    <div className="min-h-screen bg-bg">
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[1fr_340px] gap-8">
          <div>
            {/* Header */}
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Categoria</span>
              <h1 className="mt-1 text-3xl font-bold text-text">
                {category ? `Artigos sobre ${category.name}` : 'Todos os Artigos'}
              </h1>
              <p className="mt-2 text-text-muted max-w-lg">
                Explore as últimas estratégias, ferramentas e novidades para otimizar seu site e alcançar o topo das buscas.
              </p>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={() => setFilter('recent')}
                className={`px-4 py-2 text-sm rounded-full font-medium transition ${
                  filter === 'recent'
                    ? 'bg-primary text-white'
                    : 'bg-white text-text-muted border border-border hover:border-primary hover:text-primary'
                }`}
              >
                🕐 Mais Recentes
              </button>
              <button
                onClick={() => setFilter('most_read')}
                className={`px-4 py-2 text-sm rounded-full font-medium transition ${
                  filter === 'most_read'
                    ? 'bg-primary text-white'
                    : 'bg-white text-text-muted border border-border hover:border-primary hover:text-primary'
                }`}
              >
                📈 Mais Lidos
              </button>
              <button
                onClick={() => setFilter('popular')}
                className={`px-4 py-2 text-sm rounded-full font-medium transition ${
                  filter === 'popular'
                    ? 'bg-primary text-white'
                    : 'bg-white text-text-muted border border-border hover:border-primary hover:text-primary'
                }`}
              >
                ⭐ Populares
              </button>
            </div>

            {/* Posts */}
            <div className="space-y-4">
              {paginatedPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
              {paginatedPosts.length === 0 && (
                <div className="text-center py-16 text-text-muted">
                  Nenhum artigo encontrado nesta categoria.
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 border border-border rounded-lg text-text-muted hover:text-text disabled:opacity-30 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                      page === n
                        ? 'bg-primary text-white'
                        : 'border border-border text-text-muted hover:text-text'
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 border border-border rounded-lg text-text-muted hover:text-text disabled:opacity-30 transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Sidebar showAd />

            {/* Trending Topics */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h3 className="font-bold text-text flex items-center gap-2 mb-4">
                📈 Tópicos em Alta
              </h3>
              <div className="flex flex-wrap gap-2">
                {trendingTags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 text-sm bg-bg rounded-full text-text-muted hover:bg-primary/10 hover:text-primary cursor-pointer transition"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Featured Authors */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h3 className="font-bold text-text mb-4">Autores em Destaque</h3>
              <div className="space-y-3">
                {mockAuthors.slice(0, 2).map(author => (
                  <div key={author.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={author.avatar} alt={author.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="text-sm font-medium text-text">{author.name}</p>
                        <p className="text-xs text-text-muted">{author.role}</p>
                      </div>
                    </div>
                    <button className="text-primary text-lg font-bold hover:bg-primary/10 w-7 h-7 rounded-full flex items-center justify-center transition">+</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
