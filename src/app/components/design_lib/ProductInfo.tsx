import React from 'react';
import Image from 'next/image';
import { Product } from '@/lib/utils/validation/schemas';
import { XMarkIcon, ServerIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { ShoppingCartIcon } from '@heroicons/react/16/solid';

interface ProductInfoProps {
  product: Product;
  onClose?: () => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product, onClose }) => {
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
          <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden bg-white flex items-center justify-center">
            {
                product.image ? <Image src={product.image} alt={product.name} fill className="object-cover" priority/>
                     : <p className="text-center text-davys-gray-200 text-md flex items-center"><ServerIcon className="h-6 inline mx-3"/> No hay imagenes disponibles o el servidor respondió incorrectamente.</p>
            }
            
          </div>
          {/* Galería de imágenes (si hay más en el futuro) */}
          {/* <div className="flex gap-2">
            <div className="w-16 h-16 bg-gray-200 rounded"></div>
            ...
          </div> */}
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
          <button className="mt-1 px-4 md:px-6 py-3 bg-green-400 text-white rounded-lg hover:bg-green-500 transition-colors font-bold text-base md:text-lg shadow-lg flex items-center justify-center cursor-pointer">
            <ShoppingBagIcon className="h-6 inline mx-3" />Realizar Pedido
          </button>
          <button className="mt-1 px-4 md:px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-bold text-base md:text-lg shadow-lg flex items-center justify-center cursor-pointer">
            <ShoppingCartIcon className="h-6 inline mx-3" />Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo; 