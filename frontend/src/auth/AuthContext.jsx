import { createContext, useContext, useEffect, useState } from 'react';
import * as api from '../api/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!api.getToken()) {
      setLoading(false);
      return;
    }
    api
      .fetchMe()
      .then(({ user }) => setUser(user))
      .catch(() => {
        api.setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const { token, user } = await api.login({ email, password });
    api.setToken(token);
    setUser(user);
  }

  async function signup(name, email, password) {
    const { token, user } = await api.signup({ name, email, password });
    api.setToken(token);
    setUser(user);
  }

  function logout() {
    api.setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
