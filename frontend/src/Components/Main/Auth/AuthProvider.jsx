import React, { createContext, useState, useEffect } from 'react';
import { getUserRole } from './auth.js';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) {
      const { isValid, role } = getUserRole(token);

      if (isValid) {
        setUser({ token, role });
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}