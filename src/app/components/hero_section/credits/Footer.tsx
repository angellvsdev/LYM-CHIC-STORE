import React from "react";
import Link from "next/link";
import GiftIcon from "@heroicons/react/24/outline/GiftIcon";
import InformationCircleIcon from "@heroicons/react/24/outline/InformationCircleIcon";
import PhoneIcon from "@heroicons/react/24/outline/PhoneIcon";
import ShoppingBagIcon from "@heroicons/react/24/outline/ShoppingBagIcon";

const Footer = () => {
 return (
    <footer className="bg-gradient-to-b bg-davys-gray-100 text-white py-4 flex flex-col md:flex-row items-center md:justify-around px-2.5">
        <div className="flex flex-col items-center justify-center self-start mx-auto md:mx-0">
            <h1 className="text-2xl md:text-4xl text-white font-black">© LYMChic Store. <p className="text-white text-sm">Todos los derechos reservados.</p></h1>
            <p className="text-white text-sm mx-0">Hecho con amor por <a href="https://www.instagram.com/angelleonardovs/" target="_blank" rel="noopener noreferrer" className="hover:text-amaranth-pink-500 transition-all duration-300">Angel Vera</a></p>
        </div>
        <div className="flex flex-col justify-center self-start my-2">
            <h2 className="text-white text-xl font-black md:text-2xl">Navegación</h2>
            <ul className="py-2 text-white  flex flex-col list-none">
                <li className="flex hover:text-amaranth-pink-200 hover:cursor items-center my-1"><Link href="/" className="text-medium font-grotesk"><GiftIcon className="mx-1 h-6 hover:cursor inline" /> Home</Link></li>
                <li className="flex hover:text-amaranth-pink-200 hover:cursor items-center my-1"><Link href="#" className="text-medium font-grotesk"><InformationCircleIcon className="mx-1 h-6 hover:cursor inline" /> Sobre Nosotros</Link></li>
                <li className="flex hover:text-amaranth-pink-200 hover:cursor items-center my-1"><Link href="#" className="text-medium font-grotesk"><PhoneIcon className="mx-1 h-6 hover:cursor inline" /> Contacto</Link></li>
                <li className="flex hover:text-amaranth-pink-200 hover:cursor items-center my-1"><Link href="/catalog" className="text-medium font-grotesk"><ShoppingBagIcon className="mx-1 h-6 hover:cursor inline" /> Catálogo</Link></li>

            </ul>
        </div>
        <div className="flex flex-col justify-center self-start my-2">
            <h3 className="text-white text-xl font-black md:text-2xl">Información</h3>
            <address className="py-2 text-white flex flex-col">
                <p className="flex items-center my-0.5 font-grotesk font-medium">+58-412-6589542</p>
                <p className="flex items-center my-0.5 font-grotesk font-medium">correoejemplo@gmail.com</p>
                <p className="flex items-center my-0.5 font-grotesk font-medium">Villa del Rosario, Edo. Zulia, Venezuela</p>
            </address>
        </div>
        <div className="flex flex-col justify-center self-start my-2">
            <h4 className="text-white text-xl font-black md:text-2xl">Horarios</h4>
            <div className="py-2 text-white flex flex-col">
            <p className="flex items-center my-0.5 font-grotesk font-medium">Lunes a Sabado</p>
            <p className="flex items-center my-0.5 font-grotesk font-medium">8:00 AM - 8:00 PM</p>
            </div>
        </div>
    </footer>
 )
}

export default Footer;