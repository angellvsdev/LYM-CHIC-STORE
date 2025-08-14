'use client';
import { 
    GiftIcon, 
    InformationCircleIcon, 
    PhoneIcon, 
    ChevronDownIcon, 
    ShoppingBagIcon, 
    ArrowRightEndOnRectangleIcon, 
    UserIcon 
} from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import Link from "next/link";


const UseNavBar = () => {
    const [isVisible, setIsVisible] = useState(false);
    
    // Bloquear scroll del body cuando el menú está visible en móviles
    useEffect(() => {
        const isMobile = window.innerWidth < 768;
        if (isVisible && isMobile) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        // Limpiar al desmontar
        return () => {
            document.body.style.overflow = '';
        };
    }, [isVisible]);

    const useSwipeableNav = () => {
        const handlers = useSwipeable({
            onSwipedDown: () => {
                // Handle swipe down event
                setIsVisible(true)
            },
            onSwipedUp: () => {
                // Handle swipe up event
                setIsVisible(false)
                
            },
            trackMouse: true,
        });

        return handlers;
    }

    return(
        <>
            <nav className="flex flex-col py-5 bg-linear-60 from-amaranth-pink-200 to-amaranth-pink-300 font-grotesk">
                <div className="block text-[#510023] text-center text-[14px] md:hidden my-3 z-60" {...useSwipeableNav()}>
                    {
                        isVisible 
                            ? <p>Desliza hacia arriba para ocultar el menú. <ChevronDownIcon className="w-full h-[20px] text-center" /></p>
                            : <p>Desliza hacia abajo para desplegar el menú. <ChevronDownIcon className="w-full h-[20px] text-center" /></p>
                    }
                </div>
                <div className={`w-screen ${ isVisible ? 'flex h-screen absolute top-0 z-50 font-grotesk' : null}`}>
                    {isVisible ? <div className={`flex flex-col items-center justify-end w-full h-screen bg-gradient-to-b from-amaranth-pink-200 to-amaranth-pink-300 px-2 animate__animated animate__slideInDown animate__faster`}>
                        <Link href="/" className="text-[#510023] text-md bg-white px-3 py-2 rounded-2xl hover:bg-amaranth-pink-100 hover:text-white w-full my-2"><GiftIcon className="h-6 text-center inline-block" /> Inicio</Link>
                        <Link href="#" className="text-[#510023] text-md bg-white px-3 py-2 rounded-2xl hover:bg-amaranth-pink-100 hover:text-white w-full my-2"><InformationCircleIcon className="h-6 text-center inline-block" /> Nosotros</Link>
                        <Link href="/catalog" className="text-[#510023] text-md bg-white px-3 py-2 rounded-2xl hover:bg-amaranth-pink-100 hover:text-white w-full my-2"><ShoppingBagIcon className="h-6 text-center inline-block" /> Catálogo</Link>
                        <Link href="/sign-up" className="text-[#510023] text-md bg-white px-3 py-2 rounded-2xl hover:bg-amaranth-pink-100 hover:text-white w-full my-2"><UserIcon className="h-6 text-center inline-block" />Registrarse</Link>
                        <Link href="/login" className="text-[#510023] text-md bg-white px-3 py-2 rounded-2xl hover:bg-amaranth-pink-100 hover:text-white w-full my-2"><ArrowRightEndOnRectangleIcon className="h-6 text-center inline-block" /> Iniciar Sesión</Link>
                        <Link href="#" className="text-[#510023] text-md bg-white px-3 py-2 rounded-2xl hover:bg-amaranth-pink-100 hover:text-white w-full my-2"><PhoneIcon className="h-6 text-center inline-block" /> Contacto</Link>
                    </div> : null}
                </div>
                <div className="hidden md:flex items-center justify-center w-full px-4 font-grotesk">
                    <div className="flex space-x-8">
                        <Link href="/" className="text-[#510023] text-md bg-white px-3 py-2 rounded-2xl hover:bg-amaranth-pink-100 hover:text-white"><GiftIcon className="h-6 text-center inline-block" /> Inicio</Link>
                        <Link href="#" className="text-[#510023] text-md bg-white px-3 py-2 rounded-2xl hover:bg-amaranth-pink-100 hover:text-white"><InformationCircleIcon className="h-6 text-center inline-block" /> Nosotros</Link>
                        <Link href="/catalog" className="text-[#510023] text-md bg-white px-3 py-2 rounded-2xl hover:bg-amaranth-pink-100 hover:text-white"><ShoppingBagIcon className="h-6 text-center inline-block" /> Catálogo</Link>
                        <Link href="/sign-up" className="text-[#510023] text-md bg-white px-3 py-2 rounded-2xl hover:bg-amaranth-pink-100 hover:text-white"><UserIcon className="h-6 text-center inline-block" />Registrarse</Link>
                        <Link href="/login" className="text-[#510023] text-md bg-white px-3 py-2 rounded-2xl hover:bg-amaranth-pink-100 hover:text-white"><ArrowRightEndOnRectangleIcon className="h-6 text-center inline-block" /> Iniciar Sesión</Link>
                        <Link href="#" className="text-[#510023] text-md bg-white px-3 py-2 rounded-2xl hover:bg-amaranth-pink-100 hover:text-white"><PhoneIcon className="h-6 text-center inline-block" /> Contacto</Link>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default UseNavBar;