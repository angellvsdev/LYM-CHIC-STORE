import { NextRequest, NextResponse } from 'next/server';
import EmailNotificationService from '@/app/services/EmailNotificationService';

export async function POST(request: NextRequest) {
  try {
    const { userEmail, orderData } = await request.json();

    // Validar datos requeridos
    if (!userEmail || !orderData) {
      return NextResponse.json(
        { success: false, message: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    // Enviar notificación de orden creada
    const result = await EmailNotificationService.sendOrderCreatedNotification({
      userEmail,
      orderData
    });

    if (result) {
      return NextResponse.json(
        { success: true, message: 'Notificación de orden enviada' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: 'Error enviando notificación de orden' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error en endpoint de notificación de orden:', error);
    return NextResponse.json(
      { success: false, message: 'Error del servidor' },
      { status: 500 }
    );
  }
}
