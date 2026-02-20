import { Shield, Eye, Lock, Database } from 'lucide-react';

export default function Privacidade() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text mb-4">Política de Privacidade</h1>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Sua privacidade é importante. Esta política explica como coletamos, usamos e protegemos suas informações.
          </p>
        </div>

        <div className="space-y-8">
          {/* Introduction */}
          <div className="bg-white rounded-xl p-8 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-text">Compromisso com a Privacidade</h2>
            </div>
            <div className="space-y-4 text-text-muted">
              <p>
                Na Dani Bezerra Marketing Digital, comprometemo-nos a proteger sua privacidade e garantir a segurança 
                de suas informações pessoais. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos 
                e compartilhamos dados quando você acessa nosso site e utiliza nossos serviços.
              </p>
              <p>
                Ao utilizar nossos serviços, você concorda com as práticas descritas nesta política. 
                Reservamo-nos o direito de atualizar esta política periodicamente para refletir mudanças em nossas práticas.
              </p>
            </div>
          </div>

          {/* Information Collection */}
          <div className="bg-white rounded-xl p-8 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-text">Informações que Coletamos</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-text mb-2">Dados Pessoais</h3>
                <ul className="list-disc list-inside text-text-muted space-y-1">
                  <li>Nome e informações de contato (e-mail, telefone)</li>
                  <li>Informações profissionais (cargo, empresa)</li>
                  <li>Dados fornecidos em formulários de contato</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-text mb-2">Dados de Uso</h3>
                <ul className="list-disc list-inside text-text-muted space-y-1">
                  <li>Endereço IP e dados de navegação</li>
                  <li>Páginas visitadas e tempo de permanência</li>
                  <li>Informações do dispositivo e navegador</li>
                  <li>Cookies e tecnologias similares</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Data Usage */}
          <div className="bg-white rounded-xl p-8 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-text">Como Usamos Seus Dados</h2>
            </div>
            <div className="space-y-4 text-text-muted">
              <p>Utilizamos suas informações para:</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Responder suas solicitações:</strong> Processar formulários de contato e fornecer informações solicitadas</li>
                <li><strong>Melhorar nossos serviços:</strong> Analisar padrões de uso para otimizar conteúdo e funcionalidades</li>
                <li><strong>Comunicação:</strong> Enviar respostas às suas dúvidas e informações relevantes sobre nossos serviços</li>
                <li><strong>Marketing:</strong> Com seu consentimento, enviar materiais promocionais e informativos</li>
                <li><strong>Segurança:</strong> Detectar e prevenir atividades fraudulentas ou abusivas</li>
                <li><strong>Cumprimento legal:</strong> Atender a obrigações legais e regulatórias</li>
              </ul>
            </div>
          </div>

          {/* Data Protection */}
          <div className="bg-white rounded-xl p-8 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-text">Proteção de Dados</h2>
            </div>
            <div className="space-y-4 text-text-muted">
              <p>
                Implementamos medidas técnicas e organizacionais robustas para proteger suas informações:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li> Criptografia de dados em trânsito e em repouso</li>
                <li> Controle de acesso restrito às informações</li>
                <li> Monitoramento constante de segurança</li>
                <li> Backup regular dos dados</li>
                <li> Treinamento da equipe em boas práticas de privacidade</li>
              </ul>
              <p>
                Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, 
                exceto quando necessário para fornecer nossos serviços ou quando exigido por lei.
              </p>
            </div>
          </div>

          {/* Rights */}
          <div className="bg-white rounded-xl p-8 border border-border">
            <h2 className="text-2xl font-bold text-text mb-4">Seus Direitos</h2>
            <div className="space-y-4 text-text-muted">
              <p>Você tem direito a:</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Acessar:</strong> Solicitar cópia das suas informações pessoais</li>
                <li><strong>Corrigir:</strong> Atualizar dados incorretos ou incompletos</li>
                <li><strong>Excluir:</strong> Solicitar remoção de dados pessoais (quando aplicável)</li>
                <li><strong>Restringir:</strong> Limitar o processamento de suas informações</li>
                <li><strong>Portabilidade:</strong> Transferir dados para outro fornecedor</li>
                <li><strong>Revogar consentimento:</strong> Retirar autorização para uso de dados</li>
              </ul>
              <p>
                Para exercer esses direitos, entre em contato através dos canais listados nesta página.
              </p>
            </div>
          </div>

          {/* Cookies */}
          <div className="bg-white rounded-xl p-8 border border-border">
            <h2 className="text-2xl font-bold text-text mb-4">Política de Cookies</h2>
            <div className="space-y-4 text-text-muted">
              <p>
                Utilizamos cookies para melhorar sua experiência em nosso site:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Cookies essenciais:</strong> Necessários para o funcionamento básico do site</li>
                <li><strong>Cookies de análise:</strong> Ajuda-nos a entender como você utiliza o site</li>
                <li><strong>Cookies de funcionalidade:</strong> Lembrar suas preferências</li>
              </ul>
              <p>
                Você pode gerenciar cookies através das configurações do seu navegador. 
                Desativar cookies pode afetar algumas funcionalidades do site.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-primary/5 rounded-xl p-8 border border-primary/20">
            <h2 className="text-2xl font-bold text-text mb-4">Dúvidas e Contato</h2>
            <div className="space-y-4 text-text-muted">
              <p>
                Se você tiver dúvidas sobre esta Política de Privacidade ou quiser exercer seus direitos, 
                entre em contato:
              </p>
              <ul className="space-y-2">
                <li><strong>E-mail:</strong> contato@danibezerra.com</li>
                <li><strong>Telefone:</strong> (77) 99211-6008</li>
                <li><strong>WhatsApp:</strong> (77) 99211-6008</li>
              </ul>
              <p className="text-sm">
                Esta política foi atualizada em {new Date().toLocaleDateString('pt-BR')} e está sujeita a alterações.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
