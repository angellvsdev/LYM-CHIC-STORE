export interface OrderData {
  orderNumber: string;
  userId: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  total: number;
  paymentMethod: 'cash' | 'mobile_payment';
  paymentDetails: {
    method: 'cash' | 'mobile_payment';
    bank?: string;
    phoneNumber?: string;
    reference?: string;
  };
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface ProductInquiryData {
  product: {
    id: string;
    name: string;
    price: number;
    description?: string;
    image?: string;
  };
  customerInfo: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

export class WhatsAppService {
  private static readonly BUSINESS_PHONE = '+584126589542'; // Reemplazar con el número real del negocio
  
  /**
   * Genera el link de WhatsApp con mensaje prellenado
   */
  static generateWhatsAppLink(orderData: OrderData): string {
    const message = this.generateOrderMessage(orderData);
    const encodedMessage = encodeURIComponent(message);
    
    // Usar wa.me para formato más corto y universal
    const cleanPhone = this.BUSINESS_PHONE.replace(/[^\d]/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  }

  /**
   * Genera el link de WhatsApp para consulta de producto individual
   */
  static generateProductInquiryLink(inquiryData: ProductInquiryData): string {
    const message = this.generateProductInquiryMessage(inquiryData);
    const encodedMessage = encodeURIComponent(message);
    
    // Usar wa.me para formato más corto y universal
    const cleanPhone = this.BUSINESS_PHONE.replace(/[^\d]/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  }
  
  /**
   * Genera el mensaje de WhatsApp para consulta de producto individual
   */
  static generateProductInquiryMessage(inquiryData: ProductInquiryData): string {
    const { product, customerInfo } = inquiryData;
    
    // Información del cliente (si está disponible)
    let customerInfoText = customerInfo.name 
      ? `\n\n👤 Mis datos:\n• Nombre: ${customerInfo.name}`
      : '';
    
    if (customerInfo.email) {
      customerInfoText += `\n• Email: ${customerInfo.email}`;
    }
    if (customerInfo.phone) {
      customerInfoText += `\n• Teléfono: ${customerInfo.phone}`;
    }

    const message = `🛍️ ¡Hola! Me gustaría realizar un pedido:

📦 Producto de interés:
• Nombre: ${product.name}
• Precio: $${product.price.toFixed(2)}
${product.description ? `• Descripción: ${product.description.substring(0, 150)}${product.description.length > 150 ? '...' : ''}` : ''}

❓ ¿Sigue disponible? Me gustaría recibir toda la información al respecto.${customerInfoText}

---
Consulta generada desde LYM ChicStore
${new Date().toLocaleDateString('es-VE')}`;

    return message;
  }

  /**
   * Abre WhatsApp con mensaje de consulta de producto
   */
  static openProductInquiry(inquiryData: ProductInquiryData): void {
    const whatsappLink = this.generateProductInquiryLink(inquiryData);
    
    // Abrir en una nueva pestaña para mejor experiencia
    const newWindow = window.open(whatsappLink, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
    
    // Si el popup es bloqueado, abrir en la misma pestaña
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      window.location.href = whatsappLink;
    }
  }

  /**
   * Obtiene solo el link de WhatsApp para consulta de producto (para uso manual)
   */
  static getProductInquiryLink(inquiryData: ProductInquiryData): string {
    return this.generateProductInquiryLink(inquiryData);
  }

  /**
   * Genera el mensaje de WhatsApp con los detalles del pedido
   */
  static generateOrderMessage(orderData: OrderData): string {
    const { orderNumber, items, total, paymentMethod, paymentDetails, customerInfo } = orderData;
    
    // Lista de productos formateada
    const productsList = items.map(item => {
      const itemTotal = (item.price * item.quantity).toFixed(2);
      return `• ${item.name} x${item.quantity} - $${itemTotal}`;
    }).join('\n');

    // Método de pago formateado
    const paymentMethodText = paymentMethod === 'cash' 
      ? 'Efectivo (al recibir)' 
      : `Pago Móvil - ${paymentDetails.bank || 'No especificado'}`;

    // Detalles adicionales para pago móvil
    const paymentDetailsText = paymentMethod === 'mobile_payment' 
      ? `\n\n💳 Datos Pago Móvil:\n• Banco: ${paymentDetails.bank || 'No especificado'}\n• Teléfono: ${paymentDetails.phoneNumber || 'No especificado'}\n• Referencia: ${paymentDetails.reference || 'Pendiente'}`
      : '';

    const message = `🛍️ ¡Hola! Quiero realizar un pedido:

📋 Datos del Pedido:
• Número: ${orderNumber}
• Cliente: ${customerInfo.name}
• Teléfono: ${customerInfo.phone}
• Email: ${customerInfo.email}

📦 Productos:
${productsList}

💰 Total: $${total.toFixed(2)}
💳 Método de Pago: ${paymentMethodText}${paymentDetailsText}

¿Podrían ayudarme a procesarlo? ¡Gracias! 🙏

---
Pedido generado desde LYM ChicStore
${new Date().toLocaleDateString('es-VE')}`;

    return message;
  }

  /**
   * Abre WhatsApp con el mensaje del pedido
   */
  static openWhatsApp(orderData: OrderData): void {
    const whatsappLink = this.generateWhatsAppLink(orderData);
    
    // Abrir en una nueva pestaña para mejor experiencia
    const newWindow = window.open(whatsappLink, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
    
    // Si el popup es bloqueado, abrir en la misma pestaña
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      window.location.href = whatsappLink;
    }
  }

  /**
   * Obtiene solo el link de WhatsApp (para uso manual)
   */
  static getWhatsAppLink(orderData: OrderData): string {
    return this.generateWhatsAppLink(orderData);
  }

  /**
   * Genera mensaje de confirmación de pedido
   */
  static generateConfirmationMessage(orderNumber: string, status: string): string {
    const statusMessages = {
      'confirmed': '✅ Tu pedido ha sido confirmado y está siendo procesado.',
      'preparing': '⏳ Tu pedido está siendo preparado.',
      'ready': '🎉 Tu pedido está listo para ser retirado.',
      'completed': '✨ ¡Gracias por tu compra! Tu pedido ha sido completado.',
      'cancelled': '❌ Tu pedido ha sido cancelado.'
    };

    const message = `${statusMessages[status as keyof typeof statusMessages] || 'Estado actualizado'}

📋 Pedido: ${orderNumber}
📅 Fecha: ${new Date().toLocaleDateString('es-VE')}

Para más detalles, consulta tu perfil en LYM ChicStore.

---
LYM ChicStore
${new Date().toLocaleDateString('es-VE')}`;

    return message;
  }

  /**
   * Envía notificación de cambio de estado (simulado - en producción sería una API real)
   */
  static async sendStatusNotification(customerPhone: string, orderNumber: string, status: string): Promise<boolean> {
    try {
      const message = this.generateConfirmationMessage(orderNumber, status);
      const encodedMessage = encodeURIComponent(message);
      
      // En producción, esto sería una llamada a la API de WhatsApp Business
      // Por ahora, solo registramos el intento
      console.log('Notificación WhatsApp enviada:', {
        to: customerPhone,
        orderNumber,
        status,
        message
      });

      return true;
    } catch (error) {
      console.error('Error enviando notificación WhatsApp:', error);
      return false;
    }
  }

  /**
   * Valida número de teléfono para WhatsApp
   */
  static validatePhoneNumber(phone: string): boolean {
    // Eliminar caracteres no numéricos excepto +
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    
    // Verificar formato internacional (ej: +584141234567)
    const phoneRegex = /^\+\d{10,15}$/;
    
    return phoneRegex.test(cleanPhone);
  }

  /**
   * Formatea número de teléfono para WhatsApp
   */
  static formatPhoneNumber(phone: string): string {
    let cleanPhone = phone.replace(/[^\d]/g, '');
    
    // Si no tiene código de país, asumir Venezuela (+58)
    if (!phone.startsWith('+')) {
      if (cleanPhone.startsWith('0414') || cleanPhone.startsWith('414')) {
        cleanPhone = cleanPhone.replace(/^0?/, '+58');
      } else if (cleanPhone.length === 10) {
        cleanPhone = '+58' + cleanPhone;
      } else {
        cleanPhone = '+58' + cleanPhone;
      }
    }
    
    return cleanPhone;
  }
}

export default WhatsAppService;
