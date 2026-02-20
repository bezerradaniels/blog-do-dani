import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, Share2, Bookmark, ThumbsUp, ChevronRight } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { posts as mockPosts } from '../data/mock';
import type { Post } from '../types';

export default function Article() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);

  useEffect(() => {
    const found = mockPosts.find(p => p.slug === slug);
    if (found) {
      setPost(found);
      setRelatedPosts(
        mockPosts
          .filter(p => p.category.id === found.category.id && p.id !== found.id)
          .slice(0, 3)
      );
    }
    window.scrollTo(0, 0);
  }, [slug]);


  if (!post) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-text-muted">Artigo não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <section className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-text-muted mb-6">
          <Link to="/" className="hover:text-primary transition">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to={`/categoria/${post.category.slug}`} className="hover:text-primary transition">{post.category.name}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-text truncate max-w-[200px]">{post.title}</span>
        </nav>

        <div className="grid lg:grid-cols-[1fr_340px] gap-8">
          <article>
            {/* Title */}
            <header className="mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-text leading-tight">{post.title}</h1>
              <p className="mt-3 text-lg text-text-muted">{post.excerpt}</p>
              <div className="mt-5 flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-medium text-primary">{post.author.name}</p>
                    <div className="flex items-center gap-3 text-xs text-text-muted">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(post.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {post.read_time} min de leitura
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Featured Image */}
            <div className="rounded-xl overflow-hidden mb-8">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full aspect-video object-cover"
              />
            </div>

            {/* Content */}
            <div
              className="prose prose-lg max-w-none text-text leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            <div className="mt-8 flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span key={tag} className="px-3 py-1.5 text-sm bg-bg rounded-lg text-text-muted">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Share */}
            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-text">Gostou deste artigo?</p>
                  <p className="text-sm text-text-muted">Compartilhe com sua rede e ajude outros profissionais.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2.5 border border-border rounded-lg text-text-muted hover:text-primary hover:border-primary transition">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button className="p-2.5 border border-border rounded-lg text-text-muted hover:text-primary hover:border-primary transition">
                    <Bookmark className="w-4 h-4" />
                  </button>
                  <button className="p-2.5 border border-border rounded-lg text-text-muted hover:text-primary hover:border-primary transition">
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </article>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <img src={post.author.avatar} alt={post.author.name} className="w-20 h-20 rounded-full object-cover mx-auto" />
              <h3 className="mt-3 font-bold text-text">{post.author.name}</h3>
              <p className="text-sm text-primary">{post.author.role}</p>
              <p className="mt-2 text-sm text-text-muted">{post.author.bio}</p>
              <button className="mt-4 w-full py-2.5 border border-primary text-primary text-sm font-medium rounded-lg hover:bg-primary hover:text-white transition">
                Ver Perfil Completo
              </button>
            </div>

            <Sidebar showAd />

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h3 className="font-bold text-text mb-4 flex items-center gap-1">
                  <span className="w-1 h-5 bg-primary rounded-full" />
                  Leitura Recomendada
                </h3>
                <div className="space-y-4">
                  {relatedPosts.map(rp => (
                    <Link key={rp.id} to={`/artigo/${rp.slug}`} className="flex gap-3 group">
                      <img
                        src={rp.featured_image}
                        alt={rp.title}
                        className="w-16 h-16 rounded-lg object-cover shrink-0"
                      />
                      <div>
                        <span className="text-xs text-primary font-medium">{rp.category.name}</span>
                        <h4 className="text-sm font-medium text-text group-hover:text-primary transition line-clamp-2">
                          {rp.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
