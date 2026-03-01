'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const RegistrationPending = () => {
  const [email, setEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Obtener email del usuario temporal
    const tempUserStr = localStorage.getItem('tempUser');
    if (tempUserStr) {
      const tempUser = JSON.parse(tempUserStr);
      setEmail(tempUser.email);
    } else {
      // Si no hay datos temporales, redirigir al registro
      router.push('/register');
    }
  }, [router]);

  const handleResendEmail = async () => {
    const tempUserStr = localStorage.getItem('tempUser');
    if (tempUserStr) {
      const tempUser = JSON.parse(tempUserStr);
      
      try {
        // Importar el servicio de correo
        const { default: EmailNotificationService } = await import('@/app/services/EmailNotificationServiceClient');
        
        const success = await EmailNotificationService.sendAccountVerification({
          userEmail: tempUser.email,
          verificationToken: tempUser.verificationToken,
          userName: tempUser.name
        });

        if (success) {
          alert('Correo de verificación reenviado. Revisa tu bandeja de entrada.');
        } else {
          alert('Error reenviando el correo. Intenta nuevamente.');
        }
      } catch (error) {
        console.error('Error reenviando correo:', error);
        alert('Error reenviando el correo. Intenta nuevamente.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          {/* Icono de correo enviado */}
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Revisa tu correo!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Hemos enviado un correo de verificación a:
          </p>
          
          <div className="bg-gray-50 rounded-lg p-3 mb-6">
            <p className="font-semibold text-gray-900">{email}</p>
          </div>

          <div className="space-y-4 text-sm text-gray-600 mb-8">
            <p className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Abre tu correo electrónico
            </p>
            <p className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Busca el correo de "L&M CHIC Store"
            </p>
            <p className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Haz clic en el enlace de verificación
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleResendEmail}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-200"
            >
              Reenviar correo
            </button>
            
            <button
              onClick={() => router.push('/register')}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200"
            >
              Cancelar registro
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-6">
            ¿No recibiste el correo? Revisa tu carpeta de spam o correo no deseado.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPending;
