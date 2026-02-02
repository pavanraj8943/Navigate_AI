import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.success) {
        setUser(data.data);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (err) {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (res.ok) {
      // Cookie is set automatically by server
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true };
    } else {
      return { success: false, error: data.message };
    }
  };

  const register = async (name, email, password) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();

    if (res.ok) {
      // Cookie is set automatically by server
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true };
    } else {
      return { success: false, error: data.message };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout');
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, isAuthenticated, setIsAuthenticated, login, register, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};