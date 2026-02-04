import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/App';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import VehicleCard from '@/components/VehicleCard';
import NegotiateModal from '@/components/NegotiateModal';
import Footer from '@/components/Footer';

const CompradorDashboard = () => {
  const { user, token, API } = useContext(AuthContext);
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showNegotiateModal, setShowNegotiateModal] = useState(false);
  const [subscriptionRequired, setSubscriptionRequired] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchVehicles(), fetchSubscription()]);
    setLoading(false);
  };

  const fetchVehicles = async () => {
    try {
      const response = await fetch(`${API}/veiculos`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setVehicles(data.vehicles || []);
        setSubscriptionRequired(data.subscription_required || false);
      }
    } catch (error) {
      console.error('Erro ao buscar veículos:', error);
    }
  };

  const fetchSubscription = async () => {
    try {
      const response = await fetch(`${API}/assinatura/minha`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
      }
    } catch (error) {
      console.error('Erro ao buscar assinatura:', error);
    }
  };

  const handleNegotiate = async (vehicle) => {
    if (!subscription?.tem_assinatura) {
      navigate('/planos');
      return;
    }

    try {
      const response = await fetch(`${API}/veiculos/${vehicle.id}/detalhes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const detailedVehicle = await response.json();
        setSelectedVehicle(detailedVehicle);
        setShowNegotiateModal(true);
      } else if (response.status === 403) {
        navigate('/planos');
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes:', error);
    }
  };

  const getSubscriptionBanner = () => {
    if (!subscription) return null;

    if (subscription.tem_assinatura) {
      const vencimento = new Date(subscription.data_vencimento);
      const diasRestantes = Math.ceil((vencimento - new Date()) / (1000 * 60 * 60 * 24));

      return (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6" data-testid="subscription-banner">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-800 font-semibold">✓ Plano {subscription.plano_nome} Ativo - Lojista Profissional</p>
              <p className="text-green-600 text-sm">
                Acesso a até {subscription.limite_veiculos === 999999 ? 'TODOS' : subscription.limite_veiculos} veículos de particulares • 
                Vence em {diasRestantes} dias ({vencimento.toLocaleDateString('pt-BR')})
              </p>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6" data-testid="no-subscription-banner">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-800 font-semibold">⚠️ Assinatura Necessária para Lojistas</p>
              <p className="text-orange-600 text-sm">
                Você pode visualizar veículos e preços, mas precisa de uma assinatura ativa para acessar contatos dos vendedores e fechar negócios
              </p>
            </div>
            <button
              onClick={() => navigate('/planos')}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-bold transition-colors shadow-lg"
              data-testid="subscribe-button"
            >
              📋 Ver Planos e Assinar
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2" data-testid="catalogo-title">Catálogo de Veículos de Particulares</h1>
        <p className="text-gray-600 mb-6">Encontre veículos com margem de revenda para sua loja</p>

        {getSubscriptionBanner()}

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-600">Carregando catálogo...</div>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🚗</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhum veículo disponível</h3>
            <p className="text-gray-600">Novos veículos serão adicionados em breve!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                hasSubscription={subscription?.tem_assinatura}
                onNegotiate={handleNegotiate}
              />
            ))}
          </div>
        )}
      </div>

      {showNegotiateModal && selectedVehicle && (
        <NegotiateModal
          vehicle={selectedVehicle}
          onClose={() => {
            setShowNegotiateModal(false);
            setSelectedVehicle(null);
          }}
        />
      )}
    </div>
  );
};

export default CompradorDashboard;
