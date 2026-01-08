"use client";

import React, { useEffect, useMemo, useState } from "react";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { apiClient } from "@/lib/apiClient";
import FormModal from "./modals/FormModal";
import ConfirmModal from "./modals/ConfirmModal";

// Types matching prisma/model
interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
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

const CategoriesOverview: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selected, setSelected] = useState<Category | null>(null);

  // Fetch list
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));
      if (search) params.set("search", search);

      const { data: payload } = await apiClient.get(`/api/categories?${params.toString()}`);
      if (payload?.data) {
        setCategories(payload.data.data);
        setTotal(payload.data.pagination.total);
      }
    } catch (e) {
      console.error("Error fetching categories", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, search]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  // Handlers
  const openAdd = () => {
    setSelected(null);
    setShowAddModal(true);
  };
  const openEdit = (c: Category) => {
    setSelected(c);
    setShowEditModal(true);
  };
  const openDelete = (c: Category) => {
    setSelected(c);
    setShowDeleteModal(true);
  };

  const handleCreate = async (form: Record<string, any>) => {
    try {
      setIsSubmitting(true);
      const body = {
        name: form.name,
        description: form.description,
        image: form.image ?? "",
        featured: Boolean(form.featured) ?? false,
      };
      await apiClient.post("/api/categories/admin", body);
      setShowAddModal(false);
      await fetchCategories();
    } catch (e) {
      console.error("Error creating category", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (form: Record<string, any>) => {
    if (!selected) return;
    try {
      setIsSubmitting(true);
      const body = {
        name: form.name,
        description: form.description,
        image: form.image ?? "",
        featured: Boolean(form.featured) ?? false,
      };
      await apiClient.put(`/api/categories/admin?id=${encodeURIComponent(selected.id)}`, body);
      setShowEditModal(false);
      await fetchCategories();
    } catch (e) {
      console.error("Error updating category", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    try {
      setIsSubmitting(true);
      await apiClient.delete(`/api/categories/admin?id=${encodeURIComponent(selected.id)}`);
      setShowDeleteModal(false);
      await fetchCategories();
    } catch (e) {
      console.error("Error deleting category", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg lg:w-5/6 xl:w-11/12 xl:mx-auto">
      <div className="p-4 sm:p-6 border-b border-davys-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-davys-gray-100">Categorías</h2>
          <button
            className="flex items-center space-x-2 bg-amaranth-pink-400 hover:bg-amaranth-pink-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl transition-colors"
            onClick={openAdd}
          >
            <PlusIcon className="w-4 h-4" />
            <span className="text-xs sm:text-sm font-medium">Agregar</span>
          </button>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <input
            type="text"
            placeholder="Buscar categoría..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-72 border border-davys-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amaranth-pink-400"
          />

          <div className="flex items-center gap-2 ml-auto">
            <select
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value))}
              className="border border-davys-gray-300 rounded-lg px-2 py-2 text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <span className="text-xs text-davys-gray-500">por página</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amaranth-pink-400"></div>
          <span className="ml-3 text-davys-gray-600 text-lg">Cargando categorías...</span>
        </div>
      ) : (
        <div className="p-4 sm:p-6">
          {categories.length === 0 ? (
            <div className="text-center text-davys-gray-500 py-12">No hay categorías.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-davys-gray-200">
                <thead>
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-davys-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-davys-gray-500 uppercase tracking-wider">Descripción</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-davys-gray-500 uppercase tracking-wider">Destacada</th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-davys-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-davys-gray-200">
                  {categories.map((c) => (
                    <tr key={c.id}>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-davys-gray-800">{c.name}</td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-davys-gray-600">{c.description}</td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm">
                        {c.featured ? (
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">Sí</span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">No</span>
                        )}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-right text-sm">
                        <div className="flex justify-end gap-2">
                          <button
                            className="p-2 rounded-lg hover:bg-davys-gray-50"
                            onClick={() => openEdit(c)}
                            title="Editar"
                          >
                            <PencilIcon className="w-5 h-5 text-davys-gray-600" />
                          </button>
                          <button
                            className="p-2 rounded-lg hover:bg-davys-gray-50"
                            onClick={() => openDelete(c)}
                            title="Eliminar"
                          >
                            <TrashIcon className="w-5 h-5 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-davys-gray-500">
                Página {page} de {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 rounded-lg border border-davys-gray-300 text-sm disabled:opacity-50"
                >
                  Anterior
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1 rounded-lg border border-davys-gray-300 text-sm disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add modal */}
      <FormModal
        title="Agregar categoría"
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleCreate}
        isSubmitting={isSubmitting}
        fields={[
          { name: "name", label: "Nombre", type: "text", required: true },
          { name: "description", label: "Descripción", type: "textarea", required: true },
          { name: "image", label: "URL de imagen", type: "text" },
          { name: "featured", label: "Destacada", type: "checkbox" },
        ]}
      />

      {/* Edit modal */}
      <FormModal
        title="Editar categoría"
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleUpdate}
        isSubmitting={isSubmitting}
        initialData={selected ? {
          name: selected.name,
          description: selected.description,
          image: selected.image,
          featured: selected.featured,
        } : undefined}
        fields={[
          { name: "name", label: "Nombre", type: "text", required: true },
          { name: "description", label: "Descripción", type: "textarea", required: true },
          { name: "image", label: "URL de imagen", type: "text" },
          { name: "featured", label: "Destacada", type: "checkbox" },
        ]}
      />

      {/* Delete modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        variant="danger"
        title="Eliminar categoría"
        description={`¿Seguro que deseas eliminar la categoría "${selected?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
      />
    </div>
  );
};

export default CategoriesOverview;
