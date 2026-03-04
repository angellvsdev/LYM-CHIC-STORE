'use client';
import {
    GiftIcon,
    InformationCircleIcon,
    PhoneIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    ShoppingBagIcon,
    ShoppingCartIcon,
    ArrowRightEndOnRectangleIcon,
    UserIcon,
    UserCircleIcon,
    Cog6ToothIcon
} from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../../../hooks/useAuth";

const UseNavBar = () => {
    const [isVisible, setIsVisible] = useState(false);
    const { user } = useAuth();

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

    return (
        <>
            <nav className="flex flex-col py-5 bg-linear-60 from-amaranth-pink-200 to-amaranth-pink-300 font-grotesk relative">
                {/* Botón de perfil de usuario - Desktop */}
                <div className={`hidden md:flex items-center justify-center absolute top-4 right-2 z-[60] ${!user ? 'w-auto px-2 gap-1' : 'w-12 h-12'}`}>
                    {user ? (
                        <Link href={user.role === 'admin' ? '/admin' : '/profile'} className="text-[#510023] bg-white px-3 py-2 rounded-full hover:bg-amaranth-pink-100 hover:text-white transition-all duration-200 w-full h-full flex items-center justify-center">
                            {user.role === 'admin' ? <Cog6ToothIcon className="h-6" /> : <UserCircleIcon className="h-6" />}
                        </Link>
                    ) : (
                        <div className="flex items-center gap-1">
                            <Link href="/login" className="text-[#510023] bg-white px-2 py-1.5 rounded-full hover:bg-amaranth-pink-100 hover:text-white transition-all duration-200 flex items-center justify-center">
                                <ArrowRightEndOnRectangleIcon className="h-4 w-4" />
                            </Link>
                            <Link href="/sign-up" className="text-[#510023] bg-white px-2 py-1.5 rounded-full hover:bg-amaranth-pink-100 hover:text-white transition-all duration-200 flex items-center justify-center">
                                <UserIcon className="h-4 w-4" />
                            </Link>
                        </div>
                    )}
                </div>

                <div
                    className="block text-[#510023] text-center text-[14px] md:hidden my-3 z-[60] cursor-pointer"
                    onClick={() => setIsVisible(!isVisible)}
                >
                    {
                        isVisible
                            ? <p>Toca para cerrar <ChevronUpIcon className="w-full h-[20px] text-center" /></p>
                            : <p>Toca para abrir <ChevronDownIcon className="w-full h-[20px] text-center" /></p>
                    }
                </div>
                <div className={`w-screen ${isVisible ? 'flex h-screen absolute top-0 z-50 font-grotesk' : ''}`}>
                    {isVisible ? <div className={`flex flex-col items-center justify-center w-full h-screen bg-gradient-to-b from-amaranth-pink-200 to-amaranth-pink-300 px-2 animate__animated animate__slideInDown animate__faster`}>
                        {/* Botón de perfil de usuario - Mobile (primera opción, centrado y más grande) */}
                        {user ? (
                            <Link href={user.role === 'admin' ? '/admin' : '/profile'} className="text-[#510023] text-lg bg-white px-6 py-4 rounded-2xl hover:bg-amaranth-pink-100 hover:text-white w-full my-3 text-center">
                                {user.role === 'admin' ? <Cog6ToothIcon className="h-8 w-8 mx-auto mb-2" /> : <UserCircleIcon className="h-8 w-8 mx-auto mb-2" />}
                                {user.role === 'admin' ? 'Panel Admin' : 'Mi Perfil'}
                            </Link>
                        ) : (
                            <>
                                <Link href="/login" className="text-[#510023] text-lg bg-white px-6 py-4 rounded-2xl hover:bg-amaranth-pink-100 hover:text-white w-full my-3 text-center">
                                    <ArrowRightEndOnRectangleIcon className="h-8 w-8 mx-auto mb-2" />
                                    Iniciar Sesión
                                </Link>
                                <Link href="/sign-up" className="text-[#510023] text-lg bg-white px-6 py-4 rounded-2xl hover:bg-amaranth-pink-100 hover:text-white w-full my-3 text-center">
                                    <UserIcon className="h-8 w-8 mx-auto mb-2" />
                                    Registrarse
                                </Link>
                            </>
                        )}
                        <Link href="/" className="text-[#510023] text-md bg-white px-3 py-2 rounded-2xl hover:bg-amaranth-pink-100 hover:text-white w-full my-2"><GiftIcon className="h-6 text-center inline-block" /> Inicio</Link>
                        <Link href="/catalog" className="text-[#510023] text-md bg-white px-3 py-2 rounded-2xl hover:bg-amaranth-pink-100 hover:text-white w-full my-2"><ShoppingBagIcon className="h-6 text-center inline-block" /> Catálogo</Link>
                        {!user && (
                            <>
                                <Link href="/sign-up" className="text-[#510023] text-md bg-white px-3 py-2 rounded-2xl hover:bg-amaranth-pink-100 hover:text-white w-full my-2"><UserIcon className="h-6 text-center inline-block" />Registrarse</Link>
                                <Link href="/login" className="text-[#510023] text-md bg-white px-3 py-2 rounded-2xl hover:bg-amaranth-pink-100 hover:text-white w-full my-2"><ArrowRightEndOnRectangleIcon className="h-6 text-center inline-block" /> Iniciar Sesión</Link>
                            </>
                        )}
                        <Link target="_blank" href="https://wa.me/+584126589542?text=Hola%2C%20quiero%20consultar%20sobre%20sus%20productos" className="text-[#510023] text-md bg-white px-3 py-2 rounded-2xl hover:bg-amaranth-pink-100 hover:text-white w-full my-2"><PhoneIcon className="h-6 text-center inline-block" /> Contacto</Link>
                    </div> : null}
                </div>
                <div className="hidden md:flex items-center justify-center w-full px-4 font-grotesk">
                    <div className="flex space-x-8">
                        <Link href="/" className="text-[#510023] text-md bg-white px-3 py-2 rounded-2xl hover:bg-amaranth-pink-100 hover:text-white"><GiftIcon className="h-6 text-center inline-block" /> Inicio</Link>
                        <Link href="/catalog" className="text-[#510023] text-md bg-white px-3 py-2 rounded-2xl hover:bg-amaranth-pink-100 hover:text-white"><ShoppingBagIcon className="h-6 text-center inline-block" /> Catálogo</Link>
                        {!user && (
                            <>
                                <Link href="/sign-up" className="text-[#510023] text-md bg-white px-3 py-2 rounded-2xl hover:bg-amaranth-pink-100 hover:text-white"><UserIcon className="h-6 text-center inline-block" />Registrarse</Link>
                                <Link href="/login" className="text-[#510023] text-md bg-white px-3 py-2 rounded-2xl hover:bg-amaranth-pink-100 hover:text-white"><ArrowRightEndOnRectangleIcon className="h-6 text-center inline-block" /> Iniciar Sesión</Link>
                            </>
                        )}
                        <Link target="_blank" href="https://wa.me/+584126589542?text=Hola%2C%20quiero%20consultar%20sobre%20sus%20productos" className="text-[#510023] text-md bg-white px-3 py-2 rounded-2xl hover:bg-amaranth-pink-100 hover:text-white"><PhoneIcon className="h-6 text-center inline-block" /> Contacto</Link>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default UseNavBar;