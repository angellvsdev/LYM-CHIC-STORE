'use client'
import React, { useState, useEffect } from "react";
import ProductCard from "./../../design_lib/ProductCard";
import Image from "next/image";
import { Category, Product } from "@/lib/utils/validation/schemas";
import axios from "axios";


const FeaturedProducts = () => {
    const [categories, setCategories] = useState<Category[]>([]); // Estado para las categorías
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined); // Inicialmente no hay categoría seleccionada
    const [currentSlide, setCurrentSlide] = useState(0);
    const [products, setProducts] = useState<Product[]>([]); // Estado para los producto

    async function fetchCategories() {
        try {
            const response = await axios.get('/api/categories');
            if (response.data.success && response.data.data.data) {
                console.log(response.data.data.data);
                setCategories(response.data.data.data);
            }
        }
        catch (error) {
            console.error("Error fetching categories:", error);
        }
    }
    async function fetchProducts() {
        try {
            const response = await axios.get('/api/products', { params: {
                category_id: selectedCategory,
                page: 1,
                limit: 10,
                sort: 'name',
                order: 'asc'
            }});
            setProducts(response.data.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % Math.ceil(products.length / 4));
        }, 5000);

        return () => clearInterval(timer);

    }, [products.length]);
    useEffect(() => {
        fetchCategories();
    }, []);

    // Set selectedCategory to the first category when categories are loaded
    useEffect(() => {
        if (categories.length > 0 && !selectedCategory) {
            setSelectedCategory(categories[0].id);
        }
    }, [categories, selectedCategory]);
    useEffect(() => {
        if (selectedCategory) {
            fetchProducts();
        }
    }, [selectedCategory, fetchProducts]);
    return (
        <section className="w-full min-h-screen bg-gradient-to-bl from-white to-amaranth-pink-800 py-12 font-grotesk">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-950">¡Lo mejor de nuestros productos!</h2>
            
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
                    {products
                        .slice(currentSlide * 4, (currentSlide + 1) * 4)
                        .map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                </div>

                {/* Indicadores del carrusel */}
                <div className="flex justify-center gap-2 mt-8">
                    {Array.from({
                        length: Math.ceil(products.length / 4),
                    }).map((_, index) => (
                        <button
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                                currentSlide === index
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