import { Link } from 'react-router-dom';
import { Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-1 font-bold text-lg text-gray-800">
            <svg viewBox="0 0 64 64" className="w-9 h-9 text-primary" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="34" r="20" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="2.5"/>
              <path d="M13 28 C13 16 20 10 32 10 C44 10 51 16 51 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              <path d="M13 28 C11 24 12 18 15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M51 28 C53 24 52 18 49 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <rect x="13" y="29" width="15" height="11" rx="5.5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2.2"/>
              <rect x="36" y="29" width="15" height="11" rx="5.5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2.2"/>
              <line x1="28" y1="34" x2="36" y2="34" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="13" y1="34" x2="8" y2="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="51" y1="34" x2="56" y2="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="20.5" cy="34.5" r="2" fill="currentColor"/>
              <circle cx="43.5" cy="34.5" r="2" fill="currentColor"/>
              <path d="M25 46 Q32 52 39 46" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
            </svg>
            <span>Dani Bezerra</span>
          </div>

          <nav className="flex items-center gap-6 text-sm text-text-muted">
            <Link to="/sobre" className="hover:text-text transition">Sobre</Link>
            <Link to="/contato" className="hover:text-text transition">Contato</Link>
            <Link to="/privacidade" className="hover:text-text transition">Privacidade</Link>
            <Link to="/termos" className="hover:text-text transition">Termos</Link>
          </nav>

          <div className="flex items-center gap-3">
            <a href="https://www.instagram.com/bezerradaniels/" target="_blank" rel="noopener noreferrer" className="p-2 text-text-muted hover:text-primary transition"><Instagram className="w-4 h-4" /></a>
            <a href="https://br.linkedin.com/in/bezerradaniels" target="_blank" rel="noopener noreferrer" className="p-2 text-text-muted hover:text-primary transition"><Linkedin className="w-4 h-4" /></a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center text-xs text-text-muted">
          © {new Date().getFullYear()} Dani Bezerra. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
