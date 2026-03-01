"use client"
import Image from "next/image";
import { MoonIcon, ShoppingBagIcon, SparklesIcon } from "@heroicons/react/24/outline";

const Header = () => {
    return (
        <header className="relative flex flex-col items-center md:justify-center w-full h-screen bg-gradient-to-b from-amaranth-pink-200 to-amaranth-pink-300 text-white font-grotesk">
            {/* Imagen principal fija con overlay oscuro para legibilidad - Solo visible en móviles */}
            <div className="absolute inset-0 z-0 md:hidden">
                <Image 
                    src="/main-header.jpeg" // Imagen local de la caja de regalo L&M CHIC
                    alt="L&M CHIC Store - Caja de regalo con rosas de jabón, bombones y perfume" 
                    width={800} 
                    height={800} 
                    className="object-cover w-full h-full" 
                    priority
                />
                {/* Overlay oscuro para mejorar legibilidad del texto */}
                <div className="absolute inset-0 bg-black opacity-50"></div>
            </div>
            
            {/* Imagen principal para tablets y escritorio - Diseño original */}
            <div className="w-full h-full md:w-2/3 lg:h-full lg:absolute left-0 lg:[clip-path:polygon(0_0,100%_0%,50%_100%,0%_100%)] lg:rounded-none relative overflow-hidden hidden md:block">
                <Image 
                    src="/main-header.jpeg" // Imagen local de la caja de regalo L&M CHIC
                    alt="L&M CHIC Store - Caja de regalo con rosas de jabón, bombones y perfume" 
                    width={800} 
                    height={800} 
                    className="object-cover w-full h-full" 
                    priority
                />
                
                {/* Overlay oscuro para mejorar legibilidad del texto */}
                <div className="absolute inset-0 bg-black opacity-50"></div>
                
                {/* Elementos decorativos originales con animaciones - Ocultos en móviles */}
                <div className="absolute inset-0 z-30 hidden md:block">
                    <span className="font-grotesk inline-flex p-3 text-white absolute top-10 left-10 rounded-md bg-gradient-to-r from-pink-600 to-pink-500 bg-opacity-80 backdrop-blur-md text-center font-bold text-nowrap shadow-2xl shadow-gray-900 md:left-1/3 animate__animated animate__slideInLeft">
                        <MoonIcon className="h-6 w-6 mx-2"/>¡Elegante!
                    </span>
                    <span className="font-grotesk inline-flex p-3 text-white absolute top-24 right-3 rounded-md bg-gradient-to-r from-pink-600 to-pink-500 bg-opacity-80 backdrop-blur-md text-center font-bold text-nowrap shadow-2xl shadow-gray-900 md:right-1/4 animate__animated animate__slideInRight">
                        <ShoppingBagIcon className="h-6 w-6 mx-2"/>Lujoso.
                    </span>
                    <span className="font-grotesk inline-flex p-3 text-white absolute top-52 left-4 rounded-md bg-gradient-to-r from-pink-600 to-pink-500 bg-opacity-80 backdrop-blur-md text-center font-bold text-nowrap shadow-2xl shadow-gray-900 md:left-2/12 md:top-2/12 animate__animated animate__slideInLeft">
                        <SparklesIcon className="h-6 w-6 mx-2"/>Glamuroso.
                    </span>
                </div>
            </div>
            
            {/* Contenido de texto */}
            <div className="relative z-10 w-full md:w-auto text-center px-6 max-w-4xl 
                        pt-20 pb-10 md:bg-transparent md:[clip-path:none]">
                <h1 className="text-3xl md:text-5xl lg:text-6xl text-white my-4 font-extrabold leading-tight">
                    🎀 Donde los mejores detalles y regalos se complementan ✨
                </h1>
                <p className="text-base md:text-lg lg:text-xl text-white my-2 mx-auto leading-relaxed text-shadow-lg">
                    "L&M Chic" es una empresa local operando en Villa del Rosario, siempre a la orden del día con la mejor calidad artesanal en ropa, regalos, arreglos florales, juguetería, accesorios y muchísimo más. Realiza tu pedido, dinos qué te gusta, o lo que a ella le gusta (😉) y nosotros nos encargaremos de hacerlo mágico. Nos encontramos ubicados bajando la Calle 18 de Octubre, Casco Central, detrás de la U.E.P. José María Rivas. Ven ¡Estamos esperandote!
                </p>
            </div>
        </header>
    )
}

export default Header;