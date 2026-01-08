'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  phone_number?: string;
  age?: number;
  gender?: string;
  registration_date?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simular carga inicial de sesión desde localStorage o API
  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        // Intentar restaurar sesión real desde el servidor (iron-session)
        const response = await fetch('/api/auth/me', { method: 'GET' });
        if (response.ok) {
          const data = await response.json();
          const sessionUser = data?.user;
          if (sessionUser) {
            const restoredUser: User = {
              id: sessionUser.user_id?.toString() || '1',
              name: sessionUser.name || 'Usuario',
              email: sessionUser.email_address || '',
              role: sessionUser.role === 'admin' ? 'admin' : 'user',
              phone_number: sessionUser.phone_number,
              registration_date: sessionUser.registration_date,
            };
            setUser(restoredUser);
            localStorage.setItem('user', JSON.stringify(restoredUser));
            return;
          }
        }

        // Fallback: localStorage
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Aquí harías la llamada real a tu API de login
      // Por ahora, simulamos una autenticación básica
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
          password: password
        }),
      });

      if (response.ok) {
        const userData = await response.json();

        // Crear objeto de usuario basado en la respuesta
        const loggedUser: User = {
          id: userData.user_id?.toString() || '1',
          name: userData.name || 'Usuario',
          email: email,
          role: userData.role === 'admin' ? 'admin' : 'user',
          phone_number: userData.phone_number,
          age: userData.age,
          gender: userData.gender,
          registration_date: userData.registration_date,
        };

        setUser(loggedUser);
        localStorage.setItem('user', JSON.stringify(loggedUser));

        // Redirección automática basada en el rol
        if (loggedUser.role === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/profile';
        }

        return true;
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error en el inicio de sesión');
        return false;
      }
    } catch (error) {
      setError('Error de conexión. Verifica tu conexión a internet.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => undefined);
    setUser(null);
    localStorage.removeItem('user');
    setError(null);
    // Redirigir a la página de inicio después del logout
    window.location.href = '/';
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
