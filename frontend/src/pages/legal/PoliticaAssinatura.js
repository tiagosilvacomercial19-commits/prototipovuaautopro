import Footer from '@/components/Footer';

const PoliticaAssinatura = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6"><div className="flex items-center justify-between"><div>
          <h1 className="text-3xl font-bold">Política de Assinatura e Pagamento</h1>
        </div>
      </header>
      <main className="flex-grow max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Planos Disponíveis</h2>
            <div className="space-y-3">
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="font-bold">💎 Básico - R$ 379,90/mês</p>
                <p className="text-sm text-gray-600">Acesso a até 20 veículos</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <p className="font-bold">🏆 Premium - R$ 699,90/mês</p>
                <p className="text-sm text-gray-600">Acesso a até 40 veículos</p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4">
                <p className="font-bold">👑 VIP - R$ 1.099,00/mês</p>
                <p className="text-sm text-gray-600">Acesso ilimitado + Negociador presencial</p>
              </div>
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Pagamento</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              <li>Formas aceitas: PIX e Mercado Pago</li>
              <li>Cobrança mensal automática</li>
              <li>Primeiro mês cobrado no ato da assinatura</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Cancelamento e Reembolso</h2>
            <p className="text-gray-700">Você pode cancelar a qualquer momento. Regras:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mt-2">
              <li>Cancelamento até 7 dias: reembolso integral</li>
              <li>Após 7 dias: sem reembolso, mas acesso até o fim do período pago</li>
              <li>Renovação automática pode ser desativada a qualquer momento</li>
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
export default PoliticaAssinatura;
