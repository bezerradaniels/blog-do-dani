import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-1 font-bold text-xl text-gray-800">
            <svg viewBox="0 0 64 64" className="w-10 h-10 text-primary" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Face */}
              <circle cx="32" cy="34" r="20" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="2.5"/>
              {/* Hair */}
              <path d="M13 28 C13 16 20 10 32 10 C44 10 51 16 51 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              <path d="M13 28 C11 24 12 18 15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M51 28 C53 24 52 18 49 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              {/* Left lens */}
              <rect x="13" y="29" width="15" height="11" rx="5.5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2.2"/>
              {/* Right lens */}
              <rect x="36" y="29" width="15" height="11" rx="5.5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2.2"/>
              {/* Bridge */}
              <line x1="28" y1="34" x2="36" y2="34" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              {/* Left arm */}
              <line x1="13" y1="34" x2="8" y2="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              {/* Right arm */}
              <line x1="51" y1="34" x2="56" y2="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              {/* Eyes */}
              <circle cx="20.5" cy="34.5" r="2" fill="currentColor"/>
              <circle cx="43.5" cy="34.5" r="2" fill="currentColor"/>
              {/* Smile */}
              <path d="M25 46 Q32 52 39 46" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
            </svg>
            <span>Dani Bezerra</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/categoria/seo" className="text-sm text-text-muted hover:text-text transition">SEO</Link>
            <Link to="/categoria/conteudo" className="text-sm text-text-muted hover:text-text transition">Conteúdo</Link>
            <Link to="/categoria/trafego" className="text-sm text-text-muted hover:text-text transition">Tráfego</Link>
            <Link to="/categoria/social-media" className="text-sm text-text-muted hover:text-text transition">Social Media</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Buscar..."
                  autoFocus
                  className="pl-9 pr-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-48"
                />
              </div>
              <button type="button" onClick={() => setSearchOpen(false)} className="text-text-muted hover:text-text">
                <X className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="p-2 text-text-muted hover:text-text transition">
              <Search className="w-5 h-5" />
            </button>
          )}

          <a
            href="https://wa.me/5577992116008"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg transition"
            style={{ backgroundColor: '#14b8a6' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 fill-white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Fale comigo
          </a>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-text-muted">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 py-3 space-y-2">
          <Link to="/categoria/seo" className="block py-2 text-sm text-text-muted hover:text-text" onClick={() => setMenuOpen(false)}>SEO</Link>
          <Link to="/categoria/conteudo" className="block py-2 text-sm text-text-muted hover:text-text" onClick={() => setMenuOpen(false)}>Conteúdo</Link>
          <Link to="/categoria/trafego" className="block py-2 text-sm text-text-muted hover:text-text" onClick={() => setMenuOpen(false)}>Tráfego</Link>
          <Link to="/categoria/social-media" className="block py-2 text-sm text-text-muted hover:text-text" onClick={() => setMenuOpen(false)}>Social Media</Link>
        </div>
      )}
    </header>
  );
}
