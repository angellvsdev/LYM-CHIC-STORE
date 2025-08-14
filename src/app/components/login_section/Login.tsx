import React from "react";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-bl from-white to-amaranth-pink-800">
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
          <form className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Correo electrónico"
              className="px-4 py-2 rounded bg-lavender-blush-400 text-white focus:outline-none focus:ring-1 focus:ring-amaranth-pink-300"
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              className="px-4 py-2 rounded bg-lavender-blush-400 text-white focus:outline-none focus:ring-1 focus:ring-amaranth-pink-300"
              required
            />
            <div className="flex items-center justify-between">
              <label className="flex items-center text-davys-gray-100 text-sm">
                <input
                  type="checkbox"
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
              className="mt-2 bg-amaranth-pink-300 cursor-pointer hover:bg-amaranth-pink-200 text-white font-bold py-2 rounded transition-colors"
            >
              Iniciar Sesión
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