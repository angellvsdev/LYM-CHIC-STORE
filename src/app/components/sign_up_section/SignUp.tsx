'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const SignUp = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    age: "",
    email_address: "",
    password: "",
    confirmPassword: "",
    phone_number: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    if (!formData.gender) {
      newErrors.gender = "El género es requerido";
    }

    if (!formData.age) {
      newErrors.age = "La edad es requerida";
    } else {
      const age = parseInt(formData.age);
      if (isNaN(age) || age < 0 || age > 120) {
        newErrors.age = "La edad debe estar entre 0 y 120";
      }
    }

    if (!formData.email_address) {
      newErrors.email_address = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email_address)) {
      newErrors.email_address = "Email inválido";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (!formData.phone_number) {
      newErrors.phone_number = "El número de teléfono es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage("");
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await axios.post('/api/auth/register', {
        name: formData.name,
        gender: formData.gender,
        age: parseInt(formData.age),
        email_address: formData.email_address,
        password: formData.password,
        confirmPassword: formData.confirmPassword, // Add confirmPassword to the request
        phone_number: formData.phone_number,
      });

      setSubmitMessage("¡Registro exitoso! Redirigiendo al login...");
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Manejo específico de errores de Axios
        if (error.response) {
          // El servidor respondió con un código de estado fuera del rango 2xx
          const errorMessage = error.response.data?.message || "Error en el registro";
          setSubmitMessage(errorMessage);
        } else if (error.request) {
          // La petición fue hecha pero no se recibió respuesta
          setSubmitMessage("Error de conexión. Verifica tu conexión a internet.");
        } else {
          // Algo pasó al configurar la petición
          setSubmitMessage("Error al procesar la petición.");
        }
      } else {
        // Error no relacionado con Axios
        setSubmitMessage("Error inesperado. Intenta de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-bl from-white to-amaranth-pink-800">
      <div className="w-full max-w-4xl rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden shadow-gray-400">
        {/* Sección Izquierda */}
        <div className="md:w-1/2 w-full flex flex-col justify-center items-start p-8 bg-gradient-to-b from-amaranth-pink-300 to-amaranth-pink-200 font-grotesk">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">¡Comienza ahora!</h2>
          <p className="text-gray-200 text-base md:text-lg">
            Regístrate para acceder a las mejores ofertas y productos. ¡Únete a nuestra comunidad!
          </p>
        </div>
        {/* Sección Derecha: Formulario */}
        <div className="md:w-1/2 w-full bg-gradient-to-bl from-white to-amaranth-pink-800 p-8 flex flex-col justify-center font-grotesk">
          <h3 className="text-2xl font-semibold text-amaranth-pink-300 mb-6">Regístrate</h3>
          
          {submitMessage && (
            <div className={`mb-4 p-3 rounded text-sm ${
              submitMessage.includes("exitoso") 
                ? "bg-green-100 text-green-800 border border-green-300" 
                : "bg-red-100 text-red-800 border border-red-300"
            }`}>
              {submitMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Nombre completo"
                value={formData.name}
                onChange={handleInputChange}
                className={`px-4 py-2 rounded bg-lavender-blush-400 text-white focus:outline-none focus:ring-1 focus:ring-amaranth-pink-300 w-full ${
                  errors.name ? 'border border-red-500' : ''
                }`}
                required
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className={`px-4 py-2 rounded bg-lavender-blush-400 text-white focus:outline-none focus:ring-1 focus:ring-amaranth-pink-300 w-full ${
                  errors.gender ? 'border border-red-500' : ''
                }`}
                required
              >
                <option value="">Género</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </select>
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
            </div>

            <div>
              <input
                type="number"
                name="age"
                placeholder="Edad"
                value={formData.age}
                onChange={handleInputChange}
                min="0"
                max="100"
                className={`px-4 py-2 rounded bg-lavender-blush-400 text-white focus:outline-none focus:ring-1 focus:ring-amaranth-pink-300 w-full ${
                  errors.age ? 'border border-red-500' : ''
                }`}
                required
              />
              {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
            </div>

            <div>
              <input
                type="email"
                name="email_address"
                placeholder="Correo electrónico"
                value={formData.email_address}
                onChange={handleInputChange}
                className={`px-4 py-2 rounded bg-lavender-blush-400 text-white focus:outline-none focus:ring-1 focus:ring-amaranth-pink-300 w-full ${
                  errors.email_address ? 'border border-red-500' : ''
                }`}
                required
              />
              {errors.email_address && <p className="text-red-500 text-xs mt-1">{errors.email_address}</p>}
            </div>

            <div>
              <input
                type="text"
                name="phone_number"
                placeholder="Número de teléfono"
                value={formData.phone_number}
                onChange={handleInputChange}
                className={`px-4 py-2 rounded bg-lavender-blush-400 text-white focus:outline-none focus:ring-1 focus:ring-amaranth-pink-300 w-full ${
                  errors.phone_number ? 'border border-red-500' : ''
                }`}
                required
              />
              {errors.phone_number && <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>}
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleInputChange}
                className={`px-4 py-2 rounded bg-lavender-blush-400 text-white focus:outline-none focus:ring-1 focus:ring-amaranth-pink-300 w-full ${
                  errors.password ? 'border border-red-500' : ''
                }`}
                required
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Repetir contraseña"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`px-4 py-2 rounded bg-lavender-blush-400 text-white focus:outline-none focus:ring-1 focus:ring-amaranth-pink-300 w-full ${
                  errors.confirmPassword ? 'border border-red-500' : ''
                }`}
                required
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 bg-amaranth-pink-300 cursor-pointer hover:bg-amaranth-pink-200 text-white font-bold py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Registrando..." : "Registrarse"}
            </button>
          </form>
          <div className="mt-6 text-center">
            <span className="text-davys-gray-100">¿Ya tienes cuenta? </span>
            <a href="/login" className="text-lavender-blush-400 hover:underline font-semibold">Inicia sesión aquí</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

