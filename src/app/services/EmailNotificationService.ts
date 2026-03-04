import nodemailer from 'nodemailer';

// Configuración dinámica para producción (Zero Cost con Gmail)
const config = {
  emailUser: process.env.EMAIL_USER || 'lymchicstore@gmail.com',
  emailPass: process.env.EMAIL_PASS || '',
  fromEmail: `"L&M CHIC Store" <${process.env.EMAIL_USER || 'lymchicstore@gmail.com'}>`,
  frontendUrl: process.env.FRONTEND_URL || 'https://lymchicstore.vercel.app',
  businessEmail: process.env.BUSINESS_EMAIL || 'lymchicstore@gmail.com'
};

if (!config.emailPass) {
  console.error('❌ ERROR: EMAIL_PASS (App Password) de Gmail no configurado en variables de entorno');
}

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
      if (!resend) {
        console.error('❌ ERROR: Servicio de correo no disponible - RESEND_API_KEY no configurada');
        return false;
      }

      const verificationUrl = `${config.frontendUrl}/verify?token=${data.verificationToken}`;

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verifica tu cuenta - L&M CHIC Store</title>
          <style>
            body { font-family: 'Grotesk', sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #fdf4f7 0%, #f8bbd9 100%); }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 30px 0; }
            .logo { font-size: 28px; font-weight: bold; color: #be185d; margin-bottom: 10px; }
            .content { background: white; border-radius: 16px; padding: 40px; box-shadow: 0 10px 30px rgba(190, 129, 93, 0.1); }
            .title { color: #374151; font-size: 24px; margin-bottom: 20px; text-align: center; }
            .text { color: #6b7280; line-height: 1.6; margin-bottom: 30px; text-align: center; }
            .button { display: inline-block; background: linear-gradient(135deg, #be185d 0%, #ec4899 100%); color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; margin: 20px auto; }
            .button:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(190, 129, 93, 0.3); }
            .footer { text-align: center; padding: 30px 0; color: #9ca3af; font-size: 14px; }
            .emoji { font-size: 20px; margin-bottom: 10px; display: block; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🎀 L&M CHIC Store</div>
            </div>
            <div class="content">
              <div class="emoji">✨</div>
              <h1 class="title">¡Bienvenido a L&M CHIC Store!</h1>
              <p class="text">
                Hola ${data.userName || 'Amante de los detalles elegantes'},<br><br>
                Gracias por registrarte en L&M CHIC Store. Para activar tu cuenta y comenzar a disfrutar de nuestros productos exclusivos, por favor verifica tu correo electrónico haciendo clic en el siguiente botón:
              </p>
              <a href="${verificationUrl}" class="button" target="_blank">
                Verificar mi Cuenta
              </a>
              <p class="text">
                <small>Este enlace expirará en 24 horas por razones de seguridad.</small><br>
                Si no creaste una cuenta, puedes ignorar este correo.
              </p>
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
        to: [data.userEmail],
        subject: '🎀 Verifica tu cuenta - L&M CHIC Store',
        html: htmlContent,
      });

      console.log('Email de verificación enviado:', result);
      return true;
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
      if (!resend) {
        console.error('❌ ERROR: Servicio de correo no disponible - RESEND_API_KEY no configurada');
        return false;
      }

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>¡Bienvenido! - L&M CHIC Store</title>
          <style>
            body { font-family: 'Grotesk', sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #fdf4f7 0%, #f8bbd9 100%); }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 30px 0; }
            .logo { font-size: 28px; font-weight: bold; color: #be185d; margin-bottom: 10px; }
            .content { background: white; border-radius: 16px; padding: 40px; box-shadow: 0 10px 30px rgba(190, 129, 93, 0.1); }
            .title { color: #374151; font-size: 24px; margin-bottom: 20px; text-align: center; }
            .text { color: #6b7280; line-height: 1.6; margin-bottom: 20px; text-align: center; }
            .feature-list { text-align: left; margin: 30px 0; }
            .feature-item { display: flex; align-items: center; margin-bottom: 15px; color: #374151; }
            .feature-icon { margin-right: 15px; font-size: 20px; }
            .button { display: inline-block; background: linear-gradient(135deg, #be185d 0%, #ec4899 100%); color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; margin: 20px auto; }
            .footer { text-align: center; padding: 30px 0; color: #9ca3af; font-size: 14px; }
            .emoji { font-size: 40px; margin-bottom: 20px; display: block; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🎀 L&M CHIC Store</div>
            </div>
            <div class="content">
              <div class="emoji">🎉</div>
              <h1 class="title">¡Tu cuenta está lista!</h1>
              <p class="text">
                ¡Felicidades <strong>${data.userName}</strong>!<br><br>
                Tu cuenta en L&M CHIC Store ha sido verificada exitosamente. Ya puedes comenzar a explorar nuestra colección exclusiva de productos elegantes y lujosos.
              </p>
              
              <div class="feature-list">
                <div class="feature-item">
                  <span class="feature-icon">🛍️</span>
                  <span>Explora nuestro catálogo de productos únicos</span>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">💎</span>
                  <span>Disfruta de calidad artesanal premium</span>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">🎁</span>
                  <span>Recibe ofertas exclusivas y promociones</span>
                </div>
              </div>
              
              <a href="${config.frontendUrl}" class="button" target="_blank">
                Comprar Ahora
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
        to: [data.userEmail],
        subject: '🎉 ¡Bienvenido a L&M CHIC Store! Tu cuenta está verificada',
        html: htmlContent,
      });

      console.log('Email de confirmación enviado:', result);
      return true;
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
      if (!resend) {
        console.error('❌ ERROR: Servicio de correo no disponible - RESEND_API_KEY no configurada');
        return false;
      }

      const statusEmoji = {
        'pending': '⏳',
        'processing': '🔄',
        'shipped': '🚚',
        'delivered': '✨',
        'cancelled': '❌'
      };

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Nuevo Pedido - L&M CHIC Store</title>
          <style>
            body { font-family: 'Grotesk', sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #fdf4f7 0%, #f8bbd9 100%); }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 30px 0; }
            .logo { font-size: 28px; font-weight: bold; color: #be185d; margin-bottom: 10px; }
            .content { background: white; border-radius: 16px; padding: 40px; box-shadow: 0 10px 30px rgba(190, 129, 93, 0.1); }
            .title { color: #374151; font-size: 24px; margin-bottom: 20px; text-align: center; }
            .text { color: #6b7280; line-height: 1.6; margin-bottom: 20px; }
            .order-details { background: #f9fafb; border-radius: 12px; padding: 20px; margin: 20px 0; }
            .order-number { font-size: 18px; font-weight: bold; color: #be185d; margin-bottom: 15px; }
            .product-list { margin: 20px 0; }
            .product-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
            .product-name { color: #374151; font-weight: 500; }
            .product-quantity { color: #6b7280; }
            .total { font-size: 20px; font-weight: bold; color: #be185d; text-align: center; margin: 20px 0; }
            .status { text-align: center; padding: 15px; border-radius: 12px; margin: 20px 0; }
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
              <h1 class="title">🛍️ ¡Nuevo Pedido Recibido!</h1>
              <p class="text">
                Hola <strong>${data.orderData.customerName}</strong>,<br><br>
                ¡Buenas noticias! Hemos recibido tu pedido y estamos procesándolo con mucho cuidado. Aquí están los detalles:
              </p>
              
              <div class="order-details">
                <div class="order-number">📋 Pedido: ${data.orderData.orderNumber}</div>
                
                <div class="product-list">
                  ${data.orderData.items.map(item => `
                    <div class="product-item">
                      <span class="product-name">${item.name}</span>
                      <span class="product-quantity">x${item.quantity} - $${item.price.toFixed(2)}</span>
                    </div>
                  `).join('')}
                </div>
                
                <div class="total">💰 Total: $${data.orderData.total.toFixed(2)}</div>
                <div class="status" style="background: #fef3c7; color: #92400e;">
                  ${statusEmoji[data.orderData.status as keyof typeof statusEmoji] || '⏳'} Estado: ${data.orderData.status}
                </div>
              </div>
              
              <p class="text">
                Te mantendremos informado sobre cada paso de tu pedido. Para cualquier consulta, no dudes en contactarnos.
              </p>
              
              <a href="${config.frontendUrl}/profile" class="button" target="_blank">
                Ver mi Perfil
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
        to: [data.userEmail],
        subject: `🛍️ Pedido ${data.orderData.orderNumber} - L&M CHIC Store`,
        html: htmlContent,
      });

      console.log('Email de orden creado enviado:', result);
      return true;
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
      if (!resend) {
        console.error('❌ ERROR: Servicio de correo no disponible - RESEND_API_KEY no configurada');
        return false;
      }

      const statusInfo = {
        'pending': { emoji: '⏳', message: 'Orden recibida', color: '#fef3c7', textColor: '#92400e', nextStep: 'Estamos confirmando tu pedido' },
        'processing': { emoji: '🔄', message: 'En preparación', color: '#dbeafe', textColor: '#1e40af', nextStep: 'Tu orden está siendo preparada con cuidado' },
        'shipped': { emoji: '🚚', message: 'En camino', color: '#dcfce7', textColor: '#166534', nextStep: 'Tu pedido ha sido enviado y está en camino' },
        'delivered': { emoji: '✨', message: 'Entregada', color: '#f0fdf4', textColor: '#166534', nextStep: '¡Disfruta de tu compra! Gracias por confiar en nosotros' },
        'cancelled': { emoji: '❌', message: 'Cancelada', color: '#fef2f2', textColor: '#991b1b', nextStep: 'Contacta con nosotros para más información' }
      };

      const currentStatus = statusInfo[data.newStatus as keyof typeof statusInfo];

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
                <div class="order-number">📋 Pedido: ${data.orderData.orderNumber}</div>
                <p>${currentStatus.nextStep}</p>
              </div>
              
              <div class="timeline">
                <div class="timeline-item">
                  <div class="timeline-dot"></div>
                  <div class="timeline-text">✅ Pedido recibido</div>
                </div>
                ${data.newStatus !== 'pending' ? `
                  <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-text">✅ Pedido confirmado</div>
                  </div>
                ` : ''}
                ${data.newStatus === 'processing' || data.newStatus === 'shipped' ? `
                  <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-text">✅ En preparación</div>
                  </div>
                ` : ''}
                ${data.newStatus === 'shipped' || data.newStatus === 'delivered' ? `
                  <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-text">✅ Enviado</div>
                  </div>
                ` : ''}
                ${data.newStatus === 'delivered' ? `
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
        to: [data.userEmail],
        subject: `${currentStatus.emoji} Actualización Pedido ${data.orderData.orderNumber} - L&M CHIC Store`,
        html: htmlContent,
      });

      console.log('Email de actualización de estado enviado:', result);
      return true;
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
      if (!resend) {
        console.error('❌ ERROR: Servicio de correo no disponible - RESEND_API_KEY no configurada');
        return false;
      }

      // Enviar correo de prueba
      const result = await resend.emails.send({
        from: config.fromEmail,
        to: [config.businessEmail],
        subject: '🧪 Test de Configuración - L&M CHIC Store',
        html: '<p>Servicio de correos configurado correctamente para producción.</p>',
      });

      console.log('Test de configuración exitoso:', result);
      return true;
    } catch (error) {
      console.error('Error en configuración:', error);
      return false;
    }
  }
}

export default EmailNotificationService;
