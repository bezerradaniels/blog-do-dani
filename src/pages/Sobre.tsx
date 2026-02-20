import { Link } from 'react-router-dom';
import { ArrowRight, Mail, MapPin, Calendar } from 'lucide-react';

export default function Sobre() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text mb-4">Sobre Dani Bezerra</h1>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Especialista em marketing digital com foco em SEO, conteúdo e estratégias de crescimento que geram resultados reais.
          </p>
        </div>

        {/* Bio Section */}
        <div className="bg-white rounded-xl p-8 border border-border mb-8">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold text-text mb-4">Minha Jornada</h2>
              <div className="space-y-4 text-text-muted leading-relaxed">
                <p>
                  Com mais de 8 anos de experiência em marketing digital, ajudo empresas e profissionais a alcançar 
                  seu potencial máximo online. Minha abordagem combina dados, criatividade e as melhores práticas 
                  do mercado para criar estratégias que realmente funcionam.
                </p>
                <p>
                  Especializado em SEO técnico e conteúdo, já ajudei dezenas de marcas a melhorar seu posicionamento 
                  nos buscadores, aumentar tráfego orgânico e converter visitantes em clientes. Acredito que marketing 
                  digital deve ser mensurável, escalável e, acima de tudo, focado em gerar valor real para o usuário.
                </p>
                <p>
                  Além do trabalho com clientes, dedico-me a compartilhar conhecimento através deste blog, cursos e 
                  consultorias, ajudando mais pessoas a dominarem as ferramentas e técnicas que transformam negócios 
                  digitais.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-primary/5 rounded-xl p-6 text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg viewBox="0 0 64 64" className="w-12 h-12 text-primary" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                </div>
                <h3 className="font-bold text-text mb-2">Dani Bezerra</h3>
                <p className="text-sm text-text-muted">Consultor de Marketing Digital</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-text-muted">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>contato@danibezerra.com</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-text-muted">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>São Paulo, Brasil</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-text-muted">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>Desde 2016 no mercado</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expertise */}
        <div className="bg-white rounded-xl p-8 border border-border mb-8">
          <h2 className="text-2xl font-bold text-text mb-6">Áreas de Atuação</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'SEO Otimizado', desc: 'Estratégias completas de SEO técnico, on-page e off-page para dominar os buscadores.' },
              { title: 'Marketing de Conteúdo', desc: 'Criação de conteúdo relevante que atrai, engaja e converte seu público-alvo.' },
              { title: 'Tráfego Pago', desc: 'Campanhas em Google Ads, Facebook Ads e outras plataformas com ROI garantido.' },
              { title: 'Análise de Dados', desc: 'Métricas e KPIs que realmente importam para tomar decisões baseadas em dados.' },
            ].map((item, i) => (
              <div key={i} className="border-l-4 border-primary pl-4">
                <h3 className="font-bold text-text mb-2">{item.title}</h3>
                <p className="text-sm text-text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary rounded-xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Vamos conversar sobre seu projeto?</h2>
          <p className="mb-6 opacity-90">
            Se você busca resultados reais em marketing digital, estou pronto para ajudar.
          </p>
          <Link 
            to="/contato" 
            className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Entre em Contato <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
