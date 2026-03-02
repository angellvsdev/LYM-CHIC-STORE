'use client'
import React, { useState, useEffect } from "react";
import ProductCard from "./../../design_lib/ProductCard";
import Image from "next/image";
import { Category, Product } from "@/lib/utils/validation/schemas";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { getBlurDataURL } from "@/lib/utils/imageUtils";
import ProductSkeleton from "./../../design_lib/ProductSkeleton";
import { useModal } from "@/app/contexts/ModalContext";

const FeaturedProducts = () => {
    const { isAnyModalOpen, setModalOpen } = useModal();
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
    const [currentSlide, setCurrentSlide] = useState(0);

    const { data: categoriesData, isLoading: isLoadingCategories } = useSWR('/api/categories', fetcher, { revalidateOnFocus: false });
    const categories: Category[] = React.useMemo(() => categoriesData?.success ? categoriesData.data.data : [], [categoriesData]);

    const productUrl = selectedCategory ? `/api/products?category_id=${selectedCategory}&page=1&limit=10&sort=name&order=asc` : null;
    const { data: productsData, isLoading: isLoadingProducts } = useSWR(productUrl, fetcher, { keepPreviousData: true });
    const products: Product[] = React.useMemo(() => productsData?.data || [], [productsData]);

    useEffect(() => {
        // No iniciar el intervalo si hay un modal abierto o pocos productos
        if (isAnyModalOpen || products.length <= 4) return;

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % Math.ceil(products.length / 4));
        }, 5000);

        return () => clearInterval(timer);

    }, [products.length, isAnyModalOpen]);

    // Set selectedCategory to the first category when categories are loaded
    useEffect(() => {
        if (categories.length > 0 && !selectedCategory) {
            setSelectedCategory(categories[0].id);
        }
    }, [categories, selectedCategory]);
    return (
        <section className="w-full min-h-screen bg-gradient-to-bl from-white to-amaranth-pink-800 py-12 font-grotesk">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-950">¡Lo mejor de nuestros productos!</h2>

            {/* Grid de categorías */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 mb-12">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className={`relative cursor-pointer rounded-lg overflow-hidden shadow-lg transition-all duration-300 ${selectedCategory === category.id ? 'ring-2 ring-white' : ''
                            }`}
                        onClick={() => setSelectedCategory(category.id)}
                    >
                        <div className="relative h-48 w-full">
                            <Image
                                src={category.image}
                                alt={category.name}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                className="w-full h-full object-cover"
                                placeholder="blur"
                                blurDataURL={getBlurDataURL(320, 200)}
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-amaranth-pink-400 to-amaranth-pink-200 bg-opacity-40" />
                            <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4">
                                <h3 className="text-xl font-bold text-center">{category.name}</h3>
                                <p className="text-sm text-center mt-2">{category.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Carrusel de productos */}
            <div className="relative px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {isLoadingProducts ? (
                        Array.from({ length: 4 }).map((_, index) => (
                            <ProductSkeleton key={index} />
                        ))
                    ) : (
                        products
                            .slice(currentSlide * 4, (currentSlide + 1) * 4)
                            .map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))
                    )}
                </div>

                {/* Indicadores del carrusel */}
                <div className="flex justify-center gap-2 mt-8">
                    {Array.from({
                        length: Math.ceil(products.length / 4),
                    }).map((_, index) => (
                        <button
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${currentSlide === index
                                ? 'bg-amaranth-pink-400 w-4'
                                : 'bg-gray-800'
                                }`}
                            onClick={() => setCurrentSlide(index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;