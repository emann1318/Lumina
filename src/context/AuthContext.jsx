import { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState({ connected: false, uri_configured: false });

  const checkStatus = async () => {
    try {
      const { data } = await journalAPI.getStatus();
      setDbStatus(data);
      return data.connected;
    } catch (err) {
      setDbStatus({ connected: false, uri_configured: false });
      return false;
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
    checkStatus();
    
    // Periodically check DB status
    const interval = setInterval(checkStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const login = async (email, password) => {
    // Demo login for testing purposes
    if (email === 'demo@example.com' && password === 'demo123') {
      const demoUser = { id: 'demo-id', name: 'Demo User', email: 'demo@example.com', isDemo: true };
      localStorage.setItem('user', JSON.stringify(demoUser));
      localStorage.setItem('token', 'demo-token');
      setUser(demoUser);
      return demoUser;
    }

    const response = await authAPI.login({ email, password });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    return user;
  };

  const signup = async (name, email, password) => {
    const response = await authAPI.signup({ name, email, password });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, dbStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
