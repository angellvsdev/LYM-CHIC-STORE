'use client'
import React, { useState, useEffect, useCallback, useMemo } from "react";
import NavBar from "../design_lib/navbar";
import Footer from "../hero_section/credits/Footer";
import ProductCard from "../design_lib/ProductCard";
import ProductSkeleton from "../design_lib/ProductSkeleton";
import Search_Bar from "../Search_Bar";
import Filters from "../design_lib/Filters";
import { Category, Product } from "@/lib/utils/validation/schemas";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { ModalProvider } from "@/app/contexts/ModalContext";

const Catalog_Main = () => {
  const { data: categoriesData } = useSWR('/api/categories', fetcher, { revalidateOnFocus: false });
  const categories: Category[] = useMemo(() => categoriesData?.success ? categoriesData.data.data : [], [categoriesData]);

  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const productsPerPage = 10;

  // Establecer la primera categoría como seleccionada cuando se cargan las categorías
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);

  const productUrl = selectedCategory
    ? `/api/products?category_id=${selectedCategory}&search=${searchTerm}&page=${currentPage}&limit=${productsPerPage}&sort=name&order=asc&min_price=${priceRange[0]}&max_price=${priceRange[1]}`
    : null;

  const { data: productsData, isLoading } = useSWR(productUrl, fetcher, {
    keepPreviousData: true,
  });

  const products: Product[] = useMemo(() => productsData?.data || [], [productsData]);
  const totalPages = productsData?.pagination?.totalPages || 1;

  // Función para manejar la búsqueda  
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);

  return (
    <ModalProvider>
      <NavBar />
      <main className="min-h-screen bg-gradient-to-b from-amaranth-pink-200 to-amaranth-pink-300 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center text-white mb-8 font-grotesk">
            Catálogo de Productos
          </h1>
          <p className="text-white text-center text-lg mb-12">
            Explora nuestra colección completa de productos elegantes y lujosos
          </p>

          {/* Barra de búsqueda */}
          <div className="mb-8">
            <Search_Bar onSearch={handleSearch} />
          </div>

          {/* Filtros */}
          <div className="mb-8">
            <Filters
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={(catId) => {
                setSelectedCategory(catId);
                setCurrentPage(1);
              }}
              minPrice={0}
              maxPrice={1000}
              priceRange={priceRange}
              onPriceChange={(range) => {
                setPriceRange(range);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Estado de carga */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="flex justify-center">
                  <ProductSkeleton />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {products.map((product) => (
                  <div key={product.id} className="flex justify-center">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* Mensaje cuando no hay productos */}
              {products.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-white text-lg">
                    {searchTerm
                      ? `No se encontraron productos que coincidan con "${searchTerm}".`
                      : "No se encontraron productos en esta categoría."
                    }
                  </p>
                </div>
              )}

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
                  >
                    Anterior
                  </button>

                  <span className="text-white px-4 py-2">
                    Página {currentPage} de {totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </ModalProvider>
  )
}

export default Catalog_Main;