import { Link } from 'react-router-dom';
import { TrendingUp, Search } from 'lucide-react';
import AdBanner from './AdBanner';
import type { Post, Category } from '../types';

interface Props {
  showSearch?: boolean;
  showAd?: boolean;
  showTopPosts?: boolean;
  showCategories?: boolean;
  topPosts?: Post[];
  categories?: Category[];
}

export default function Sidebar({
  showSearch = false,
  showAd = true,
  showTopPosts = false,
  showCategories = false,
  topPosts = [],
  categories = [],
}: Props) {
  return (
    <aside className="space-y-6">
      {showSearch && (
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="font-bold text-text mb-3">Buscar</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="O que você procura?"
              className="w-full pl-9 pr-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>
      )}

      {showAd && <AdBanner position="sidebar" />}

      {showTopPosts && topPosts.length > 0 && (
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="font-bold text-text flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            Mais Lidos
          </h3>
          <div className="space-y-4">
            {topPosts.map((post, i) => (
              <Link key={post.id} to={`/artigo/${post.slug}`} className="flex gap-3 group">
                <span className="text-2xl font-bold text-primary/30">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h4 className="text-sm font-medium text-text group-hover:text-primary transition line-clamp-2">
                    {post.title}
                  </h4>
                  <span className="text-xs text-text-muted">{(post.views / 1000).toFixed(1)}k visualizações</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {showCategories && categories.length > 0 && (
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="font-bold text-text mb-4">Categorias</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/categoria/${cat.slug}`}
                className="px-3 py-1.5 text-sm bg-bg rounded-lg text-text-muted hover:bg-primary hover:text-white transition"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
