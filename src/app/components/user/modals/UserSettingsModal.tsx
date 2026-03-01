'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../hooks/useAuth';
import BaseModal from '../../admin/modals/BaseModal';
import { 
  UserCircleIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { z } from 'zod';

// Schema de validación para el formulario
const UserSettingsSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(255, "El nombre es demasiado largo"),
  email_address: z.string().email("Email inválido"),
  phone_number: z.string().min(1, "El número de teléfono es requerido").max(20),
  age: z.number().int().min(0, "La edad debe ser mayor a 0").max(120, "La edad debe ser menor a 120").optional(),
  gender: z.string().optional(),
  password: z.string().min(0).max(255).optional().refine((val) => !val || val.length >= 8, {
    message: "La contraseña debe tener al menos 8 caracteres",
  }),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  // Solo validar coincidencia de contraseñas si se proporcionó una contraseña
  if (data.password && data.password !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type UserSettingsFormData = z.infer<typeof UserSettingsSchema>;

interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const UserSettingsModal: React.FC<UserSettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState<UserSettingsFormData>({
    name: '',
    email_address: '',
    phone_number: '',
    age: undefined,
    gender: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Inicializar formulario con datos del usuario
  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.name || '',
        email_address: user.email || '',
        phone_number: user.phone_number || '',
        age: user.age || undefined,
        gender: user.gender || '',
        password: '',
        confirmPassword: '',
      });
      setErrors({});
      setSuccessMessage('');
    }
  }, [user, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? undefined : parseInt(value) || undefined) : value,
    }));

    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    try {
      UserSettingsSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path.length > 0) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSuccessMessage('');

    try {
      // Preparar datos para enviar - convertir undefined a null para campos opcionales
      const dataToSend = {
        name: formData.name,
        email_address: formData.email_address,
        phone_number: formData.phone_number,
        age: formData.age || null,
        gender: formData.gender || null,
        password: formData.password || undefined,
        confirmPassword: formData.confirmPassword || undefined,
      };

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('¡Perfil actualizado exitosamente!');
        
        // Actualizar usuario en el contexto
        if (data.user && updateUser) {
          const updatedUserData = {
            id: data.user.user_id.toString(),
            name: data.user.name,
            email: data.user.email_address,
            role: data.user.role as 'admin' | 'user',
            phone_number: data.user.phone_number,
            age: data.user.age,
            gender: data.user.gender,
            registration_date: data.user.registration_date,
          };
          
          updateUser(updatedUserData);
        }

        // Limpiar campos de contraseña
        setFormData(prev => ({
          ...prev,
          password: '',
          confirmPassword: '',
        }));

        // Cerrar modal después de un breve delay
        setTimeout(() => {
          onClose();
          onSuccess?.();
        }, 1500);

      } else {
        // Manejar errores del servidor
        if (data.details && Array.isArray(data.details)) {
          const serverErrors: Record<string, string> = {};
          data.details.forEach((err: any) => {
            serverErrors[err.path?.[0] || 'general'] = err.message;
          });
          setErrors(serverErrors);
        } else {
          setErrors({ general: data.error || 'Error al actualizar el perfil' });
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ general: 'Error de conexión. Inténtalo de nuevo.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setErrors({});
      setSuccessMessage('');
      onClose();
    }
  };

  if (!user) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} closeOnOverlay={!isLoading}>
      <div className="bg-white sm:rounded-2xl shadow-2xl w-full h-full sm:h-auto max-h-[100vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-amaranth-pink-300 to-amaranth-pink-200 p-4 sm:p-6 sm:rounded-t-2xl flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white rounded-full p-2">
                <UserCircleIcon className="h-6 w-6 sm:h-8 sm:w-8 text-amaranth-pink-300" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Configuración de Perfil</h2>
                <p className="text-amaranth-pink-100 text-sm sm:text-base">Actualiza tu información personal</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="text-white hover:text-amaranth-pink-100 transition-colors disabled:opacity-50"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Mensaje de éxito */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">{successMessage}</p>
              </div>
            )}

            {/* Error general */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-medium">{errors.general}</p>
              </div>
            )}

            {/* Información Personal */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Información Personal</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Nombre */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Nombre completo
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserCircleIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-amaranth-pink-400 focus:border-amaranth-pink-400 text-gray-900 placeholder-gray-500 ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Tu nombre completo"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email_address"
                      value={formData.email_address}
                      onChange={handleInputChange}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-amaranth-pink-400 focus:border-amaranth-pink-400 text-gray-900 placeholder-gray-500 ${
                        errors.email_address ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="tu@email.com"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email_address && (
                    <p className="mt-1 text-sm text-red-600">{errors.email_address}</p>
                  )}
                </div>

                {/* Teléfono */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Número de teléfono
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <PhoneIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-amaranth-pink-400 focus:border-amaranth-pink-400 text-gray-900 placeholder-gray-500 ${
                        errors.phone_number ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="+1 234 567 8900"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.phone_number && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone_number}</p>
                  )}
                </div>

                {/* Edad */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Edad (opcional)
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age || ''}
                    onChange={handleInputChange}
                    min="0"
                    max="120"
                    className={`block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-amaranth-pink-400 focus:border-amaranth-pink-400 text-gray-900 placeholder-gray-500 ${
                      errors.age ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="25"
                    disabled={isLoading}
                  />
                  {errors.age && (
                    <p className="mt-1 text-sm text-red-600">{errors.age}</p>
                  )}
                </div>

                {/* Género */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Género (opcional)
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className={`block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-amaranth-pink-400 focus:border-amaranth-pink-400 text-gray-900 ${
                      errors.gender ? 'border-red-300' : 'border-gray-300'
                    }`}
                    disabled={isLoading}
                  >
                    <option value="">Seleccionar...</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="otro">Otro</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Cambio de Contraseña */}
            <div className="space-y-6 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900">Cambiar Contraseña</h3>
              <p className="text-sm text-gray-600">Deja estos campos en blanco si no deseas cambiar tu contraseña</p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Nueva Contraseña */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Nueva contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-amaranth-pink-400 focus:border-amaranth-pink-400 text-gray-900 placeholder-gray-500 ${
                        errors.password ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Nueva contraseña"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                {/* Confirmar Contraseña */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Confirmar nueva contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-amaranth-pink-400 focus:border-amaranth-pink-400 text-gray-900 placeholder-gray-500 ${
                        errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Confirma tu nueva contraseña"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="w-full sm:w-auto px-8 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-8 py-3 bg-amaranth-pink-300 text-white rounded-lg hover:bg-amaranth-pink-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Guardando...</span>
                  </>
                ) : (
                  <span>Guardar Cambios</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </BaseModal>
  );
};

export default UserSettingsModal;
