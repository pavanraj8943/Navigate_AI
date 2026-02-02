// Custom hook for authentication
import { useState } from 'react';

export const useAuth = () => {
  // TODO: Implement auth hook logic
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated
  };
};