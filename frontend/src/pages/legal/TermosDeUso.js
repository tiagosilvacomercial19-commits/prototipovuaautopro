import Footer from '@/components/Footer';

const TermosDeUso = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Termos de Uso</h1>
              <p className="text-orange-100 text-sm mt-1">ViaAutoPro - Marketplace B2B de Veículos</p>
            </div>
            <a 
              href="/"
              className="bg-orange-700 hover:bg-orange-800 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Início
            </a>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Aceitação dos Termos</h2>
            <p className="text-gray-700 leading-relaxed">
              Ao acessar e utilizar a plataforma ViaAutoPro, você concorda em cumprir estes Termos de Uso. 
              Se você não concorda com qualquer parte destes termos, não deve utilizar nossos serviços.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Definições</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Plataforma:</strong> O website e aplicações ViaAutoPro</li>
              <li><strong>Lojista:</strong> Usuário comprador profissional com assinatura ativa</li>
              <li><strong>Vendedor:</strong> Usuário particular que cadastra veículos para venda</li>
              <li><strong>Moderador:</strong> Administrador responsável por aprovar conteúdo</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Cadastro de Usuários</h2>
            <div className="space-y-3 text-gray-700">
              <p><strong>3.1.</strong> Para utilizar a plataforma, você deve criar uma conta fornecendo informações verdadeiras, completas e atualizadas.</p>
              <p><strong>3.2.</strong> Você é responsável por manter a confidencialidade de sua senha e conta.</p>
              <p><strong>3.3.</strong> Lojistas devem assinar um plano mensal para acessar dados de contato dos vendedores.</p>
              <p><strong>3.4.</strong> Vendedores podem cadastrar veículos gratuitamente, sujeitos à aprovação do moderador.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Responsabilidades dos Usuários</h2>
            <div className="space-y-3 text-gray-700">
              <p><strong>4.1. Vendedores:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Garantir que todas as informações e fotos dos veículos são verdadeiras</li>
                <li>Não cadastrar veículos roubados, com documentação irregular ou problemas ocultos</li>
                <li>Responder prontamente às propostas dos lojistas</li>
                <li>Atualizar ou remover anúncios de veículos já vendidos</li>
              </ul>
              <p className="mt-3"><strong>4.2. Lojistas:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Utilizar dados de contato apenas para fins de negociação de veículos</li>
                <li>Não compartilhar, revender ou usar indevidamente informações dos vendedores</li>
                <li>Manter a assinatura em dia para continuar acessando o catálogo</li>
                <li>Conduzir negociações de forma ética e profissional</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Moderação de Conteúdo</h2>
            <p className="text-gray-700 leading-relaxed">
              A ViaAutoPro se reserva o direito de moderar, aprovar, rejeitar ou remover qualquer conteúdo que:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700 mt-2">
              <li>Contenha informações falsas ou enganosas</li>
              <li>Viole direitos de terceiros ou leis aplicáveis</li>
              <li>Seja inadequado, ofensivo ou inapropriado</li>
              <li>Represente atividade fraudulenta</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Limitação de Responsabilidade</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
              <p className="text-gray-800 font-medium">
                ⚠️ IMPORTANTE: A ViaAutoPro é apenas uma plataforma de conexão entre lojistas e vendedores.
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700 mt-2">
                <li>Não somos responsáveis por negociações, acordos ou transações entre usuários</li>
                <li>Não garantimos a veracidade das informações dos anúncios</li>
                <li>Não participamos das negociações financeiras</li>
                <li>Recomendamos vistoria presencial e verificação documental antes de qualquer compra</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Suspensão e Exclusão de Contas</h2>
            <p className="text-gray-700 leading-relaxed">
              Podemos suspender ou excluir contas que violem estes termos, incluindo casos de:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700 mt-2">
              <li>Fraude ou tentativa de fraude</li>
              <li>Cadastro de informações falsas</li>
              <li>Comportamento abusivo ou assédio</li>
              <li>Uso indevido da plataforma</li>
              <li>Inadimplência de assinatura por mais de 30 dias</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Alterações nos Termos</h2>
            <p className="text-gray-700 leading-relaxed">
              A ViaAutoPro pode atualizar estes Termos de Uso a qualquer momento. Usuários serão notificados 
              por e-mail sobre alterações significativas. O uso contínuo da plataforma após as alterações 
              constitui aceitação dos novos termos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Lei Aplicável</h2>
            <p className="text-gray-700 leading-relaxed">
              Estes termos são regidos pelas leis da República Federativa do Brasil. Qualquer disputa será 
              resolvida no foro da comarca de [Cidade], Estado de [Estado].
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Contato</h2>
            <p className="text-gray-700 leading-relaxed">
              Para dúvidas sobre estes Termos de Uso, entre em contato:
            </p>
            <ul className="mt-2 space-y-1 text-gray-700">
              <li>📧 E-mail: <a href="mailto:juridico@viaautopro.com" className="text-orange-600 hover:underline">juridico@viaautopro.com</a></li>
              <li>📞 Telefone: (11) 0000-0000</li>
            </ul>
          </section>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>Última atualização: Fevereiro de 2026</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a href="/" className="text-orange-600 hover:text-orange-700 font-medium">
            ← Voltar para o início
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermosDeUso;
