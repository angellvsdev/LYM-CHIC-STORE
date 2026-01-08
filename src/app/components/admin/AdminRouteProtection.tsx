'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';

interface AdminRouteProtectionProps {
  children: React.ReactNode;
}

const AdminRouteProtection = ({ children }: AdminRouteProtectionProps) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Usuario no autenticado, redirigir al login
        router.push('/login');
      } else if (user.role !== 'admin') {
        // Usuario autenticado pero sin permisos de admin, redirigir al panel básico
        router.push('/profile');
      }
    }
  }, [user, isLoading, router]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amaranth-pink-300 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario o no es admin, no renderizar nada (redirección en proceso)
  if (!user || user.role !== 'admin') {
    return null;
  }

  // Usuario autenticado y con permisos de admin, renderizar contenido
  return <>{children}</>;
};

export default AdminRouteProtection;
