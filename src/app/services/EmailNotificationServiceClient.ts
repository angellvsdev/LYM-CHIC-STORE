'use client';

// Interfaces para tipos de datos
export interface EmailVerificationData {
  userEmail: string;
  verificationToken: string;
  userName?: string;
}

export interface OrderNotificationData {
  userEmail: string;
  orderData: {
    orderNumber: string;
    customerName: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    total: number;
    status: string;
    paymentMethod: string;
  };
}

export interface OrderStatusUpdateData {
  userEmail: string;
  orderData: {
    orderNumber: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    customerName: string;
    items: Array<{
      name: string;
      quantity: number;
    }>;
  };
  newStatus: string;
}

export interface AccountConfirmationData {
  userEmail: string;
  userName: string;
}

export class EmailNotificationService {
  /**
   * Enviar correo de verificación de cuenta
   */
  static async sendAccountVerification(data: EmailVerificationData): Promise<boolean> {
    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'verification',
          data
        }),
      });

      const result = await response.json();
      console.log('Email de verificación enviado:', result);
      return result.success;
    } catch (error) {
      console.error('Error enviando email de verificación:', error);
      return false;
    }
  }

  /**
   * Enviar correo de confirmación de cuenta
   */
  static async sendAccountConfirmation(data: AccountConfirmationData): Promise<boolean> {
    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'confirmation',
          data
        }),
      });

      const result = await response.json();
      console.log('Email de confirmación enviado:', result);
      return result.success;
    } catch (error) {
      console.error('Error enviando email de confirmación:', error);
      return false;
    }
  }

  /**
   * Enviar notificación de nueva orden creada por admin
   */
  static async sendOrderCreatedNotification(data: OrderNotificationData): Promise<boolean> {
    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'order_created',
          data
        }),
      });

      const result = await response.json();
      console.log('Email de orden creado enviado:', result);
      return result.success;
    } catch (error) {
      console.error('Error enviando email de orden creada:', error);
      return false;
    }
  }

  /**
   * Enviar notificación de actualización de estado de orden
   */
  static async sendOrderStatusUpdate(data: OrderStatusUpdateData): Promise<boolean> {
    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'order_status',
          data
        }),
      });

      const result = await response.json();
      console.log('Email de actualización de estado enviado:', result);
      return result.success;
    } catch (error) {
      console.error('Error enviando email de actualización:', error);
      return false;
    }
  }

  /**
   * Verificar configuración del servicio
   */
  static async testConfiguration(): Promise<boolean> {
    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'test',
          data: {}
        }),
      });

      const result = await response.json();
      console.log('Test de configuración exitoso:', result);
      return result.success;
    } catch (error) {
      console.error('Error en configuración:', error);
      return false;
    }
  }

  /**
   * Enviar correo de verificación (método legacy para compatibilidad)
   */
  static async sendVerificationEmail(email: string, token: string, name?: string): Promise<boolean> {
    return await this.sendAccountVerification({
      userEmail: email,
      verificationToken: token,
      userName: name
    });
  }
}

export default EmailNotificationService;
