import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';

// Configuración del servidor
const config = {
  emailUser: process.env.EMAIL_USER || 'lymchicstore@gmail.com',
  emailPass: process.env.EMAIL_PASS || '',
  fromEmail: `"L&M CHIC Store" <${process.env.EMAIL_USER || 'lymchicstore@gmail.com'}>`,
  frontendUrl: process.env.FRONTEND_URL || 'https://lymchicstore.vercel.app',
  businessEmail: process.env.BUSINESS_EMAIL || 'lymchicstore@gmail.com'
};

const transporter = config.emailPass ? nodemailer.createTransport({
  service: 'gmail',
  auth: { user: config.emailUser, pass: config.emailPass }
}) : null;

// Emulador de Resend con Nodemailer
const resend = transporter ? {
  emails: {
    send: async (options: any) => {
      return transporter.sendMail({
        from: options.from || config.fromEmail,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html: options.html
      });
    }
  }
} : null;

const statusInfo = {
  'pending': { emoji: '⏳', message: 'Orden recibida', color: '#fef3c7', textColor: '#92400e', nextStep: 'Estamos confirmando tu pedido' },
  'processing': { emoji: '🔄', message: 'En preparación', color: '#dbeafe', textColor: '#1e40af', nextStep: 'Tu orden está siendo preparada con cuidado' },
  'shipped': { emoji: '🚚', message: 'En camino', color: '#dcfce7', textColor: '#166534', nextStep: 'Tu pedido ha sido enviado y está en camino' },
  'delivered': { emoji: '✨', message: 'Entregada', color: '#f0fdf4', textColor: '#166534', nextStep: '¡Disfruta de tu compra! Gracias por confiar en nosotros' },
  'cancelled': { emoji: '❌', message: 'Cancelada', color: '#fef2f2', textColor: '#991b1b', nextStep: 'Contacta con nosotros para más información' }
};

const normalizeStatus = (statusName: string): keyof typeof statusInfo => {
  const normalized = statusName.trim().toLowerCase();
  const map: Record<string, keyof typeof statusInfo> = {
    'pendiente': 'pending',
    'en proceso': 'processing',
    'enviado': 'shipped',
    'entregado': 'delivered',
    'cancelado': 'cancelled'
  };
  return map[normalized] || 'pending';
};

/**
 * Módulo de servicio para enviar notificaciones de estado por correo directamente desde el backend.
 */
export class OrderStatusNotifier {
  /**
   * Envía una notificación por correo electrónico cuando el estado de una orden cambia.
   * @param orderId El ID de la orden en la base de datos
   * @param previousStatusId El ID del estado anterior (opcional) para evitar notificar si es idéntico
   */
  static async notifyStatusChange(orderId: number, previousStatusId?: number) {
    try {
      // 1. Obtener la orden completa
      const order = await prisma.order.findUnique({
        where: { order_id: orderId },
        include: {
          user: true,
          orderStatus: true,
        }
      });

      // Validar existencia
      if (!order || !order.user || !order.user.email_address) {
        console.warn(`❌ [OrderStatusNotifier] No se encontró la orden ${orderId} o falta información de usuario.`);
        return false;
      }

      // Evitar notificación si el estado es el mismo que el anterior
      if (previousStatusId && order.order_status_id === previousStatusId) {
        return false;
      }

      if (!resend) {
        console.error('❌ [OrderStatusNotifier] RESEND_API_KEY no configurada. Saltando envío.');
        return false;
      }

      const orderStatusName = order.orderStatus.status_name;
      const statusCode = normalizeStatus(orderStatusName);
      const currentStatus = statusInfo[statusCode];

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Actualización de Pedido - L&M CHIC Store</title>
          <style>
            body { font-family: 'Grotesk', sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #fdf4f7 0%, #f8bbd9 100%); }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 30px 0; }
            .logo { font-size: 28px; font-weight: bold; color: #be185d; margin-bottom: 10px; }
            .content { background: white; border-radius: 16px; padding: 40px; box-shadow: 0 10px 30px rgba(190, 129, 93, 0.1); }
            .title { color: #374151; font-size: 24px; margin-bottom: 20px; text-align: center; }
            .text { color: #6b7280; line-height: 1.6; margin-bottom: 20px; text-align: center; }
            .status-box { background: ${currentStatus.color}; color: ${currentStatus.textColor}; border-radius: 16px; padding: 30px; margin: 20px 0; text-align: center; }
            .status-emoji { font-size: 48px; margin-bottom: 15px; display: block; }
            .status-title { font-size: 20px; font-weight: bold; margin-bottom: 10px; }
            .order-number { font-size: 16px; margin-bottom: 20px; }
            .timeline { margin: 30px 0; }
            .timeline-item { display: flex; align-items: center; margin-bottom: 15px; }
            .timeline-dot { width: 12px; height: 12px; border-radius: 50%; background: #be185d; margin-right: 15px; }
            .timeline-text { color: #374151; }
            .footer { text-align: center; padding: 30px 0; color: #9ca3af; font-size: 14px; }
            .button { display: inline-block; background: linear-gradient(135deg, #be185d 0%, #ec4899 100%); color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; margin: 20px auto; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🎀 L&M CHIC Store</div>
            </div>
            <div class="content">
              <div class="status-box">
                <div class="status-emoji">${currentStatus.emoji}</div>
                <div class="status-title">${currentStatus.message}</div>
                <div class="order-number">📋 Pedido: ${order.order_number}</div>
                <p>${currentStatus.nextStep}</p>
              </div>
              
              <div class="timeline">
                <div class="timeline-item">
                  <div class="timeline-dot"></div>
                  <div class="timeline-text">✅ Pedido recibido</div>
                </div>
                ${statusCode !== 'pending' ? `
                  <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-text">✅ Pedido confirmado</div>
                  </div>
                ` : ''}
                ${statusCode === 'processing' || statusCode === 'shipped' || statusCode === 'delivered' ? `
                  <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-text">✅ En preparación</div>
                  </div>
                ` : ''}
                ${statusCode === 'shipped' || statusCode === 'delivered' ? `
                  <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-text">✅ Enviado</div>
                  </div>
                ` : ''}
                ${statusCode === 'delivered' ? `
                  <div class="timeline-item">
                    <div class="timeline-dot" style="background: #10b981;"></div>
                    <div class="timeline-text">✅ Entregado</div>
                  </div>
                ` : ''}
              </div>

              <p class="text">
                Para más detalles sobre tu pedido, puedes visitar tu perfil o contactarnos directamente.
              </p>
              
              <a href="${config.frontendUrl}/profile" class="button" target="_blank">
                Ver mi Pedido
              </a>
            </div>
            <div class="footer">
              <p>📍 Villa del Rosario, Venezuela<br>
              📧 ${config.businessEmail}<br>
              🌐 ${config.frontendUrl}</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const result = await resend.emails.send({
        from: config.fromEmail,
        to: [order.user.email_address],
        subject: `${currentStatus.emoji} Actualización Pedido ${order.order_number} - L&M CHIC Store`,
        html: htmlContent,
      });

      console.log(`✅ [OrderStatusNotifier] Email enviado para el pedido ${order.order_number}: `, result);
      return true;
    } catch (error) {
      console.error(`❌ [OrderStatusNotifier] Error al notificar actualización de pedido ${orderId}:`, error);
      return false;
    }
  }
}
