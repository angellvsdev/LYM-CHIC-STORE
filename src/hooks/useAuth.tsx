'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import EmailNotificationService from '@/app/services/EmailNotificationServiceClient';

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
  updateUser: (userData: Partial<User>) => void;
  isLoading: boolean;
  error: string | null;
  registerUser: (userData: {
    name: string;
    email: string;
    password: string;
    phone_number?: string;
    age?: number;
    gender?: string;
  }) => Promise<boolean>;
  sendVerificationEmail: (email: string, token: string, name?: string) => Promise<boolean>;
  verifyEmail: (token: string) => Promise<boolean>;
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
              age: sessionUser.age,
              gender: sessionUser.gender,
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

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      // También actualizar localStorage para persistencia
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const registerUser = async (userData: {
    name: string;
    email: string;
    password: string;
    phone_number?: string;
    age?: number;
    gender?: string;
  }): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Generar token encapsulando la data del usuario en base64 para evitar depender de localStorage
      const tokenPayload = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phone_number: userData.phone_number,
        age: userData.age,
        gender: userData.gender,
        ts: Date.now()
      };

      const verificationToken = btoa(encodeURIComponent(JSON.stringify(tokenPayload)));

      // Enviar correo de verificación
      const emailSent = await EmailNotificationService.sendAccountVerification({
        userEmail: userData.email,
        verificationToken,
        userName: userData.name
      });

      if (!emailSent) {
        setError('Error enviando correo de verificación');
        return false;
      }

      // Guardar datos temporales para reenvios (solo afecta la misma sesión de registro)
      const tempUserData = {
        ...userData,
        verificationToken,
        isVerified: false
      };

      localStorage.setItem('tempUser', JSON.stringify(tempUserData));

      // Redirigir a página de espera
      window.location.href = '/register/pending';

      return true;
    } catch (error) {
      setError('Error en el registro. Intenta nuevamente.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const sendVerificationEmail = async (email: string, token: string, name?: string): Promise<boolean> => {
    try {
      return await EmailNotificationService.sendAccountVerification({
        userEmail: email,
        verificationToken: token,
        userName: name
      });
    } catch (error) {
      console.error('Error enviando correo de verificación:', error);
      return false;
    }
  };

  const verifyEmail = async (token: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      let tempUser;

      // Intentar extraer la data directamente del Token Base64 (Nueva arquitectura Cross-browser a prueba de fallos)
      try {
        const decodedPayload = decodeURIComponent(atob(token));
        tempUser = JSON.parse(decodedPayload);

        // Comprobar que el token siga siend válido por 24 horas (opcional, solo medida extra de seguridad)
        if (tempUser.ts && (Date.now() - tempUser.ts > 24 * 60 * 60 * 1000)) {
          throw new Error('Token expirado');
        }
      } catch (e) {
        // Fallback para usuarios que verifiquen con el token antiguo de Math.random (Retrocompatibilidad)
        const tempUserStr = localStorage.getItem('tempUser');
        if (!tempUserStr) {
          setError('El enlace de verificación ha expirado o es inválido en este navegador. Reenvía el correo.');
          return false;
        }

        const fallbackUser = JSON.parse(tempUserStr);
        if (fallbackUser.verificationToken !== token) {
          setError('El token utilizado ha quedado obsoleto. Pide uno nuevo.');
          return false;
        }
        tempUser = fallbackUser;
      }

      // Enviar correo de confirmación
      await EmailNotificationService.sendAccountConfirmation({
        userEmail: tempUser.email,
        userName: tempUser.name
      });

      // Crear usuario en la base de datos a través de la API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: tempUser.name,
          email_address: tempUser.email,
          password: tempUser.password,
          phone_number: tempUser.phone_number,
          age: tempUser.age,
          gender: tempUser.gender,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Error creando usuario');
        return false;
      }

      const userData = await response.json();

      // Crear objeto de usuario para el contexto
      const verifiedUser: User = {
        id: userData.user_id.toString(),
        name: userData.name,
        email: userData.email_address,
        role: 'user',
        phone_number: userData.phone_number,
        age: userData.age,
        gender: userData.gender,
        registration_date: userData.registration_date
      };

      // Limpiar datos temporales
      localStorage.removeItem('tempUser');

      // Mostrar éxito y redirigir al login
      alert('¡Cuenta verificada exitosamente! Ahora puedes iniciar sesión.');
      window.location.href = '/login';

      return true;
    } catch (error) {
      setError('Error verificando correo. Intenta nuevamente.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    updateUser,
    isLoading,
    error,
    registerUser,
    sendVerificationEmail,
    verifyEmail
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
