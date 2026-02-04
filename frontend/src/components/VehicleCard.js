const VehicleCard = ({ vehicle, hasSubscription, onNegotiate }) => {
  // Calcular margem percentual se houver FIPE e preço
  const calcularMargem = () => {
    if (vehicle.valor_fipe && vehicle.preco) {
      const margem = ((vehicle.valor_fipe - vehicle.preco) / vehicle.valor_fipe) * 100;
      return margem.toFixed(1);
    }
    return null;
  };

  const margem = calcularMargem();

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow" data-testid="vehicle-card">
      <img
        src={vehicle.imagem_base64}
        alt={vehicle.nome}
        className="w-full h-48 object-cover"
      />
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-3">{vehicle.nome}</h3>
        
        {/* Preço e FIPE */}
        <div className="mb-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Preço de Venda:</span>
            <span className="text-2xl font-bold text-orange-600">
              R$ {vehicle.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          
          {vehicle.valor_fipe && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Valor FIPE:</span>
              <span className="font-semibold text-gray-700">
                R$ {vehicle.valor_fipe.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}

          {margem && (
            <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-green-700 font-medium">💰 Margem p/ Revenda:</span>
                <span className="text-lg font-bold text-green-600">{margem}%</span>
              </div>
            </div>
          )}
        </div>
        
        {vehicle.descricao && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{vehicle.descricao}</p>
        )}

        <button
          onClick={() => onNegotiate(vehicle)}
          className={`w-full font-bold py-3 rounded-lg transition-colors ${
            hasSubscription
              ? 'bg-orange-600 hover:bg-orange-700 text-white'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
          data-testid="negotiate-button"
        >
          {hasSubscription ? '📞 Negociar Agora' : '🔒 Assine para Negociar'}
        </button>

        {!hasSubscription && (
          <p className="text-xs text-gray-500 text-center mt-2">
            Assinatura necessária para ver dados do vendedor
          </p>
        )}
      </div>
    </div>
  );
};

export default VehicleCard;
