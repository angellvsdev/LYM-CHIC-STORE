'use client';
import React, { useState } from 'react';
import { 
    PlusIcon,
    PencilIcon,
    TrashIcon,
    EyeIcon,
    TagIcon,
    CubeIcon
} from '@heroicons/react/24/outline';
import ConfirmModal from './modals/ConfirmModal';
import FormModal from './modals/FormModal';
import { FormInput, FormSelect } from './modals/FormInput';

interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    status: 'active' | 'inactive' | 'out_of_stock';
    image: string;
    createdAt: string;
}

const ProductsOverview: React.FC = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [products] = useState<Product[]>([
        {
            id: '1',
            name: 'Set de Tazas de Cerámica',
            category: 'Vajilla',
            price: 45.99,
            stock: 15,
            status: 'active',
            image: '/api/placeholder/60/60',
            createdAt: '2024-10-20'
        },
        {
            id: '2',
            name: 'Vaso de Vidrio',
            category: 'Bebidas',
            price: 16.25,
            stock: 0,
            status: 'out_of_stock',
            image: '/api/placeholder/60/60',
            createdAt: '2024-10-18'
        },
        {
            id: '3',
            name: 'Plato de Porcelana',
            category: 'Vajilla',
            price: 28.75,
            stock: 8,
            status: 'active',
            image: '/api/placeholder/60/60',
            createdAt: '2024-10-15'
        },
        {
            id: '4',
            name: 'Cuchara de Acero',
            category: 'Cubiertos',
            price: 12.50,
            stock: 25,
            status: 'active',
            image: '/api/placeholder/60/60',
            createdAt: '2024-10-12'
        }
    ]);

    const getStatusInfo = (status: Product['status']) => {
        switch (status) {
            case 'active':
                return { label: 'Activo', color: 'bg-green-100 text-green-800' };
            case 'inactive':
                return { label: 'Inactivo', color: 'bg-gray-100 text-gray-800' };
            case 'out_of_stock':
                return { label: 'Sin Stock', color: 'bg-red-100 text-red-800' };
            default:
                return { label: 'Desconocido', color: 'bg-gray-100 text-gray-800' };
        }
    };

    const getStockStatus = (stock: number) => {
        if (stock === 0) return { label: 'Agotado', color: 'text-red-600' };
        if (stock < 10) return { label: 'Bajo Stock', color: 'text-yellow-600' };
        return { label: 'Disponible', color: 'text-green-600' };
    };

    const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Lógica para agregar producto
        setTimeout(() => {
            setIsSubmitting(false);
            setShowAddModal(false);
        }, 1000);
    };

    const handleEditProduct = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Lógica para editar producto
        setTimeout(() => {
            setIsSubmitting(false);
            setShowEditModal(false);
            setSelectedProduct(null);
        }, 1000);
    };

    const handleDeleteProduct = async () => {
        // Lógica para eliminar producto
        console.log('Eliminando producto:', selectedProduct?.id);
        setShowDeleteModal(false);
        setSelectedProduct(null);
    };

    const openEditModal = (product: Product) => {
        setSelectedProduct(product);
        setShowEditModal(true);
    };

    const openDeleteModal = (product: Product) => {
        setSelectedProduct(product);
        setShowDeleteModal(true);
    };

    return (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg lg:w-5/6 xl:w-11/12 xl:mx-auto">
            <div className="p-4 sm:p-6 border-b border-davys-gray-200">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg sm:text-xl font-bold text-davys-gray-100">Productos</h2>
                    <button className="flex items-center space-x-2 bg-amaranth-pink-400 hover:bg-amaranth-pink-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl transition-colors" onClick={() => setShowAddModal(true)}>
                        <PlusIcon className="w-4 h-4" />
                        <span className="text-xs sm:text-sm font-medium">Agregar</span>
                    </button>
                </div>
            </div>
            
            {/* Vista de tarjetas para móviles */}
            <div className="block lg:hidden p-4 space-y-4">
                {products.map((product) => {
                    const statusInfo = getStatusInfo(product.status);
                    const stockStatus = getStockStatus(product.stock);
                    
                    return (
                        <div key={product.id} className="bg-white rounded-2xl shadow-lg border-l-4 border-amaranth-pink-400 p-4 relative">
                            {/* Badge de estado en la esquina superior derecha */}
                            <div className="absolute top-4 right-4">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                    {statusInfo.label}
                                </span>
                            </div>
                            
                            {/* Contenido principal */}
                            <div className="pr-20">
                                {/* Título principal */}
                                <h3 className="text-lg font-bold text-davys-gray-100 mb-2">
                                    {product.name}
                                </h3>
                                
                                {/* Información de categoría */}
                                <div className="flex items-center text-sm text-davys-gray-600 mb-2">
                                    <TagIcon className="w-4 h-4 mr-2 text-amaranth-pink-400" />
                                    <span>{product.category}</span>
                                </div>
                                
                                {/* Información de stock */}
                                <div className="flex items-center text-sm text-davys-gray-600 mb-2">
                                    <CubeIcon className="w-4 h-4 mr-2 text-amaranth-pink-400" />
                                    <span>Stock: {product.stock}</span>
                                    <span className={`ml-2 text-xs ${stockStatus.color}`}>
                                        ({stockStatus.label})
                                    </span>
                                </div>
                                
                                {/* Fecha de creación */}
                                <div className="text-sm text-davys-gray-600 mb-3">
                                    Creado: {product.createdAt}
                                </div>
                                
                                {/* Precio */}
                                <div className="text-lg font-bold text-davys-gray-100 mb-3">
                                    ${product.price}
                                </div>
                                
                                {/* Botones de acción */}
                                <div className="flex space-x-2">
                                    <button 
                                        className="flex-1 bg-amaranth-pink-400 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amaranth-pink-500 transition-colors"
                                        onClick={() => console.log('Ver producto:', product.id)}
                                    >
                                        <EyeIcon className="w-4 h-4 inline mr-2" />
                                        Ver Detalles
                                    </button>
                                    <button 
                                        className="px-4 py-2 border border-davys-gray-300 text-davys-gray-600 rounded-lg text-sm font-medium hover:bg-davys-gray-50 transition-colors"
                                        onClick={() => openEditModal(product)}
                                    >
                                        <PencilIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {/* Vista de tabla para desktop */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-davys-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-davys-gray-600 uppercase tracking-wider">
                                Producto
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-davys-gray-600 uppercase tracking-wider">
                                Categoría
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-davys-gray-600 uppercase tracking-wider">
                                Precio
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-davys-gray-600 uppercase tracking-wider">
                                Stock
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-davys-gray-600 uppercase tracking-wider">
                                Estado
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-davys-gray-600 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-davys-gray-200">
                        {products.map((product) => {
                            const statusInfo = getStatusInfo(product.status);
                            const stockStatus = getStockStatus(product.stock);
                            
                            return (
                                <tr key={product.id} className="hover:bg-davys-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-davys-gray-200 rounded-lg flex items-center justify-center mr-3">
                                                <TagIcon className="w-5 h-5 text-davys-gray-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-davys-gray-100">
                                                    {product.name}
                                                </div>
                                                <div className="text-sm text-davys-gray-600">
                                                    ID: {product.id}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-davys-gray-100">
                                            {product.category}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-davys-gray-100">
                                            ${product.price}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-davys-gray-100">
                                                {product.stock}
                                            </div>
                                            <div className={`text-xs ${stockStatus.color}`}>
                                                {stockStatus.label}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                            {statusInfo.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button 
                                                className="text-amaranth-pink-400 hover:text-amaranth-pink-500"
                                                onClick={() => console.log('Ver producto:', product.id)}
                                            >
                                                <EyeIcon className="w-4 h-4" />
                                            </button>
                                            <button 
                                                className="text-davys-gray-400 hover:text-davys-gray-600"
                                                onClick={() => openEditModal(product)}
                                            >
                                                <PencilIcon className="w-4 h-4" />
                                            </button>
                                            <button 
                                                className="text-red-400 hover:text-red-600"
                                                onClick={() => openDeleteModal(product)}
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Modales */}
            <FormModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSubmit={handleAddProduct}
                title="Agregar Producto"
                description="Completa la información del nuevo producto"
                isSubmitting={isSubmitting}
            >
                <FormInput
                    label="Nombre del Producto"
                    type="text"
                    placeholder="Ej: Set de Tazas de Cerámica"
                    required
                />
                <FormSelect
                    label="Categoría"
                    required
                >
                    <option value="">Seleccionar categoría</option>
                    <option value="Vajilla">Vajilla</option>
                    <option value="Bebidas">Bebidas</option>
                    <option value="Cubiertos">Cubiertos</option>
                </FormSelect>
                <FormInput
                    label="Precio"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    required
                />
                <FormInput
                    label="Stock"
                    type="number"
                    placeholder="0"
                    required
                />
            </FormModal>

            <FormModal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedProduct(null);
                }}
                onSubmit={handleEditProduct}
                title="Editar Producto"
                description="Modifica la información del producto"
                isSubmitting={isSubmitting}
            >
                <FormInput
                    label="Nombre del Producto"
                    type="text"
                    defaultValue={selectedProduct?.name}
                    required
                />
                <FormSelect
                    label="Categoría"
                    defaultValue={selectedProduct?.category}
                    required
                >
                    <option value="Vajilla">Vajilla</option>
                    <option value="Bebidas">Bebidas</option>
                    <option value="Cubiertos">Cubiertos</option>
                </FormSelect>
                <FormInput
                    label="Precio"
                    type="number"
                    step="0.01"
                    defaultValue={selectedProduct?.price}
                    required
                />
                <FormInput
                    label="Stock"
                    type="number"
                    defaultValue={selectedProduct?.stock}
                    required
                />
            </FormModal>

            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedProduct(null);
                }}
                onConfirm={handleDeleteProduct}
                title="Eliminar Producto"
                description={`¿Estás seguro de que deseas eliminar "${selectedProduct?.name}"? Esta acción no se puede deshacer.`}
                variant="danger"
                confirmText="Eliminar"
            />
        </div>
    );
};

export default ProductsOverview;