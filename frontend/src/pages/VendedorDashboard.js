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
        setFormData({ nome: '', preco: '', descricao: '', imagem_base64: '' });
        setShowForm(false);
        fetchMyVehicles();
        alert('Veículo cadastrado! Aguardando aprovação do moderador.');
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800" data-testid="dashboard-title">Meus Veículos</h1>
            <p className="text-gray-600 mt-1">Gerencie seus anúncios de veículos</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            data-testid="add-vehicle-button"
          >
            {showForm ? '✕ Cancelar' : '+ Adicionar Veículo'}
          </button>
        </div>

        {/* Add Vehicle Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8" data-testid="vehicle-form">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Cadastrar Novo Veículo</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Veículo</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Fiat Cronos 2020"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  data-testid="vehicle-nome-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Detalhes do veículo..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  data-testid="vehicle-descricao-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imagem</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  required={!formData.imagem_base64}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  data-testid="vehicle-image-input"
                />
                {formData.imagem_base64 && (
                  <img src={formData.imagem_base64} alt="Preview" className="mt-2 h-32 rounded-lg" />
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
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
                data-testid="submit-vehicle-button"
              >
                {submitting ? 'Cadastrando...' : 'Cadastrar Veículo'}
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
            <p className="text-gray-600 mb-4">Comece adicionando seu primeiro veículo!</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg"
            >
              Adicionar Agora
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
                    <h3 className="text-lg font-bold text-gray-800">{vehicle.nome}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(vehicle.status)}`}>
                      {vehicle.status}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-orange-600 mb-2">
                    R$ {vehicle.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  {vehicle.descricao && (
                    <p className="text-gray-600 text-sm">{vehicle.descricao}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    Cadastrado em {new Date(vehicle.created_at).toLocaleDateString('pt-BR')}
                  </p>
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
