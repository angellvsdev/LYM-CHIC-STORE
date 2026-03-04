'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import VerificationModal from '@/app/components/auth/VerificationModal';

const RegistrationPending = () => {
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Obtener email del usuario temporal
    const tempUserStr = localStorage.getItem('tempUser');
    if (tempUserStr) {
      const tempUser = JSON.parse(tempUserStr);
      setEmail(tempUser.email);
    } else {
      // Si no hay datos temporales, redirigir al registro
      router.push('/sign-up');
    }
  }, [router]);

  const handleResendEmail = async () => {
    const tempUserStr = localStorage.getItem('tempUser');
    if (tempUserStr) {
      const tempUser = JSON.parse(tempUserStr);
      setIsResending(true);

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
      } finally {
        setIsResending(false);
      }
    }
  };

  const handleCancelRegistration = () => {
    localStorage.removeItem('tempUser');
    router.push('/sign-up');
  };

  return (
    <VerificationModal
      isOpen={true}
      email={email}
      onResend={handleResendEmail}
      onCancel={handleCancelRegistration}
      isResending={isResending}
    />
  );
};

export default RegistrationPending;
