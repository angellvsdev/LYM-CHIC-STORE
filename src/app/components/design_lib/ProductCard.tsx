import React from 'react';
import Image from 'next/image';
import { Product } from '@/app/api/products/product';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <div className="flex flex-col bg-white rounded-lg shadow-md w-full max-w-[320px] h-[450px] border border-gray-200">
            <div className="relative w-full h-[200px]">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 320px) 100vw"
                    className="object-cover rounded-t-lg"
                    priority
                />
                <button className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors">
                    
                </button>
            </div>
            <div className="flex flex-col flex-grow p-4 space-y-3">
                <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{product.name}</h3>
                <div className="flex flex-wrap gap-2">
                    {product.size && (
                        <span className="px-2 py-1 text-sm rounded bg-gray-100 text-gray-700">{product.size}</span>
                    )}
                    {product.color && (
                        <span className="px-2 py-1 text-sm rounded bg-gray-100 text-gray-700">{product.color}</span>
                    )}
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 flex-grow">{product.description}</p>
                <div className="flex justify-between items-center pt-2">
                    <span className="text-xl font-bold text-gray-900">${product.price}</span>
                    <button className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
                        Agregar al Carrito
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard; 