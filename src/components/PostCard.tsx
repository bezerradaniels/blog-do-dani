import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Post } from '../types';

interface Props {
  post: Post;
  variant?: 'horizontal' | 'vertical';
}

export default function PostCard({ post, variant = 'horizontal' }: Props) {
  if (variant === 'vertical') {
    return (
      <Link to={`/artigo/${post.slug}`} className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
        <div className="aspect-video overflow-hidden">
          <img
            src={post.featured_image || 'https://picsum.photos/seed/' + post.id + '/600/340'}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        </div>
        <div className="p-5">
          <span
            className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded"
            style={{ backgroundColor: post.category.color + '20', color: post.category.color }}
          >
            {post.category.name}
          </span>
          <h3 className="mt-3 text-lg font-bold text-text group-hover:text-primary transition line-clamp-2">
            {post.title}
          </h3>
          <p className="mt-2 text-sm text-text-muted line-clamp-2">{post.excerpt}</p>
          <span className="mt-3 inline-flex items-center gap-1 text-primary font-semibold text-sm group-hover:gap-2 transition-all">
            Ler Artigo Completo <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/artigo/${post.slug}`} className="group flex flex-col sm:flex-row gap-0 sm:gap-5 bg-white rounded-xl overflow-hidden sm:p-4 shadow-sm hover:shadow-md transition">
      <div className="w-full sm:w-40 sm:h-28 sm:shrink-0 sm:rounded-lg overflow-hidden">
        <img
          src={post.featured_image || 'https://picsum.photos/seed/' + post.id + '/400/260'}
          alt={post.title}
          className="w-full h-44 sm:h-full object-cover group-hover:scale-105 transition duration-300"
        />
      </div>
      <div className="flex flex-col justify-center min-w-0 p-4 sm:p-0">
        <span
          className="self-start text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded"
          style={{ backgroundColor: post.category.color + '20', color: post.category.color }}
        >
          {post.category.name}
        </span>
        <h3 className="mt-2 text-base font-bold text-text group-hover:text-primary transition line-clamp-2">
          {post.title}
        </h3>
        <p className="mt-1 text-sm text-text-muted line-clamp-2">{post.excerpt}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-primary font-semibold text-sm group-hover:gap-2 transition-all">
          Ler Artigo Completo <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}
