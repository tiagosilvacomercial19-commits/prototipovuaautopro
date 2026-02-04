import { useContext } from 'react';
import { AuthContext } from '@/App';

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold" data-testid="header-logo">ViaAutoPro</h1>
            <p className="text-orange-100 text-sm">Marketplace B2B de Veículos</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold" data-testid="user-name">{user?.nome}</p>
              <p className="text-orange-100 text-sm">
                {user?.role === 'vendedor' ? '🚙 Vendedor Particular' : '💼 Lojista'}
              </p>
            </div>
            <button
              onClick={logout}
              className="bg-white text-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-orange-50 transition-colors"
              data-testid="logout-button"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
