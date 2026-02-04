import { useContext } from 'react';
import { AuthContext } from '@/App';

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a href="/" className="hover:opacity-80 transition-opacity">
              <h1 className="text-3xl font-bold" data-testid="header-logo">ViaAutoPro</h1>
              <p className="text-orange-100 text-sm">Marketplace B2B de Veículos</p>
            </a>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="/"
              className="bg-orange-700 hover:bg-orange-800 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Início
            </a>
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
