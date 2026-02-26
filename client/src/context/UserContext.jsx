import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [loading, setLoading] = useState(!localStorage.getItem('isAuthenticated'));

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const rawApiUrl = import.meta.env.VITE_API_URL || 'https://navigate-ai-backend.onrender.com/api';
      const API_URL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`;
      const res = await fetch(`${API_URL}/auth/me`, {
        credentials: 'include'
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setUser(data.data);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(data.data));
          localStorage.setItem('isAuthenticated', 'true');
        } else {
          // Should rarely happen if res.ok is true but success is false
          setIsAuthenticated(false);
          setUser(null);
          localStorage.removeItem('user');
          localStorage.removeItem('isAuthenticated');
        }
      } else if (res.status === 401 || res.status === 403) {
        // Explicit auth failure - clear session
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
      } else {
        // server error or other non-auth error (500, etc)
        // Keep local state as is to prevent logout on temporary server issues
        console.error('Server error during auth check:', res.status);
      }
    } catch (err) {
      console.error('Check auth error:', err);
      // Network error - do NOT clear session
      // User stays logged in locally until next successful check or explicit 401
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (tokenId) => {
    try {
      const rawApiUrl = import.meta.env.VITE_API_URL || 'https://navigate-ai-backend.onrender.com/api';
      const API_URL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`;
      const res = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tokenId }),
        credentials: 'include'
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('isAuthenticated', 'true');
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Google login failed' };
      }
    } catch (err) {
      console.error('Google login fetch error:', err);
      return { success: false, error: 'Network error or server unavailable' };
    }
  };

  const login = async (email, password) => {
    try {
      const rawApiUrl = import.meta.env.VITE_API_URL || 'https://navigate-ai-backend.onrender.com/api';
      const API_URL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`;
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('isAuthenticated', 'true');
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Login failed' };
      }
    } catch (err) {
      console.error('Login fetch error:', err);
      return { success: false, error: 'Network error or server unavailable' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const rawApiUrl = import.meta.env.VITE_API_URL || 'https://navigate-ai-backend.onrender.com/api';
      const API_URL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`;
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password }),
        credentials: 'include'
      });

      const data = await res.json();

      if (res.ok) {
        // Do NOT log in automatically.
        // Redirect logic will be handled by the component.
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.message || 'Registration failed' };
      }
    } catch (err) {
      console.error('Register fetch error:', err);
      return { success: false, error: 'Network error or server unavailable' };
    }
  };

  const logout = async () => {
    try {
      const rawApiUrl = import.meta.env.VITE_API_URL || 'https://navigate-ai-backend.onrender.com/api';
      const API_URL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`;
      await fetch(`${API_URL}/auth/logout`, {
        method: 'GET',
        credentials: 'include'
      });
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, isAuthenticated, setIsAuthenticated, login, register, logout, loading, googleLogin }}>
      {children}
    </UserContext.Provider>
  );
};
