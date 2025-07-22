import React from 'react';
import Image from 'next/image';
import { Product } from '@/lib/utils/validation/schemas';
import 'animate.css';
import ProductInfo from './ProductInfo';


interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const [showInfo, setShowInfo] = React.useState(false);
    return (
        <>
            <div className="flex flex-col bg-davys-gray-100 rounded-lg shadow-lg w-full max-w-[320px] h-[450px] border shadow-amaranth-pink-500 animate__animated animate__flipInY animate__faster">
                <div className="relative w-full h-[200px]">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 320px) 100vw"
                        className="object-cover rounded-t-lg"
                        priority
                    />
                    <button className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors hover:cursor-pointer">
                        {/* Aquí podrías poner un ícono de favorito o similar */}
                    </button>
                </div>
                <div className="flex flex-col flex-grow p-4 space-y-3">
                    <h3 className="text-lg font-semibold text-white line-clamp-2">{product.name}</h3>
                    <div className="flex flex-wrap gap-2">
                        {product.size && (
                            <span className="px-2 py-1 text-sm rounded bg-lavender-blush-400 text-white">{product.size}</span>
                        )}
                        {product.color && (
                            <span className="px-2 py-1 text-sm rounded bg-lavender-blush-300 text-white">{product.color}</span>
                        )}
                    </div>
                    <p className="text-sm text-white line-clamp-2 flex-grow">{product.description}</p>
                    <div className="flex justify-between items-center pt-2">
                        <span className="text-xl font-extrabold text-davys-gray-800">${product.price}</span>
                        <button
                            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors hover:cursor-pointer"
                            onClick={() => setShowInfo(true)}
                        >
                            Ver Detalles
                        </button>
                    </div>
                </div>
            </div>
            {showInfo && (
                <ProductInfo product={product} onClose={() => setShowInfo(false)} />
            )}
        </>
    );
};

export default ProductCard; 