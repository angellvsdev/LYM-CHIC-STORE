'use client';
import GiftIcon from "@heroicons/react/24/outline/GiftIcon";
import InformationCircleIcon from "@heroicons/react/24/outline/InformationCircleIcon";
import PhoneIcon from "@heroicons/react/24/outline/PhoneIcon";
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon';
import ShoppingBagIcon from "@heroicons/react/24/outline/ShoppingBagIcon";
import React from "react";
import { useSwipeable } from "react-swipeable";
import { useState } from "react";


const UseNavBar = () => {
    const [isVisible, setIsVisible] = useState(false);
    
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
            <nav className="flex flex-col py-5 bg-linear-60 from-amaranth-pink-200 to-amaranth-pink-300">
                <div className="block text-[#510023] text-center text-[10px] md:hidden my-3 z-60" {...useSwipeableNav()}>
                    Desliza hacia abajo para desplegar el menú. <ChevronDownIcon className="w-full h-[20px] text-center" />
                </div>
                <div className={`w-screen ${ isVisible ? 'flex h-screen absolute top-0 z-50' : null}`}>
                    {isVisible ? <div className={`flex flex-col items-center justify-end w-full h-screen bg-gradient-to-b from-amaranth-pink-200 to-amaranth-pink-300 px-2`}>
                        <a href="#" className="text-[#510023] text-[10px] bg-white px-3 py-1.5 rounded-2xl hover:bg-amaranth-pink-100 hover:text-white w-full my-2"><GiftIcon className="h-6 text-center inline-block" /> Tienda</a>
                        <a href="#" className="text-[#510023] text-[10px] bg-white px-3 py-1.5 rounded-2xl hover:bg-amaranth-pink-100 hover:text-white w-full my-2"><InformationCircleIcon className="h-6 text-center inline-block" /> Nosotros</a>
                        <a href="#" className="text-[#510023] text-[10px] bg-white px-3 py-1.5 rounded-2xl hover:bg-amaranth-pink-100 hover:text-white w-full my-2"><ShoppingBagIcon className="h-6 text-center inline-block" /> Marketplace</a>
                        <a href="#" className="text-[#510023] text-[10px] bg-white px-3 py-1.5 rounded-2xl hover:bg-amaranth-pink-100 hover:text-white w-full my-2"><PhoneIcon className="h-6 text-center inline-block" /> Contacto</a>
                    </div> : null}
                </div>
                <div className="hidden md:flex items-center justify-center w-full px-4">
                    <div className="flex space-x-8">
                        <a href="#" className="text-[#510023] text-[10px] bg-white px-3 py-1.5 rounded-2xl hover:bg-amaranth-pink-100 hover:text-white"><GiftIcon className="h-6 text-center inline-block" /> Tienda</a>
                        <a href="#" className="text-[#510023] text-[10px] bg-white px-3 py-1.5 rounded-2xl hover:bg-amaranth-pink-100 hover:text-white"><InformationCircleIcon className="h-6 text-center inline-block" /> Nosotros</a>
                        <a href="#" className="text-[#510023] text-[10px] bg-white px-3 py-1.5 rounded-2xl hover:bg-amaranth-pink-100 hover:text-white"><ShoppingBagIcon className="h-6 text-center inline-block" /> Marketplace</a>
                        <a href="#" className="text-[#510023] text-[10px] bg-white px-3 py-1.5 rounded-2xl hover:bg-amaranth-pink-100 hover:text-white"><PhoneIcon className="h-6 text-center inline-block" /> Contacto</a>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default UseNavBar;