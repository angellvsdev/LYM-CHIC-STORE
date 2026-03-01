import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Product } from '@/lib/utils/validation/schemas';
import { XMarkIcon, ServerIcon, ShoppingBagIcon, PencilIcon } from '@heroicons/react/24/outline';
import { ShoppingCartIcon } from '@heroicons/react/16/solid';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import Notification from '@/app/components/common/Notification';
import ProductWhatsAppButton from '@/app/components/checkout/ProductWhatsAppButton';
import ProductGallery from '@/app/components/common/ProductGallery';

interface ProductInfoProps {
  product: Product;
  onClose?: () => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product, onClose }) => {
  const { addToCart, isInCart } = useCart();
  const { user } = useAuth();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
  const [selectedImage, setSelectedImage] = useState<string>('');

  // Extraer imágenes del producto (soporta tanto array como imagen única)
  const productImages = useMemo(() => {
    if (product.images && Array.isArray(product.images)) {
      return product.images.filter(img => img && img.trim() !== '');
    } else if (product.image && product.image.trim() !== '') {
      return [product.image];
    }
    return [];
  }, [product.images, product.image]);

  // Establecer la primera imagen como seleccionada por defecto
  useEffect(() => {
    if (productImages.length > 0 && !selectedImage) {
      setSelectedImage(productImages[0]);
    }
  }, [productImages, selectedImage]);

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleEditProduct = () => {
    if (user?.role === 'admin') {
      // Redirigir al panel de administración con el producto específico
      window.location.href = `/admin?product=${product.id}`;
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      setNotificationMessage('Debes iniciar sesión para agregar productos al carrito');
      setNotificationType('error');
      setShowNotification(true);
      return;
    }
    
    if (user.role === 'admin') {
      setNotificationMessage('Los administradores no pueden agregar productos al carrito');
      setNotificationType('error');
      setShowNotification(true);
      return;
    }
    
    addToCart(product);
    setNotificationMessage('¡Producto agregado al carrito!');
    setNotificationType('success');
    setShowNotification(true);
  };

  const hideNotification = () => {
    setShowNotification(false);
  };

  const productInCart = isInCart(product.id);

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-gradient-to-b from-davys-gray-800 to-white p-4">
      <div className="relative bg-white shadow-md rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col lg:flex-row gap-6 p-4 md:p-8 animate__animated animate__flipInX animate__faster">
        {/* Botón de cerrar */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 md:top-4 md:right-4 text-white bg-pink-600 hover:bg-pink-700 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold shadow-lg z-10 cursor-pointer"
            aria-label="Cerrar"
          >
            <XMarkIcon></XMarkIcon>
          </button>
        )}
        {/* Imagen principal y galería */}
        <div className="flex flex-col gap-4 w-full lg:w-1/2">
          <div className="relative w-full h-64 md:h-98 rounded-lg overflow-hidden bg-white flex items-center justify-center">
            {selectedImage ? (
              <Image 
                src={selectedImage} 
                alt={product.name} 
                fill 
                className="object-cover" 
                priority
              />
            ) : (
              <p className="text-center text-davys-gray-200 text-md flex items-center">
                <ServerIcon className="h-6 inline mx-3"/> 
                No hay imagenes disponibles o el servidor respondió incorrectamente.
              </p>
            )}
          </div>
          {/* Galería de imágenes */}
          {productImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {productImages.map((imageUrl, index) => (
                <button
                  key={index}
                  onClick={() => handleImageSelect(imageUrl)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    selectedImage === imageUrl
                      ? 'border-pink-500 scale-110'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  title={`Imagen ${index + 1}`}
                >
                  <Image
                    src={imageUrl}
                    alt={`${product.name} - Miniatura ${index + 1}`}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Información del producto */}
        <div className="flex flex-col w-full lg:w-1/2 gap-4">
          <span className="text-pink-500 font-bold text-xs uppercase tracking-widest">Nuevo</span>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-davys-gray-100 mb-2">{product.name}</h2>
          <span className="text-2xl md:text-3xl font-extrabold text-davys-gray-200 mb-2">${product.price}</span>
          {/* Descripción */}
          <div className="mb-4">
            <h3 className="text-base md:text-lg font-semibold text-davys-gray-100 mb-1 uppercase">Sobre este producto</h3>
            <p className="text-sm whitespace-pre-line leading-relaxed text-davys-gray-200">{product.description}</p>
          </div>
          {/* Información de envío (mock) */}
          <div className="bg-orange-400 rounded-lg p-3 md:p-4 flex flex-col gap-2">
            <h4 className="text-sm md:text-base font-semibold text-davys-gray-100">Información de Envío</h4>
            <div className="flex flex-col md:flex-wrap md:flex-row gap-2 md:gap-4 text-xs md:text-sm text-davys-gray-200">
              <p>Todos los productos se entregan mediante Pick-up una vez se notifica que este mismo esté listo para el retiro. En caso de requerir envíos a domicilio, puede contactarse con nosotros para solicitar el envío del mismo.</p>
            </div>
          </div>
          {/* Botón de acción */}
          {user?.role === 'admin' ? (
            <button 
              onClick={handleEditProduct}
              className="mt-1 px-4 md:px-6 py-3 rounded-lg transition-colors font-bold text-base md:text-lg shadow-lg flex items-center justify-center cursor-pointer bg-blue-600 text-white hover:bg-blue-700"
            >
              <PencilIcon className="h-6 inline mx-3" />
              Editar Producto
            </button>
          ) : (
            <>
              <ProductWhatsAppButton 
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  description: product.description,
                  image: product.image
                }}
                customerInfo={user ? {
                  name: user.name,
                  email: user.email,
                  phone: user.phone_number || undefined
                } : undefined}
              />
              <button 
                onClick={handleAddToCart}
                disabled={productInCart}
                className={`mt-1 px-4 md:px-6 py-3 rounded-lg transition-colors font-bold text-base md:text-lg shadow-lg flex items-center justify-center cursor-pointer ${
                  productInCart 
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                    : user
                      ? 'bg-pink-600 text-white hover:bg-pink-700'
                      : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
                }`}
              >
                <ShoppingCartIcon className="h-6 inline mx-3" />
                {productInCart ? 'Ya está en el carrito' : user ? 'Agregar al Carrito' : 'Registrate ó Inicia sesión para agregar'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Notificación mejorada */}
      <Notification
        show={showNotification}
        message={notificationMessage}
        type={notificationType}
        duration={3000}
        onHide={hideNotification}
      />
    </div>
  );
};

export default ProductInfo;