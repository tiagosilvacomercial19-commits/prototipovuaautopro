import Footer from '@/components/Footer';

const PoliticaCadastro = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6"><div className="flex items-center justify-between"><div>
          <h1 className="text-3xl font-bold">Política de Cadastro de Veículos</h1></div><a href="/" className="bg-orange-700 hover:bg-orange-800 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>Início</a></div>
        </div>
      </header>
      <main className="flex-grow max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Responsabilidades do Vendedor</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Garantir que todas as fotos e informações são verdadeiras e atualizadas</li>
              <li>Não cadastrar veículos roubados, com restrições judiciais ou documentação irregular</li>
              <li>Informar claramente o estado de conservação e defeitos conhecidos</li>
              <li>Responder às propostas dos lojistas em até 48 horas</li>
              <li>Remover ou atualizar anúncios de veículos já vendidos</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Moderação</h2>
            <p className="text-gray-700">Todos os veículos passam por análise do moderador. A ViaAutoPro pode rejeitar ou remover anúncios que:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mt-2">
              <li>Contenham informações falsas</li>
              <li>Tenham fotos inadequadas ou de baixa qualidade</li>
              <li>Violem leis ou regulamentos</li>
            </ul>
          </section>
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>Última atualização: Fevereiro de 2026</p>
          </div>
        </div>
        <div className="mt-8 text-center">
          <a href="/" className="text-orange-600 hover:text-orange-700 font-medium">← Voltar</a>
        </div>
      </main>
      <Footer />
    </div>
  );
};
export default PoliticaCadastro;
