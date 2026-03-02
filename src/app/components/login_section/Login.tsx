'use client';

import React, { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import Link from "next/link";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const { login, isLoading, error } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return;
    }

    const success = await login(formData.email, formData.password);
    void success;
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-gradient-to-bl from-white to-amaranth-pink-800">
      <Link
        href="/"
        className="absolute top-4 right-4 md:top-8 md:right-8 bg-amaranth-pink-300 hover:bg-amaranth-pink-200 text-white font-semibold py-2 px-4 rounded-full shadow-md transition-all flex items-center gap-2 z-10 hover:scale-105"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Volver al inicio
      </Link>
      <div className="w-full max-w-4xl rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden shadow-gray-400">
        {/* Sección Izquierda */}
        <div className="md:w-1/2 w-full flex flex-col justify-center items-start p-8 bg-gradient-to-b from-amaranth-pink-300 to-amaranth-pink-200 font-grotesk">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">¡Bienvenido de vuelta!</h2>
          <p className="text-gray-200 text-base md:text-lg">
            Inicia sesión para acceder a tu cuenta y disfrutar de todas nuestras ofertas exclusivas.
          </p>
        </div>
        {/* Sección Derecha: Formulario */}
        <div className="md:w-1/2 w-full bg-gradient-to-bl from-white to-amaranth-pink-800 p-8 flex flex-col justify-center font-grotesk">
          <h3 className="text-2xl font-semibold text-amaranth-pink-300 mb-6">Iniciar Sesión</h3>

          {error && (
            <div className="mb-4 p-3 rounded text-sm bg-red-100 text-red-800 border border-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleInputChange}
              className="px-4 py-2 rounded bg-lavender-blush-400 text-white focus:outline-none focus:ring-1 focus:ring-amaranth-pink-300"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleInputChange}
              className="px-4 py-2 rounded bg-lavender-blush-400 text-white focus:outline-none focus:ring-1 focus:ring-amaranth-pink-300"
              required
            />
            <div className="flex items-center justify-between">
              <label className="flex items-center text-davys-gray-100 text-sm">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2 rounded focus:ring-amaranth-pink-300"
                />
                Recordarme
              </label>
              <a href="/forgot-password" className="text-lavender-blush-400 hover:underline text-sm">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 bg-amaranth-pink-300 cursor-pointer hover:bg-amaranth-pink-200 text-white font-bold py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </form>
          <div className="mt-6 text-center">
            <span className="text-davys-gray-100">¿No tienes cuenta? </span>
            <a href="/sign-up" className="text-lavender-blush-400 hover:underline font-semibold">Regístrate aquí</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 