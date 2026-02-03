import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/App';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';

const PlansPage = () => {
  const { token, API } = useContext(AuthContext);
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch(`${API}/planos`);
      if (response.ok) {
        const data = await response.json();
        setPlans(data);
      }
    } catch (error) {
      console.error('Erro ao buscar planos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId) => {
    setSubscribing(planId);

    try {
      const response = await fetch(`${API}/assinatura/criar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ plano_id: planId })
      });

      if (response.ok) {
        alert('✅ Assinatura ativada com sucesso (mock)!');
        navigate('/dashboard');
      } else {
        const data = await response.json();
        alert('Erro: ' + (data.detail || 'Não foi possível processar'));
      }
    } catch (error) {
      alert('Erro de conexão');
    } finally {
      setSubscribing(null);
    }
  };

  const getPlanIcon = (nome) => {
    const icons = {
      'Básico': '💎',
      'Premium': '🏆',
      'VIP': '👑'
    };
    return icons[nome] || '📦';
  };

  const getPlanColor = (nome) => {
    const colors = {
      'Básico': 'from-blue-500 to-blue-600',
      'Premium': 'from-purple-500 to-purple-600',
      'VIP': 'from-yellow-500 to-yellow-600'
    };
    return colors[nome] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4" data-testid="plans-title">Planos para Lojistas Profissionais</h1>
          <p className="text-xl text-gray-600">Acesse contatos de vendedores particulares e compre veículos com margem de revenda</p>
          <p className="text-sm text-gray-500 mt-2">💼 Ideal para revendas, concessionárias e lojistas do setor automotivo</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-600">Carregando planos...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2"
                data-testid="plan-card"
              >
                <div className={`bg-gradient-to-r ${getPlanColor(plan.nome)} p-6 text-white text-center`}>
                  <div className="text-5xl mb-3">{getPlanIcon(plan.nome)}</div>
                  <h3 className="text-2xl font-bold">{plan.nome}</h3>
                </div>

                <div className="p-8">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-gray-800">
                      R$ {plan.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-gray-600 text-sm mt-1">por mês</div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center text-gray-700">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>
                        {plan.limite_veiculos === 999999 
                          ? 'Acesso ILIMITADO a veículos'
                          : `Até ${plan.limite_veiculos} veículos por mês`}
                      </span>
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Contato direto com vendedores (WhatsApp, telefone, email)</span>
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Preços com margem para revenda</span>
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Renovação mensal automática</span>
                    </li>
                    {plan.tem_negociador && (
                      <li className="flex items-center text-gray-700 font-semibold">
                        <span className="text-orange-500 mr-2">⭐</span>
                        <span>Negociador presencial exclusivo para fechar negócios!</span>
                      </li>
                    )}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={subscribing === plan.id}
                    className={`w-full bg-gradient-to-r ${getPlanColor(plan.nome)} text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50`}
                    data-testid={`subscribe-${plan.nome.toLowerCase()}-button`}
                  >
                    {subscribing === plan.id ? 'Processando...' : 'Assinar Agora'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
          <p className="text-blue-800 font-semibold mb-2">💳 Pagamento Mock</p>
          <p className="text-blue-600 text-sm">
            Este é um ambiente de demonstração. O pagamento é simulado e a assinatura será ativada instantaneamente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlansPage;
