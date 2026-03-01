import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Configuración del servidor
const config = {
  apiKey: process.env.RESEND_API_KEY || '',
  fromEmail: process.env.RESEND_FROM_EMAIL || 'noreply@lymchicstore.onrender.com',
  frontendUrl: process.env.FRONTEND_URL || 'https://lymchicstore.onrender.com',
  businessEmail: process.env.BUSINESS_EMAIL || 'lymchicstore@gmail.com'
};

// Inicializar Resend solo en el servidor
const resend = config.apiKey ? new Resend(config.apiKey) : null;

export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json();

    if (!resend) {
      return NextResponse.json(
        { success: false, message: 'RESEND_API_KEY no configurada en el servidor' },
        { status: 500 }
      );
    }

    let result;

    switch (type) {
      case 'verification':
        result = await sendVerificationEmail(data);
        break;
      case 'confirmation':
        result = await sendConfirmationEmail(data);
        break;
      case 'order_created':
        result = await sendOrderCreatedEmail(data);
        break;
      case 'order_status':
        result = await sendOrderStatusEmail(data);
        break;
      case 'test':
        result = await sendTestEmail();
        break;
      default:
        return NextResponse.json(
          { success: false, message: 'Tipo de email no válido' },
          { status: 400 }
        );
    }

    return NextResponse.json(
      { success: true, message: 'Email enviado correctamente', result },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error en servicio de correos:', error);
    return NextResponse.json(
      { success: false, message: 'Error del servidor' },
      { status: 500 }
    );
  }
}

async function sendVerificationEmail(data: any) {
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

  return await resend!.emails.send({
    from: config.fromEmail,
    to: [data.userEmail],
    subject: '🎀 Verifica tu cuenta - L&M CHIC Store',
    html: htmlContent,
  });
}

async function sendConfirmationEmail(data: any) {
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

  return await resend!.emails.send({
    from: config.fromEmail,
    to: [data.userEmail],
    subject: '🎉 ¡Bienvenido a L&M CHIC Store! Tu cuenta está verificada',
    html: htmlContent,
  });
}

async function sendOrderCreatedEmail(data: any) {
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
        .status { text-align: center; padding: 15px; border-radius: 12px; margin: 20px 0; background: #fef3c7; color: #92400e; }
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
            ¡Buenas noticias! Hemos recibido tu pedido y estamos procesándolo con mucho cuidado.
          </p>
          <div class="order-details">
            <div class="order-number">📋 Pedido: ${data.orderData.orderNumber}</div>
            <div class="total">💰 Total: $${data.orderData.total.toFixed(2)}</div>
            <div class="status">⏳ Estado: ${data.orderData.status}</div>
          </div>
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

  return await resend!.emails.send({
    from: config.fromEmail,
    to: [data.userEmail],
    subject: `🛍️ Pedido ${data.orderData.orderNumber} - L&M CHIC Store`,
    html: htmlContent,
  });
}

async function sendOrderStatusEmail(data: any) {
  const statusInfo = {
    'pending': { emoji: '⏳', message: 'Orden recibida', color: '#fef3c7', textColor: '#92400e' },
    'processing': { emoji: '🔄', message: 'En preparación', color: '#dbeafe', textColor: '#1e40af' },
    'shipped': { emoji: '🚚', message: 'En camino', color: '#dcfce7', textColor: '#166534' },
    'delivered': { emoji: '✨', message: 'Entregada', color: '#f0fdf4', textColor: '#166534' },
    'cancelled': { emoji: '❌', message: 'Cancelada', color: '#fef2f2', textColor: '#991b1b' }
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
          </div>
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

  return await resend!.emails.send({
    from: config.fromEmail,
    to: [data.userEmail],
    subject: `${currentStatus.emoji} Actualización Pedido ${data.orderData.orderNumber} - L&M CHIC Store`,
    html: htmlContent,
  });
}

async function sendTestEmail() {
  return await resend!.emails.send({
    from: config.fromEmail,
    to: [config.businessEmail],
    subject: '🧪 Test de Configuración - L&M CHIC Store',
    html: '<p>Servicio de correos configurado correctamente para producción.</p>',
  });
}
