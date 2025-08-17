'use client'
import React, { useState, useEffect } from "react";
import NavBar from "../design_lib/navbar";
import Footer from "../hero_section/credits/Footer";
import ProductCard from "../design_lib/ProductCard";
import Search_Bar from "../Search_Bar";
import Filters from "../design_lib/Filters";
import { Category, Product } from "@/lib/utils/validation/schemas";
import axios from "axios";

const Catalog_Main = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const productsPerPage = 10;

  // Función para obtener categorías
  async function fetchCategories() {
    try {
      const response = await axios.get('/api/categories');
      console.log('Categorías obtenidas:', response.data.data);
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error obteniendo categorías:", error);
    }
  }

  // Función para obtener productos
  async function fetchProducts() {
    try {
      setLoading(true);
      const response = await axios.get('/api/products', {
        params: {
          category_id: selectedCategory,
          search: searchTerm,
          page: currentPage,
          limit: productsPerPage,
          sort: 'name',
          order: 'asc',
          min_price: priceRange[0],
          max_price: priceRange[1],
        }
      });
      console.log('Productos obtenidos:', response.data.data);
      setProducts(response.data.data);
      
      // Calcular total de páginas (asumiendo que la API devuelve metadata)
      if (response.data.pagination && response.data.pagination.total) {
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error obteniendo productos:", error);
    } finally {
      setLoading(false);
    }
  }

  // Función para manejar la búsqueda
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Resetear a la primera página al buscar
  };

  // Cargar categorías al montar el componente
  useEffect(() => {
    fetchCategories();
  }, []);

  // Establecer la primera categoría como seleccionada cuando se cargan las categorías
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);

  // Cargar productos cuando cambia la categoría seleccionada o el término de búsqueda
  useEffect(() => {
    if (selectedCategory) {
      setCurrentPage(1); // Resetear a la primera página
      fetchProducts();
    }
  }, [selectedCategory, searchTerm, priceRange, fetchProducts]); // Añadir fetchProducts a las dependencias

  // Cargar productos cuando cambia la página
  useEffect(() => {
    if (selectedCategory) {
      fetchProducts();
    }
  }, [currentPage, selectedCategory, fetchProducts]);

  return (
    <>
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
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              <span className="ml-3 text-white text-lg">Cargando productos...</span>
            </div>
          )}

          {/* Grid de productos */}
          {!loading && (
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
    </>
  )
}

export default Catalog_Main; 