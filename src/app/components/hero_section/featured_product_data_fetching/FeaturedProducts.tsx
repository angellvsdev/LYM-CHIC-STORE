'use client'
import React, { useState, useEffect } from "react";
import { categories, featuredProducts } from "@/app/api/products/products";
import ProductCard from "./../../design_lib/ProductCard";
import Image from "next/image";

const FeaturedProducts = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>(categories[0].id);
    const [currentSlide, setCurrentSlide] = useState(0);

    const filteredProducts = featuredProducts.filter(
        (product) => product.category === selectedCategory
    );

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % Math.ceil(filteredProducts.length / 4));
        }, 5000);

        return () => clearInterval(timer);
    }, [filteredProducts.length]);

    return (
        <section className="w-full min-h-screen bg-gray-950 py-12 font-grotesk">
            <h2 className="text-4xl font-bold text-center mb-12">¡Lo mejor de nuestros productos!</h2>
            
            {/* Grid de categorías */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 mb-12">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className={`relative cursor-pointer rounded-lg overflow-hidden shadow-lg transition-all duration-300 ${
                            selectedCategory === category.id ? 'ring-2 ring-white' : ''
                        }`}
                        onClick={() => setSelectedCategory(category.id)}
                    >
                        <div className="relative h-48 w-full">
                            <Image
                                src={category.image}
                                alt={category.name}
                                fill
                                className="w-full h-full object-cover"
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
                    {filteredProducts
                        .slice(currentSlide * 4, (currentSlide + 1) * 4)
                        .map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                </div>

                {/* Indicadores del carrusel */}
                <div className="flex justify-center gap-2 mt-8">
                    {Array.from({
                        length: Math.ceil(filteredProducts.length / 4),
                    }).map((_, index) => (
                        <button
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                currentSlide === index
                                    ? 'bg-amaranth-pink-100 w-4'
                                    : 'bg-gray-300'
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