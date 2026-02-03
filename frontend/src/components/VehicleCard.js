const VehicleCard = ({ vehicle, hasSubscription, onNegotiate }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow" data-testid="vehicle-card">
      <img
        src={vehicle.imagem_base64}
        alt={vehicle.nome}
        className="w-full h-48 object-cover"
      />
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{vehicle.nome}</h3>
        <p className="text-3xl font-bold text-orange-600 mb-3">
          R$ {vehicle.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
        
        {vehicle.descricao && (
          <p className="text-gray-600 text-sm mb-4">{vehicle.descricao}</p>
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
