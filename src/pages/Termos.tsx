import { Link } from 'react-router-dom';
import { FileText, CheckCircle, AlertCircle, Scale } from 'lucide-react';

export default function Termos() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text mb-4">Termos de Uso</h1>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Termos e condições que regem o uso do site e serviços da Dani Bezerra Marketing Digital.
          </p>
        </div>

        <div className="space-y-8">
          {/* Introduction */}
          <div className="bg-white rounded-xl p-8 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-text">Termos de Serviço</h2>
            </div>
            <div className="space-y-4 text-text-muted">
              <p>
                Bem-vindo ao site Dani Bezerra Marketing Digital. Estes Termos de Uso regulam 
                seu acesso e utilização de nosso conteúdo, serviços e informações disponíveis neste site.
              </p>
              <p>
                Ao acessar e utilizar este site, você concorda integralmente com estes termos. 
                Se não concordar com qualquer parte destes termos, não utilize nossos serviços.
              </p>
              <p>
                Estes termos podem ser atualizados periodicamente. Recomendamos revisá-los regularmente 
                para estar ciente de quaisquer alterações.
              </p>
            </div>
          </div>

          {/* Services */}
          <div className="bg-white rounded-xl p-8 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-text">Nossos Serviços</h2>
            </div>
            <div className="space-y-4 text-text-muted">
              <p>
                A Dani Bezerra Marketing Digital oferece os seguintes serviços através deste site:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Conteúdo Educativo:</strong> Artigos, guias e materiais sobre marketing digital</li>
                <li><strong>Consultoria:</strong> Serviços de consultoria em SEO, marketing de conteúdo e estratégias digitais</li>
                <li><strong>Formulários de Contato:</strong> Canais para solicitação de informações e orçamentos</li>
                <li><strong>Newsletter:</strong> Conteúdo exclusivo enviado por e-mail (com consentimento prévio)</li>
              </ul>
              <p>
                Reservamo-nos o direito de modificar, suspender ou descontinuar qualquer serviço 
                a qualquer momento, sem aviso prévio.
              </p>
            </div>
          </div>

          {/* User Responsibilities */}
          <div className="bg-white rounded-xl p-8 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-text">Responsabilidades do Usuário</h2>
            </div>
            <div className="space-y-4 text-text-muted">
              <p>
                Ao utilizar nosso site, você concorda em:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Fornecer informações verdadeiras e atualizadas em formulários</li>
                <li>Respeitar os direitos de propriedade intelectual de nosso conteúdo</li>
                <li>Não utilizar o site para atividades ilegais ou fraudulentas</li>
                <li>Não tentar comprometer a segurança ou integridade do sistema</li>
                <li>Não enviar conteúdo ofensivo, inadequado ou que viole direitos de terceiros</li>
                <li>Respeitar outros usuários e profissionais da comunidade</li>
              </ul>
            </div>
          </div>

          {/* Intellectual Property */}
          <div className="bg-white rounded-xl p-8 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-text">Propriedade Intelectual</h2>
            </div>
            <div className="space-y-4 text-text-muted">
              <p>
                Todo o conteúdo deste site, incluindo textos, imagens, design, logos e código, 
                é protegido por direitos autorais e outras leis de propriedade intelectual.
              </p>
              <p>
                Você não pode:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Copiar, reproduzir ou distribuir nosso conteúdo sem autorização</li>
                <li>Utilizar nosso conteúdo para fins comerciais sem consentimento</li>
                <li>Modificar ou adaptar nosso material</li>
                <li>Remover avisos de direitos autorais ou marcas registradas</li>
              </ul>
              <p>
                O uso educacional e pessoal é permitido desde que mantenha os créditos e links originais.
              </p>
            </div>
          </div>

          {/* Limitation of Liability */}
          <div className="bg-white rounded-xl p-8 border border-border">
            <h2 className="text-2xl font-bold text-text mb-4">Limitação de Responsabilidade</h2>
            <div className="space-y-4 text-text-muted">
              <p>
                O site e seus serviços são fornecidos "como estão", sem garantias de qualquer tipo. 
                Não nos responsabilizamos por:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Interrupções no funcionamento do site</li>
                <li>Erros ou imprecisões no conteúdo</li>
                <li>Danos resultantes do uso de nossas informações</li>
                <li>Perdas de dados ou informações</li>
                <li>Conteúdo de terceiros ou links externos</li>
              </ul>
              <p>
                Nossa responsabilidade total, quando aplicável, limita-se ao valor pago pelos serviços contratados.
              </p>
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-white rounded-xl p-8 border border-border">
            <h2 className="text-2xl font-bold text-text mb-4">Privacidade e Dados</h2>
            <div className="space-y-4 text-text-muted">
              <p>
                Sua privacidade é importante para nós. O tratamento de dados pessoais segue 
                nossa <Link to="/privacidade" className="text-primary hover:underline">Política de Privacidade</Link>.
              </p>
              <p>
                Ao fornecer informações pessoais, você concorda com nossa política de privacidade 
                e autoriza o tratamento de dados conforme descrito.
              </p>
            </div>
          </div>

          {/* Termination */}
          <div className="bg-white rounded-xl p-8 border border-border">
            <h2 className="text-2xl font-bold text-text mb-4">Rescisão e Encerramento</h2>
            <div className="space-y-4 text-text-muted">
              <p>
                Reservamo-nos o direito de:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Suspender ou encerrar acesso de usuários que violem estes termos</li>
                <li>Remover conteúdo inadequado ou ilegal</li>
                <li>Descontinuar serviços a qualquer momento</li>
              </ul>
              <p>
                Você pode parar de utilizar nossos serviços a qualquer momento. 
                O encerramento não afeta direitos e obrigações anteriores.
              </p>
            </div>
          </div>

          {/* Changes */}
          <div className="bg-white rounded-xl p-8 border border-border">
            <h2 className="text-2xl font-bold text-text mb-4">Alterações nos Termos</h2>
            <div className="space-y-4 text-text-muted">
              <p>
                Podemos atualizar estes termos periodicamente para refletir mudanças em nossos serviços 
                ou requisitos legais. Alterações entram em vigor na data de publicação.
              </p>
              <p>
                Usuários serão notificados de mudanças significativas através do site ou e-mail. 
                O uso continuado após alterações constitui aceitação dos novos termos.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-primary/5 rounded-xl p-8 border border-primary/20">
            <h2 className="text-2xl font-bold text-text mb-4">Contato e Dúvidas</h2>
            <div className="space-y-4 text-text-muted">
              <p>
                Para dúvidas sobre estes Termos de Uso, entre em contato:
              </p>
              <ul className="space-y-2">
                <li><strong>E-mail:</strong> contato@danibezerra.com</li>
                <li><strong>Telefone:</strong> (77) 99211-6008</li>
                <li><strong>WhatsApp:</strong> (77) 99211-6008</li>
              </ul>
              <p className="text-sm">
                Estes termos foram atualizados em {new Date().toLocaleDateString('pt-BR')} 
                e regem o uso do site Dani Bezerra Marketing Digital.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
