import { NextRequest, NextResponse } from 'next/server';
import EmailNotificationService from '@/app/services/EmailNotificationService';

export async function POST(request: NextRequest) {
  try {
    const { userEmail, orderData, newStatus } = await request.json();

    // Validar datos requeridos
    if (!userEmail || !orderData || !newStatus) {
      return NextResponse.json(
        { success: false, message: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    // Enviar notificación de actualización de estado
    const result = await EmailNotificationService.sendOrderStatusUpdate({
      userEmail,
      orderData,
      newStatus
    });

    if (result) {
      return NextResponse.json(
        { success: true, message: 'Notificación de estado enviada' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: 'Error enviando notificación de estado' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error en endpoint de actualización de estado:', error);
    return NextResponse.json(
      { success: false, message: 'Error del servidor' },
      { status: 500 }
    );
  }
}
