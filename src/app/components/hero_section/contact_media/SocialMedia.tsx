import React from "react";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
// import { RiTextDirectionL } from "react-icons/ri";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

const SocialMediaSection = () => {
    return (
        <div className="flex flex-col md:flex-row items-center justify-center h-screen w-full bg-amaranth-pink-100 relative">
            <div className="flex flex-col items-center justify-center bg-amaranth-pink-500 flex-1 md:h-full">
                <FaWhatsapp className="text-white text-3xl w-1/4 h-1/4 my-4" />
                <h1 className="text-white text-2xl md:text-3xl font-bold my-2.5 text-center">¿Te gustaría un pedido más personal?</h1>
                <p className="text-white text-xs md:text-xl my-2.5 text-center p-3">¡Envíanos! Estamos al alcance de tu mano, ¿Qué tienes en mente? Quizás un regalo para tu pareja, o una sorpresa para ti mismo. 🤭 ¡Envíanos tu idea y nos pondremos manos a la obra!</p>
                <button className="bg-white text-amaranth-pink-500 text-xs md:text-sm px-4 py-2 rounded-md flex items-center justify-center hover:cursor-pointer hover:bg-amaranth-pink-500 hover:text-white transition-all duration-300">¡Sí, conversemos! <ArrowTopRightOnSquareIcon className="h-6 w-6 mx-2" /></button>
            </div>
            <div className="flex flex-col items-center justify-center bg-amaranth-pink-400 flex-1 md:h-full">
                <FaInstagram className="text-white text-3xl w-1/4 h-1/4 my-4" />
                <h1 className="text-white text-2xl md:text-3xl font-bold my-2.5 text-center">¿Te gustaría conocer más sobre nuestros servicios?</h1>
                <p className="text-white text-xs md:text-xl my-2.5 text-center p-3">¡Chequea nuestro Instagram! Para que no te pierdas de nada. Las ofertas y promociones más interesantes están siempre a la orden del día. ✅</p>
                <button className="bg-white text-amaranth-pink-500 text-xs md:text-sm px-4 py-2 rounded-md flex items-center justify-center hover:cursor-pointer hover:bg-amaranth-pink-500 hover:text-white transition-all duration-300">¡Quiero ver más! <ArrowTopRightOnSquareIcon className="h-6 w-6 mx-2" /></button>
            </div>
        </div>
    )
}

export default SocialMediaSection;
