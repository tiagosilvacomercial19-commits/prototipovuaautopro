import React, { useState, useEffect, createContext } from 'react';
import '@/App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginRegister from '@/pages/LoginRegister';
import VendedorDashboard from '@/pages/VendedorDashboard';
import CompradorDashboard from '@/pages/CompradorDashboard';
import PlansPage from '@/pages/PlansPage';
import TermosDeUso from '@/pages/legal/TermosDeUso';
import PoliticaPrivacidade from '@/pages/legal/PoliticaPrivacidade';
import PoliticaCadastro from '@/pages/legal/PoliticaCadastro';
import PoliticaAssinatura from '@/pages/legal/PoliticaAssinatura';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Auth Context
export const AuthContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(`${API}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (newToken, newUser) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, API }}>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={
              user ? <Navigate to="/dashboard" /> : <LoginRegister />
            } />
            
            <Route path="/dashboard" element={
              !user ? <Navigate to="/login" /> :
              user.role === 'vendedor' ? <VendedorDashboard /> :
              user.role === 'comprador' ? <CompradorDashboard /> :
              <div>Role desconhecido</div>
            } />
            
            <Route path="/planos" element={
              !user ? <Navigate to="/login" /> :
              user.role === 'comprador' ? <PlansPage /> :
              <Navigate to="/dashboard" />
            } />
            
            <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
