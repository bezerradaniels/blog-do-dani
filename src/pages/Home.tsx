import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import PostCard from '../components/PostCard';
import Sidebar from '../components/Sidebar';
import { posts as mockPosts, categories as mockCategories } from '../data/mock';
import type { Post } from '../types';

const SLIDE_DURATION = 6000;

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState<'right' | 'left'>('right');
  const [visibleCount, setVisibleCount] = useState(4);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const published = mockPosts.filter(p => p.status === 'published');
    const featured = published.filter(p => p.featured);
    const slides = featured.length >= 3 ? featured.slice(0, 3) : published.slice(0, 3);
    setFeaturedPosts(slides);
    setPosts(published.filter(p => !slides.find(s => s.id === p.id)));
  }, []);

  const next = useCallback(() => {
    setDirection('right');
    setCurrent(c => (c + 1) % 3);
    setProgress(0);
  }, []);

  const prev = useCallback(() => {
    setDirection('left');
    setCurrent(c => (c - 1 + 3) % 3);
    setProgress(0);
  }, []);

  useEffect(() => {
    if (featuredPosts.length === 0 || paused) return;

    progressRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) return 0;
        return p + (100 / (SLIDE_DURATION / 50));
      });
    }, 50);

    intervalRef.current = setInterval(() => {
      next();
    }, SLIDE_DURATION);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [featuredPosts.length, paused, current, next]);

  const topPosts = [...mockPosts].sort((a, b) => b.views - a.views).slice(0, 3);
  const featured = featuredPosts[current] ?? null;

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Carousel */}
      {featured && (
        <section
          className="max-w-7xl mx-auto px-4 pt-8 pb-10"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative bg-white rounded-2xl overflow-hidden border border-border">
            {/* Slides */}
            <div className="grid md:grid-cols-2 gap-0">
              <div className="aspect-video md:aspect-auto overflow-hidden">
                <img
                  src={featured.featured_image}
                  alt={featured.title}
                  className="w-full h-full object-cover"
                  style={{ transition: 'transform 0.4s ease' }}
                />
              </div>
              <div className={`${direction === 'right' ? 'carousel-slide-right' : 'carousel-slide-left'} p-8 flex flex-col justify-center`} key={`text-${current}`}>
                <div className="flex items-center gap-3 text-xs">
                  <span
                    className="px-2.5 py-1 font-bold rounded"
                    style={{ backgroundColor: featured.category.color + '20', color: featured.category.color }}
                  >
                    {featured.category.name}
                  </span>
                </div>
                <h1 className="mt-4 text-2xl lg:text-3xl font-bold text-text leading-tight line-clamp-3">
                  {featured.title}
                </h1>
                <p className="mt-3 text-text-muted text-sm leading-relaxed line-clamp-3">
                  {featured.excerpt}
                </p>
                <Link
                  to={`/artigo/${featured.slug}`}
                  className="mt-6 inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all"
                >
                  Ler Artigo Completo <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Arrows with progress ring */}
            {[{ onClick: prev, icon: <ChevronLeft className="w-5 h-5" />, side: 'left-3' },
              { onClick: next, icon: <ChevronRight className="w-5 h-5" />, side: 'right-3' }
            ].map(({ onClick, icon, side }) => {
              const r = 17;
              const circ = 2 * Math.PI * r;
              const offset = circ - (progress / 100) * circ;
              return (
                <button
                  key={side}
                  onClick={onClick}
                  className={`absolute ${side} top-[28vw] md:top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-text-muted hover:text-primary transition`}
                >
                  <svg className="absolute inset-0 w-10 h-10 -rotate-90" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r={r} fill="white" fillOpacity="0.8" stroke="#e2e8f0" strokeWidth="1.5" />
                    <circle
                      cx="20" cy="20" r={r}
                      fill="none"
                      stroke="var(--color-primary)"
                      strokeWidth="2"
                      strokeDasharray={circ}
                      strokeDashoffset={offset}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 0.05s linear' }}
                    />
                  </svg>
                  <span className="relative z-10">{icon}</span>
                </button>
              );
            })}

          </div>
        </section>
      )}

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-[1fr_340px] gap-8">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-text">Últimas Publicações</h2>
              <Link to="/categoria/seo" className="text-sm text-primary font-medium hover:underline">
                Ver todos
              </Link>
            </div>

            <div className="space-y-4">
              {posts.slice(0, visibleCount).map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {visibleCount < posts.length && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setVisibleCount(v => v + 4)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 border border-border rounded-lg text-sm font-medium text-text hover:bg-white hover:shadow-sm transition"
                >
                  Carregar mais artigos
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          <Sidebar
            showSearch
            showAd
            showTopPosts
            showCategories
            topPosts={topPosts}
            categories={mockCategories}
          />
        </div>
      </section>
    </div>
  );
}
