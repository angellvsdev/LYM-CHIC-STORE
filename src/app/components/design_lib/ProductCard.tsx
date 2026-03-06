import React from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Product } from '@/lib/utils/validation/schemas';
import 'animate.css';
import { useModal } from '@/app/contexts/ModalContext';
import { getBlurDataURL } from '@/lib/utils/imageUtils';

const ProductInfo = dynamic(() => import('./ProductInfo'), {
    loading: () => <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div></div>,
    ssr: false,
});

interface ProductCardProps {
    product: Product & { stock?: number };
}

const ProductCard: React.FC<ProductCardProps> = React.memo(({ product }) => {
    const [showInfo, setShowInfo] = React.useState(false);
    const { setModalOpen } = useModal();

    // Extraer imágenes del producto (soporta tanto array como imagen única)
    const productImages = React.useMemo(() => {
        if (product.images && Array.isArray(product.images)) {
            return product.images.filter(img => img && img.trim() !== '');
        } else if (product.image && product.image.trim() !== '') {
            return [product.image];
        }
        return [];
    }, [product.images, product.image]);

    // Validar que el stock sea un número entero
    const stock = typeof product.stock === 'number' ? Math.max(0, Math.floor(product.stock)) : 0;
    const isLowStock = stock <= 5 && stock > 0;

    return (
        <>
            <div className="flex flex-col bg-davys-gray-100 rounded-lg shadow-lg w-full max-w-[320px] h-[450px] border shadow-amaranth-pink-500 animate__animated animate__flipInY animate__faster relative">
                {/* Etiqueta de stock bajo con animación */}
                {isLowStock && (
                    <div className="absolute top-2 left-2 z-10 animate__animated animate__pulse animate__infinite">
                        <span className="px-2 py-1 text-xs font-bold bg-red-500 text-white rounded-full shadow-lg">
                            ¡Últimas {stock} unidades!
                        </span>
                    </div>
                )}

                <div className="relative w-full h-[200px]">
                    {productImages.length > 0 ? (
                        <Image
                            src={productImages[0]} // Solo la primera imagen
                            alt={product.name}
                            fill
                            sizes="(max-width: 320px) 100vw"
                            className="object-cover rounded-t-lg"
                            placeholder="blur"
                            blurDataURL={getBlurDataURL(320, 200)}
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full bg-davys-gray-200 rounded-t-lg flex items-center justify-center">
                            <svg className="w-8 h-8 text-davys-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}
                    <button className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors hover:cursor-pointer z-10">
                        {/* Aquí podrías poner un ícono de favorito o similar */}
                    </button>
                </div>
                <div className="flex flex-col flex-grow p-4 space-y-3">
                    <h3 className="text-lg font-semibold text-white line-clamp-2">{product.name}</h3>
                    <div className="flex flex-wrap gap-2">
                        {product.size && product.size !== 'N/A' && (
                            <span className="px-2 py-1 text-sm rounded bg-lavender-blush-400 text-white">{product.size}</span>
                        )}
                        {product.color && (
                            <span className="px-2 py-1 text-sm rounded bg-lavender-blush-300 text-white">{product.color}</span>
                        )}
                    </div>
                    <p className="text-sm text-white line-clamp-2 flex-grow">{product.description}</p>
                    <div className="flex justify-between items-center pt-2">
                        <div className="flex flex-col">
                            <span className="text-xl font-extrabold text-davys-gray-800">${product.price}</span>
                            <span className={`text-sm ${stock <= 5 ? 'text-yellow-400 font-semibold' : 'text-davys-gray-600'}`}>
                                Stock: {stock} unidades
                            </span>
                        </div>
                        <button
                            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors hover:cursor-pointer"
                            onClick={() => {
                                setShowInfo(true);
                                setModalOpen(true);
                            }}
                        >
                            Ver Detalles
                        </button>
                    </div>
                </div>
            </div>
            {showInfo && (
                <ProductInfo
                    product={product}
                    onClose={() => {
                        setShowInfo(false);
                        setModalOpen(false);
                    }}
                />
            )}
        </>
    );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;