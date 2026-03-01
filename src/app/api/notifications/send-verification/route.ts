import { NextRequest, NextResponse } from 'next/server';
import EmailNotificationService from '@/app/services/EmailNotificationService';

export async function POST(request: NextRequest) {
  try {
    const { userEmail, verificationToken, userName } = await request.json();

    // Validar datos requeridos
    if (!userEmail || !verificationToken) {
      return NextResponse.json(
        { success: false, message: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    // Enviar correo de verificación
    const result = await EmailNotificationService.sendAccountVerification({
      userEmail,
      verificationToken,
      userName
    });

    if (result) {
      return NextResponse.json(
        { success: true, message: 'Correo de verificación enviado' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: 'Error enviando correo de verificación' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error en endpoint de verificación:', error);
    return NextResponse.json(
      { success: false, message: 'Error del servidor' },
      { status: 500 }
    );
  }
}
