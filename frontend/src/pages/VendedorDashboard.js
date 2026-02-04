import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/App';
import Header from '@/components/Header';

const VendedorDashboard = () => {
  const { user, token, API } = useContext(AuthContext);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    preco: '',
    valor_fipe: '',
    preco_minimo: '',
    margem_sugerida: '',
    descricao: '',
    imagem_base64: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyVehicles();
  }, []);

  const fetchMyVehicles = async () => {
    try {
      const response = await fetch(`${API}/veiculos/meus`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setVehicles(data);
      }
    } catch (error) {
      console.error('Erro ao buscar veículos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, imagem_base64: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const response = await fetch(`${API}/veiculos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          preco: parseFloat(formData.preco)
        })
      });

      if (response.ok) {
        setFormData({ nome: '', preco: '', valor_fipe: '', preco_minimo: '', margem_sugerida: '', descricao: '', imagem_base64: '' });
        setShowForm(false);
        fetchMyVehicles();
        alert('✅ Veículo cadastrado! Aguardando aprovação do moderador.');
      } else {
        const data = await response.json();
        setError(data.detail || 'Erro ao cadastrar veículo');
      }
    } catch (err) {
      setError('Erro de conexão');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pendente: 'bg-yellow-100 text-yellow-800',
      aprovado: 'bg-green-100 text-green-800',
      rejeitado: 'bg-red-100 text-red-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      pendente: '⏳ Aguardando Aprovação',
      aprovado: '✅ Aprovado e Visível',
      rejeitado: '❌ Rejeitado'
    };
    return texts[status] || status;
  };

  // Calcular estatísticas
  const stats = {
    total: vehicles.length,
    aprovados: vehicles.filter(v => v.status === 'aprovado').length,
    pendentes: vehicles.filter(v => v.status === 'pendente').length,
    rejeitados: vehicles.filter(v => v.status === 'rejeitado').length,
    valorTotal: vehicles.filter(v => v.status === 'aprovado').reduce((sum, v) => sum + v.preco, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2" data-testid="dashboard-title">Meus Veículos</h1>
          <p className="text-gray-600">Gerencie seus anúncios e acompanhe suas oportunidades de venda</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total de Veículos</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.total}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Aprovados</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.aprovados}</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pendentes</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.pendentes}</p>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Valor Total</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">
                  {stats.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
              <div className="bg-orange-100 rounded-full p-3">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 rounded-full p-3 flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-blue-900 mb-2">💡 Dicas para Vender Mais Rápido</h3>
              <ul className="text-blue-800 space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span><strong>Preço competitivo:</strong> Defina um preço justo deixando margem para negociação com lojistas (15-20% recomendado)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span><strong>Fotos de qualidade:</strong> Use imagens nítidas e bem iluminadas do veículo</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span><strong>Descrição completa:</strong> Inclua ano, quilometragem, estado de conservação e diferenciais</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span><strong>Responda rápido:</strong> Lojistas valorizam vendedores que respondem rapidamente no WhatsApp</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Add Vehicle Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Lista de Veículos</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg flex items-center gap-2"
            data-testid="add-vehicle-button"
          >
            {showForm ? (
              <>
                <span>✕</span>
                <span>Cancelar</span>
              </>
            ) : (
              <>
                <span>+</span>
                <span>Adicionar Veículo</span>
              </>
            )}
          </button>
        </div>

        {/* Add Vehicle Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8" data-testid="vehicle-form">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Cadastrar Novo Veículo</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Veículo *</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Fiat Cronos 2020 1.8 Automático"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  data-testid="vehicle-nome-input"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preço Anunciado (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.preco}
                    onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                    placeholder="69900.00"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    data-testid="vehicle-preco-input"
                  />
                  <p className="text-xs text-gray-500 mt-1">Preço que será mostrado aos lojistas</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preço Mínimo Aceito (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.preco_minimo}
                    onChange={(e) => setFormData({ ...formData, preco_minimo: e.target.value })}
                    placeholder="65000.00"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Valor mínimo para fechar negócio (opcional)</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Margem Sugerida (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.margem_sugerida}
                  onChange={(e) => setFormData({ ...formData, margem_sugerida: e.target.value })}
                  placeholder="15"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Percentual de margem que você deixa para o lojista revender (recomendado: 15-20%)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição Detalhada *</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descreva o estado do veículo, quilometragem, histórico de manutenção, acessórios, documentação, etc."
                  rows={4}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  data-testid="vehicle-descricao-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Foto do Veículo *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  required={!formData.imagem_base64}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  data-testid="vehicle-image-input"
                />
                {formData.imagem_base64 && (
                  <img src={formData.imagem_base64} alt="Pré-visualização" className="mt-2 h-32 rounded-lg" />
                )}
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 shadow-lg"
                data-testid="submit-vehicle-button"
              >
                {submitting ? 'Cadastrando...' : '✓ Cadastrar Veículo'}
              </button>
            </form>
          </div>
        )}

        {/* Vehicles List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-600">Carregando...</div>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🚗</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhum veículo cadastrado</h3>
            <p className="text-gray-600 mb-4">Comece adicionando seu primeiro veículo para alcançar lojistas de todo o Brasil!</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg"
            >
              Adicionar Primeiro Veículo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow" data-testid="vehicle-card">
                <img
                  src={vehicle.imagem_base64}
                  alt={vehicle.nome}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-800 flex-1">{vehicle.nome}</h3>
                  </div>
                  <div className="mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(vehicle.status)}`}>
                      {getStatusText(vehicle.status)}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-orange-600 mb-2">
                    R$ {vehicle.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  {vehicle.descricao && (
                    <p className="text-gray-600 text-sm line-clamp-2">{vehicle.descricao}</p>
                  )}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Cadastrado em {new Date(vehicle.created_at).toLocaleDateString('pt-BR')}
                    </p>
                    {vehicle.status === 'aprovado' && (
                      <p className="text-xs text-green-600 font-medium mt-1">
                        ✓ Visível para {stats.aprovados > 0 ? '200+' : '0'} lojistas
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendedorDashboard;
