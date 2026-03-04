import React from 'react';

interface VerificationModalProps {
    isOpen: boolean;
    email: string;
    onResend: () => void;
    onCancel: () => void;
    isResending?: boolean;
}

const VerificationModal: React.FC<VerificationModalProps> = ({
    isOpen,
    email,
    onResend,
    onCancel,
    isResending = false
}) => {
    if (!isOpen) return null;

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0 }} className="z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="w-[95%] sm:w-full max-w-lg max-h-[95vh] overflow-y-auto bg-white rounded-3xl shadow-2xl p-6 md:p-10 font-grotesk relative transform transition-all animate-slideUp">

                {/* Header / Logo */}
                <div className="text-center mb-6 md:mb-8">
                    <div className="text-3xl md:text-4xl font-bold text-amaranth-pink-600 mb-2 tracking-tight">
                        🎀 L&M CHIC Store
                    </div>
                </div>

                {/* Content Box */}
                <div className="text-center bg-pink-50/50 rounded-2xl p-5 md:p-8 border border-pink-100 shadow-inner">
                    <div className="text-5xl md:text-6xl mb-4 md:mb-6 flex justify-center">
                        {/* Animación local simulando el envío del correo */}
                        <div className="relative">
                            <span className="block animate-bounce">✨</span>
                            <span className="absolute -bottom-2 -right-2 text-3xl md:text-4xl">✉️</span>
                        </div>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 md:mb-4">
                        ¡Tu cuenta casi está lista!
                    </h2>

                    <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-5 md:mb-6">
                        Hemos enviado un enlace de confirmación a tu dirección de correo electrónico:<br />
                        <strong className="text-amaranth-pink-600 block mt-2 md:mt-3 text-lg md:text-xl break-all">{email}</strong>
                    </p>

                    <div className="text-left bg-white p-4 md:p-5 rounded-xl border border-pink-100 mb-6 md:mb-8 shadow-sm">
                        <h3 className="font-bold text-gray-700 mb-3 flex items-center text-sm md:text-base">
                            <span className="mr-2">📝</span> Siguientes pasos:
                        </h3>
                        <ul className="space-y-3 text-gray-600 text-sm md:text-base">
                            <li className="flex items-start">
                                <span className="text-amaranth-pink-500 mr-2">1.</span>
                                <span>Abre tu correo electrónico y busca un mensaje de L&M CHIC Store.</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-amaranth-pink-500 mr-2">2.</span>
                                <span>Haz clic en el botón <strong>"Verificar mi Cuenta"</strong> dentro del correo.</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-amaranth-pink-500 mr-2">3.</span>
                                <span>¡Listo! Podrás iniciar sesión con tu cuenta inmediatamente.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col space-y-3">
                        <button
                            onClick={onResend}
                            disabled={isResending}
                            className="w-full bg-gradient-to-r from-amaranth-pink-700 to-amaranth-pink-500 text-white py-3 md:py-4 px-4 md:px-6 rounded-xl font-bold text-base md:text-lg hover:from-amaranth-pink-800 hover:to-amaranth-pink-600 transition-all shadow-lg transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center"
                        >
                            {isResending ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Reenviando...
                                </>
                            ) : (
                                'Reenviar Correo de Verificación'
                            )}
                        </button>
                        <button
                            onClick={onCancel}
                            className="w-full bg-transparent border-2 border-gray-200 text-gray-600 py-3 px-4 md:px-6 rounded-xl font-semibold text-sm md:text-base hover:bg-gray-50 hover:border-gray-300 transition-all"
                        >
                            Modificar Correo o Cancelar
                        </button>
                    </div>

                    <p className="text-xs md:text-sm text-gray-500 mt-5 md:mt-6">
                        <span className="mr-1">💡</span> ¿No recibiste el correo? Recuerda revisar tu carpeta de spam.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerificationModal;
