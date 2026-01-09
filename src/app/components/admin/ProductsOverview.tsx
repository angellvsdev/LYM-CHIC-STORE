"use client";

import React, { useEffect, useState } from "react";
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import { apiClient } from "@/lib/apiClient";
import FormModal from "./modals/FormModal";
import ConfirmModal from "./modals/ConfirmModal";
import DetailModal from "./modals/DetailModal";

// Types matching the API response
interface Category {
    id: string;
    name: string;
}

interface Product {
    id: string;
    name: string;
    description: string;
    category: Category;
    price: number;
    stock: number;
    status: 'active' | 'inactive' | 'out_of_stock';
    image: string;
    images: string[];
    createdAt: string;
    updatedAt: string;
    size?: string;
    color?: string;
    featured: boolean;
}

interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

const ProductsOverview: React.FC = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    
    const [products, setProducts] = useState<Product[]>([]);

    // Fetch products from API
    const fetchProducts = async (categoryId?: string) => {
        try {
            setLoading(true);
            let url = '/api/admin/products';
            if (categoryId) {
                url += `?category=${categoryId}`;
            }
            const { data } = await apiClient.get(url);
            if (data.success) setProducts(data.data.data);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    // Fetch categories from API
    const fetchCategories = async () => {
        try {
            const { data } = await apiClient.get('/api/categories');
            if (data.success && data.data?.data) setCategories(data.data.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    // Handle category filter change
    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategory(categoryId);
        fetchProducts(categoryId || undefined);
    };

    const getStockStatus = (stock: number) => {
        if (stock === 0) return { label: 'Agotado', color: 'text-red-600' };
        if (stock < 10) return { label: 'Bajo Stock', color: 'text-yellow-600' };
        return { label: 'Disponible', color: 'text-green-600' };
    };

    const handleAddProduct = async (formData: Record<string, any>) => {
        try {
            setIsSubmitting(true);
            const body = {
                name: formData.name,
                description: formData.description,
                categoryId: formData.categoryId,
                price: parseFloat(formData.price),
                size: formData.size || null,
                color: formData.color || null,
                image: formData.image || '',
                featured: Boolean(formData.featured),
                stock: parseInt(formData.stock) || 0  // ← AÑADIR ESTA LÍNEA
            };
            
            await apiClient.post('/api/admin/products', body);
            setShowAddModal(false);
            await fetchProducts();
        } catch (error) {
            console.error('Error creating product:', error);
            alert(error instanceof Error ? error.message : 'Error al crear producto');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditProduct = async (formData: Record<string, any>) => {
        if (!selectedProduct) return;
        
        try {
            setIsSubmitting(true);
            const body = {
                name: formData.name,
                description: formData.description,
                categoryId: formData.categoryId,
                price: parseFloat(formData.price),
                size: formData.size || null,
                color: formData.color || null,
                image: formData.image || '',
                featured: Boolean(formData.featured),
                stock: parseInt(formData.stock) || 0  // ← AÑADIR ESTA LÍNEA
            };
            
            await apiClient.put(`/api/admin/products/${selectedProduct.id}`, body);
            setShowEditModal(false);
            await fetchProducts();
        } catch (error) {
            console.error('Error updating product:', error);
            alert(error instanceof Error ? error.message : 'Error al actualizar producto');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteProduct = async () => {
        if (!selectedProduct) return;
        
        try {
            setIsSubmitting(true);
            await apiClient.delete(`/api/admin/products/${selectedProduct.id}`);
            setShowDeleteModal(false);
            await fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert(error instanceof Error ? error.message : 'Error al eliminar producto');
        } finally {
            setIsSubmitting(false);
        }
    };

    const openEditModal = (product: Product) => {
        setSelectedProduct(product);
        setShowEditModal(true);
    };

    const openDeleteModal = (product: Product) => {
        setSelectedProduct(product);
        setShowDeleteModal(true);
    };

    const openDetailModal = (product: Product) => {
        setSelectedProduct(product);
        setShowDetailModal(true);
    };

    return (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg w-full">
            <div className="p-4 sm:p-6 border-b border-davys-gray-200">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-davys-gray-100">Productos</h2>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                        {/* Category Filter Dropdown */}
                        <div className="relative flex-1 sm:flex-none">
                            <select
                                value={selectedCategory}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                className="appearance-none bg-white border border-davys-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 pr-8 text-sm text-davys-gray-700 focus:outline-none focus:ring-2 focus:ring-amaranth-pink-400 focus:border-transparent w-full sm:min-w-[160px] transition-all duration-200"
                            >
                                <option value="">Todas las categorías</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <svg className="w-4 h-4 text-davys-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                        <button 
                            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-amaranth-pink-400 to-amaranth-pink-500 hover:from-amaranth-pink-500 hover:to-amaranth-pink-600 text-white px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-200 shadow-md hover:shadow-lg font-medium" 
                            onClick={() => setShowAddModal(true)}
                        >
                            <PlusIcon className="w-4 h-4" />
                            <span className="text-sm">Agregar Producto</span>
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Loading state */}
            {loading && (
                <div className="flex flex-col justify-center items-center py-16 sm:py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amaranth-pink-400"></div>
                    <span className="mt-4 text-davys-gray-600 text-base sm:text-lg font-medium">Cargando productos...</span>
                </div>
            )}

            {/* Products content */}
            {!loading && (
                <div className="p-4 sm:p-6">
                    {products.length === 0 ? (
                        <div className="text-center text-davys-gray-500 py-16 sm:py-20">
                            <div className="mx-auto w-16 h-16 bg-davys-gray-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-davys-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <p className="text-lg font-medium">No hay productos disponibles</p>
                            <p className="text-sm text-davys-gray-400 mt-1">Agrega tu primer producto para comenzar</p>
                        </div>
                    ) : (
                        <>
                            {/* Mobile Cards View */}
                            <div className="block lg:hidden space-y-4">
                                {products.map((product) => {
                                    const stockInfo = getStockStatus(product.stock);
                                    return (
                                        <div key={product.id} className="bg-white border border-davys-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex items-start space-x-4">
                                                <div className="flex-shrink-0">
                                                    <img 
                                                        className="h-16 w-16 rounded-lg object-cover border border-davys-gray-200" 
                                                        src={product.image || '/api/placeholder/64/64'} 
                                                        alt={product.name} 
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-base font-semibold text-davys-gray-100 truncate">{product.name}</h3>
                                                    <p className="text-sm text-davys-gray-600 mt-1 line-clamp-2">{product.description}</p>
                                                    <div className="flex items-center justify-between mt-3">
                                                        <div className="flex flex-col space-y-1">
                                                            <span className="text-lg font-bold text-davys-gray-100">${product.price.toFixed(2)}</span>
                                                            <span className="text-xs text-davys-gray-500">{product.category.name}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <button
                                                                className="p-2 rounded-lg hover:bg-davys-gray-100 transition-colors"
                                                                onClick={() => openDetailModal(product)}
                                                                title="Ver detalles"
                                                            >
                                                                <EyeIcon className="w-5 h-5 text-davys-gray-600" />
                                                            </button>
                                                            <button
                                                                className="p-2 rounded-lg hover:bg-davys-gray-100 transition-colors"
                                                                onClick={() => openEditModal(product)}
                                                                title="Editar"
                                                            >
                                                                <PencilIcon className="w-5 h-5 text-davys-gray-600" />
                                                            </button>
                                                            <button
                                                                className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                                                                onClick={() => openDeleteModal(product)}
                                                                title="Eliminar"
                                                            >
                                                                <TrashIcon className="w-5 h-5 text-red-500" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="mt-2">
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${stockInfo.color}`}>
                                                            {product.stock} - {stockInfo.label}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Desktop Table View */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="min-w-full divide-y divide-davys-gray-200">
                                    <thead className="bg-davys-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-davys-gray-600 uppercase tracking-wider">Producto</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-davys-gray-600 uppercase tracking-wider">Categoría</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-davys-gray-600 uppercase tracking-wider">Precio</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-davys-gray-600 uppercase tracking-wider">Stock</th>
                                            <th className="px-6 py-4 text-right text-xs font-semibold text-davys-gray-600 uppercase tracking-wider">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-davys-gray-200">
                                        {products.map((product) => {
                                            const stockInfo = getStockStatus(product.stock);
                                            return (
                                                <tr key={product.id} className="hover:bg-davys-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-12 w-12">
                                                                <img 
                                                                    className="h-12 w-12 rounded-lg object-cover border border-davys-gray-200" 
                                                                    src={product.image || '/api/placeholder/48/48'} 
                                                                    alt={product.name} 
                                                                />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-semibold text-davys-gray-100">{product.name}</div>
                                                                <div className="text-sm text-davys-gray-600 truncate max-w-xs">{product.description}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-davys-gray-600">
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-davys-gray-100 text-davys-gray-700">
                                                            {product.category.name}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-davys-gray-100">
                                                        ${product.price.toFixed(2)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${stockInfo.color}`}>
                                                            {product.stock} - {stockInfo.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                        <div className="flex justify-end space-x-2">
                                                            <button
                                                                className="p-2 rounded-lg hover:bg-davys-gray-100 transition-colors"
                                                                onClick={() => openDetailModal(product)}
                                                                title="Ver detalles"
                                                            >
                                                                <EyeIcon className="w-5 h-5 text-davys-gray-600" />
                                                            </button>
                                                            <button
                                                                className="p-2 rounded-lg hover:bg-davys-gray-100 transition-colors"
                                                                onClick={() => openEditModal(product)}
                                                                title="Editar"
                                                            >
                                                                <PencilIcon className="w-5 h-5 text-davys-gray-600" />
                                                            </button>
                                                            <button
                                                                className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                                                                onClick={() => openDeleteModal(product)}
                                                                title="Eliminar"
                                                            >
                                                                <TrashIcon className="w-5 h-5 text-red-500" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Add Product Modal */}
            <FormModal
                title="Agregar Producto"
                description="Completa la información del nuevo producto"
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSubmit={handleAddProduct}
                isSubmitting={isSubmitting}
                fields={[
                    { name: "name", label: "Nombre del Producto", type: "text", required: true },
                    { name: "description", label: "Descripción", type: "textarea", required: true },
                    { 
                        name: "categoryId", 
                        label: "Categoría", 
                        type: "select", 
                        required: true,
                        options: categories.map(cat => ({ value: cat.id, label: cat.name }))
                    },
                    { name: "price", label: "Precio ($)", type: "number", required: true },
                    { name: "stock", label: "Stock", type: "number", required: true },  // ← AÑADIR ESTA LÍNEA
                    { name: "size", label: "Tamaño", type: "text" },
                    { name: "color", label: "Color", type: "text" },
                    { name: "image", label: "URL de Imagen", type: "text" },
                    { name: "featured", label: "Producto Destacado", type: "checkbox" }
                ]}
            />

            {/* Edit Product Modal */}
            <FormModal
                title="Editar Producto"
                description="Modifica la información del producto"
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                onSubmit={handleEditProduct}
                isSubmitting={isSubmitting}
                initialData={selectedProduct ? {
                    name: selectedProduct.name,
                    description: selectedProduct.description,
                    categoryId: selectedProduct.category.id,
                    price: selectedProduct.price,
                    size: selectedProduct.size || '',
                    color: selectedProduct.color || '',
                    image: selectedProduct.image,
                    featured: selectedProduct.featured
                } : undefined}
                fields={[
                    { name: "name", label: "Nombre del Producto", type: "text", required: true },
                    { name: "description", label: "Descripción", type: "textarea", required: true },
                    { 
                        name: "categoryId", 
                        label: "Categoría", 
                        type: "select", 
                        required: true,
                        options: categories.map(cat => ({ value: cat.id, label: cat.name }))
                    },
                    { name: "price", label: "Precio ($)", type: "number", required: true },
                    { name: "stock", label: "Stock", type: "number", required: true },  // ← AÑADIR ESTA LÍNEA
                    { name: "size", label: "Tamaño", type: "text" },
                    { name: "color", label: "Color", type: "text" },
                    { name: "image", label: "URL de Imagen", type: "text" },
                    { name: "featured", label: "Producto Destacado", type: "checkbox" }
                ]}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteProduct}
                variant="danger"
                title="Eliminar Producto"
                description={`¿Estás seguro de que deseas eliminar "${selectedProduct?.name}"? Esta acción no se puede deshacer y el producto será eliminado permanentemente.`}
                confirmText="Sí, Eliminar"
                cancelText="Cancelar"
            />

            {/* Product Detail Modal */}
            <DetailModal
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                title={selectedProduct?.name || ''}
                data={selectedProduct ? [
                    { label: 'ID', value: selectedProduct.id },
                    { label: 'Nombre', value: selectedProduct.name },
                    { label: 'Descripción', value: selectedProduct.description },
                    { label: 'Categoría', value: selectedProduct.category.name },
                    { label: 'Precio', value: `$${selectedProduct.price.toFixed(2)}` },
                    { label: 'Stock', value: selectedProduct.stock.toString() },
                    { label: 'Tamaño', value: selectedProduct.size || 'N/A' },
                    { label: 'Color', value: selectedProduct.color || 'N/A' },
                    { label: 'Destacado', value: selectedProduct.featured ? 'Sí' : 'No' },
                    { label: 'Creado', value: new Date(selectedProduct.createdAt).toLocaleDateString() }
                ] : []}
            />
        </div>
    );
};

export default ProductsOverview;