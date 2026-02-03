const NegotiateModal = ({ vehicle, onClose }) => {
  const openWhatsApp = () => {
    const message = encodeURIComponent(
      `Olá! Tenho interesse no veículo ${vehicle.nome} (R$ ${vehicle.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})`
    );
    window.open(`https://wa.me/${vehicle.vendedor_whatsapp}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" data-testid="negotiate-modal">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">Dados do Vendedor</h2>
              <p className="text-orange-100 text-sm">Entre em contato para negociar</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-orange-100 text-2xl leading-none"
              data-testid="close-modal-button"
            >
              ×
            </button>
          </div>
        </div>

        {/* Vehicle Info */}
        <div className="p-6">
          <div className="mb-6">
            <img
              src={vehicle.imagem_base64}
              alt={vehicle.nome}
              className="w-full h-64 object-cover rounded-xl"
            />
          </div>

          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{vehicle.nome}</h3>
            <p className="text-3xl font-bold text-orange-600 mb-2">
              R$ {vehicle.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            {vehicle.descricao && (
              <p className="text-gray-600">{vehicle.descricao}</p>
            )}
          </div>

          {/* Seller Contact */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h4 className="text-lg font-bold text-gray-800 mb-4">Informações de Contato</h4>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-2xl mr-3">👤</span>
                <div>
                  <p className="text-sm text-gray-600">Nome</p>
                  <p className="font-semibold text-gray-800" data-testid="vendedor-nome">{vehicle.vendedor_nome}</p>
                </div>
              </div>

              <div className="flex items-center">
                <span className="text-2xl mr-3">📞</span>
                <div>
                  <p className="text-sm text-gray-600">Telefone</p>
                  <p className="font-semibold text-gray-800" data-testid="vendedor-telefone">{vehicle.vendedor_telefone}</p>
                </div>
              </div>

              <div className="flex items-center">
                <span className="text-2xl mr-3">💬</span>
                <div>
                  <p className="text-sm text-gray-600">WhatsApp</p>
                  <p className="font-semibold text-gray-800" data-testid="vendedor-whatsapp">{vehicle.vendedor_whatsapp}</p>
                </div>
              </div>

              <div className="flex items-center">
                <span className="text-2xl mr-3">✉️</span>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-800" data-testid="vendedor-email">{vehicle.vendedor_email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={openWhatsApp}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              data-testid="whatsapp-button"
            >
              <span className="text-2xl">📱</span>
              Abrir WhatsApp
            </button>

            <a
              href={`tel:${vehicle.vendedor_telefone}`}
              className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors text-center"
              data-testid="call-button"
            >
              📞 Ligar Agora
            </a>

            <a
              href={`mailto:${vehicle.vendedor_email}`}
              className="block w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition-colors text-center"
              data-testid="email-button"
            >
              ✉️ Enviar Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NegotiateModal;
