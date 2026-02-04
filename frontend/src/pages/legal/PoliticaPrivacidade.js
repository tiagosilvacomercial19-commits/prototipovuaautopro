import Footer from '@/components/Footer';

const PoliticaPrivacidade = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Política de Privacidade</h1>
          <p className="text-orange-100 text-sm mt-1">Como tratamos seus dados pessoais</p>
        </div>
      </header>

      <main className="flex-grow max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Dados Coletados</h2>
            <p className="text-gray-700 mb-2">Coletamos os seguintes dados:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              <li>Nome completo, e-mail, telefone e WhatsApp</li>
              <li>Informações de veículos (fotos, descrições, preços)</li>
              <li>Histórico de negociações e mensagens</li>
              <li>Dados de pagamento (assinaturas)</li>
              <li>Logs de acesso e uso da plataforma</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Uso dos Dados</h2>
            <p className="text-gray-700 mb-2">Utilizamos seus dados para:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              <li>Criar e gerenciar sua conta</li>
              <li>Facilitar comunicação entre lojistas e vendedores</li>
              <li>Processar assinaturas e pagamentos</li>
              <li>Enviar notificações sobre propostas e atualizações</li>
              <li>Melhorar nossos serviços e experiência do usuário</li>
              <li>Cumprir obrigações legais e regulatórias</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Compartilhamento de Dados</h2>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <p className="text-gray-800 font-medium">🔒 Seus dados são protegidos</p>
              <p className="text-gray-700 mt-2">Não compartilhamos seus dados com terceiros, exceto:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mt-2">
                <li>Quando você autoriza (ex: contato entre lojista e vendedor)</li>
                <li>Para processadores de pagamento (com criptografia)</li>
                <li>Por ordem judicial ou legal</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Segurança</h2>
            <p className="text-gray-700">Implementamos medidas de segurança para proteger seus dados:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mt-2">
              <li>Criptografia SSL/TLS em todas as comunicações</li>
              <li>Armazenamento seguro com acesso restrito</li>
              <li>Autenticação JWT para sessões</li>
              <li>Monitoramento constante de atividades suspeitas</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Seus Direitos (LGPD)</h2>
            <p className="text-gray-700 mb-2">Você tem direito de:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados incompletos ou incorretos</li>
              <li>Solicitar exclusão de seus dados</li>
              <li>Revogar consentimento</li>
              <li>Portabilidade de dados</li>
            </ul>
            <p className="text-gray-700 mt-3">Para exercer seus direitos, entre em contato: <a href="mailto:privacidade@viaautopro.com" className="text-orange-600 hover:underline">privacidade@viaautopro.com</a></p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Cookies</h2>
            <p className="text-gray-700">Utilizamos cookies para melhorar sua experiência. Você pode desativá-los nas configurações do navegador, mas isso pode afetar funcionalidades.</p>
          </section>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>Última atualização: Fevereiro de 2026</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a href="/" className="text-orange-600 hover:text-orange-700 font-medium">← Voltar para o início</a>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PoliticaPrivacidade;
