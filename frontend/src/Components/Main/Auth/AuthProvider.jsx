import React, { createContext, useState, useEffect } from 'react';
import isTokenValid from './auth.js'
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // при старте читаем из localStorage (если токен остался)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        isTokenValid(token)
      setUser({ token });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}