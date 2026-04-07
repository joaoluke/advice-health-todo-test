import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../api/axios';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        setUser({ token });
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (username, password) => {
    const res = await api.post('/users/login/', { username, password });
    localStorage.setItem('access_token', res.data.access);
    localStorage.setItem('refresh_token', res.data.refresh);
    setUser({ token: res.data.access });
    navigate('/');
  };

  const register = async (username, email, password) => {
    await api.post('/users/register/', { username, email, password });
    await login(username, password);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
