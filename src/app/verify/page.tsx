'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const VerifyEmailContent = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const { verifyEmail } = useAuth();
  const hasAttempted = useRef(false);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Token de verificación no proporcionado');
      return;
    }

    if (hasAttempted.current) return;
    hasAttempted.current = true;

    const verifyEmailToken = async () => {
      try {
        const result = await verifyEmail(token);

        if (result) {
          setStatus('success');
          setMessage('¡Correo verificado exitosamente! Redirigiendo...');

          // Redirigir después de 2 segundos
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        } else {
          setStatus('error');
          setMessage('Token inválido o expirado. Vuelve a registrarte o intenta nuevamente.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Error verificando el correo. Intenta nuevamente.');
      }
    };

    verifyEmailToken();
  }, [searchParams, verifyEmail, router]);

  return (
    <div className="text-center">
      {status === 'loading' && (
        <div className="space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amaranth-pink-600 mx-auto"></div>
          <p className="text-gray-600">Verificando tu correo...</p>
        </div>
      )}

      {status === 'success' && (
        <div className="space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L4.5 17.5l7.5-7.5L19 8l-7.5 7.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-green-600 mb-2">
            ¡Correo Verificado!
          </h2>
          <p className="text-gray-600">
            {message}
          </p>
        </div>
      )}

      {status === 'error' && (
        <div className="space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h.013M12 19v2m0 4h.01M12 19v2M9 9h6m-6 0v6h6" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-red-600 mb-2">
            Error de Verificación
          </h2>
          <p className="text-gray-600">
            {message}
          </p>
          <div className="mt-6 space-y-3">
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-amaranth-pink-600 text-white py-3 px-4 rounded-lg hover:bg-amaranth-pink-700 transition-colors"
            >
              Volver al Inicio de Sesión
            </button>
            <button
              onClick={() => window.location.href = `mailto:lymchicstore@gmail.com?subject=Problema%20verificaci%C3%B3n%20correo&body=Token:%20${searchParams.get('token')}`}
              className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Contactar Soporte
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const VerifyEmail = () => {
  return (
    <div style={{ width: '100vw', minHeight: '100vh' }} className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="w-[95%] sm:w-full max-w-lg bg-white rounded-3xl shadow-xl p-8 md:p-10 font-grotesk">
        {/* Logo y Header */}
        <div className="text-center mb-10">
          <div className="text-4xl font-bold text-amaranth-pink-600 mb-3 tracking-tight">
            🎀 L&M CHIC Store
          </div>
          <p className="text-gray-500 font-medium">
            Verificación de Correo Electrónico
          </p>
        </div>

        {/* Contenido Principal con Suspense */}
        <div className="bg-pink-50/40 rounded-2xl p-6 md:p-8 border border-pink-100 shadow-sm min-h-[250px] flex flex-col justify-center">
          <Suspense fallback={
            <div className="text-center space-y-5">
              <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-amaranth-pink-600 mx-auto"></div>
              <p className="text-lg text-gray-600 font-medium animate-pulse">Cargando verificación...</p>
            </div>
          }>
            <VerifyEmailContent />
          </Suspense>
        </div>

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-gray-100 text-center text-sm md:text-base text-gray-500 space-y-1">
          <p>📍 Villa del Rosario, Venezuela</p>
          <p>📧 lymchicstore@gmail.com</p>
          <p className="pt-2 text-xs">© 2024 L&M CHIC Store. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
