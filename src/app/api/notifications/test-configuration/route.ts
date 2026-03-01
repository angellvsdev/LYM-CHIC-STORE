import { NextRequest, NextResponse } from 'next/server';
import EmailNotificationService from '@/app/services/EmailNotificationService';

export async function POST(request: NextRequest) {
  try {
    // Test de configuración del servicio de correos
    const result = await EmailNotificationService.testConfiguration();

    if (result) {
      return NextResponse.json(
        { success: true, message: 'Servicio de correos configurado correctamente' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: 'Error en configuración del servicio de correos' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error en test de configuración:', error);
    return NextResponse.json(
      { success: false, message: 'Error del servidor' },
      { status: 500 }
    );
  }
}
