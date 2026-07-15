import { createContext, useContext, useState } from 'react';
import API from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('skillswap_user');
    return stored ? JSON.parse(stored) : null;
  });

  const persist = (data) => {
    localStorage.setItem('skillswap_user', JSON.stringify(data));
    setUser(data);
  };

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    persist(data);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await API.post('/auth/register', { name, email, password });
    persist(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('skillswap_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
