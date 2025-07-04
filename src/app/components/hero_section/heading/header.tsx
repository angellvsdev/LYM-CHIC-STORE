"use client"
import VignetButton from "../../design_lib/CarousselVignet";
import { MoonIcon } from "@heroicons/react/24/outline";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { HeaderCarouselData } from "@/types/carousel";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

const AUTO_ADVANCE_INTERVAL = 4000; // 4 segundos

const headerCarousselStages: HeaderCarouselData = [
    {
        mainMedia: "https://cdn3d.iconscout.com/3d/premium/thumb/svg-file-3d-icon-download-in-png-blend-fbx-gltf-formats--document-format-art-and-design-pack-development-icons-5410015.png",
        content: 
        <>
            <span className="font-grotesk inline-flex p-3 text-gray-900 absolute z-30 top-10 left-10 rounded-md bg-gradient-to-r from-gray-300 to-gray-400 bg-opacity-50 backdrop-blur-md text-center font-bold text-nowrap shadow-2xl shadow-gray-900 md:left-1/3 animate__animated animate__slideInLeft"><MoonIcon className="h-6 w-6 mx-2"/>¡Elegante!</span>
            <span className="font-grotesk inline-flex p-3 text-gray-900 absolute z-30 top-24 right-3 rounded-md bg-gradient-to-r from-gray-300 to-gray-400 bg-opacity-50 backdrop-blur-md text-center font-bold text-nowrap shadow-2xl shadow-gray-900 md:right-1/4 animate__animated animate__slideInRight"><ShoppingBagIcon className="h-6 w-6 mx-2"/>Lujoso.</span>
            <span className="font-grotesk inline-flex p-3 text-gray-900 absolute z-30 top-52 left-4 rounded-md bg-gradient-to-r from-gray-300 to-gray-400 bg-opacity-50 backdrop-blur-md text-center font-bold text-nowrap shadow-2xl shadow-gray-900 md:left-2/12 md:top-2/12 animate__animated animate__slideInLeft"><SparklesIcon className="h-6 w-6 mx-2"/>Glamuroso.</span>
        </>
    },
    {
        mainMedia: "https://cdn3d.iconscout.com/3d/premium/thumb/svg-file-3d-icon-download-in-png-blend-fbx-gltf-formats--document-format-art-and-design-pack-development-icons-5410015.png",
        content: 
        <>
            <span className="font-grotesk inline-flex p-3 text-gray-900 absolute z-30 top-10 left-10 rounded-md bg-gradient-to-r from-gray-300 to-gray-400 bg-opacity-50 backdrop-blur-md text-center font-bold text-nowrap shadow-2xl shadow-gray-900 md:left-1/3 animate__animated animate__slideInLeft"><MoonIcon className="h-6 w-6 mx-2"/>Woosh!</span>
            <span className="font-grotesk inline-flex p-3 text-gray-900 absolute z-30 top-24 right-3 rounded-md bg-gradient-to-r from-gray-300 to-gray-400 bg-opacity-50 backdrop-blur-md text-center font-bold text-nowrap shadow-2xl shadow-gray-900 md:right-1/4 animate__animated animate__slideInRight"><ShoppingBagIcon className="h-6 w-6 mx-2"/>Bam!!</span>
            <span className="font-grotesk inline-flex p-3 text-gray-900 absolute z-30 top-52 left-4 rounded-md bg-gradient-to-r from-gray-300 to-gray-400 bg-opacity-50 backdrop-blur-md text-center font-bold text-nowrap shadow-2xl shadow-gray-900 md:left-2/12 md:top-2/12 animate__animated animate__slideInLeft"><SparklesIcon className="h-6 w-6 mx-2"/>Boom!</span>
        </>
    }
]

const Header = () => {
    const [currentStage, setCurrentStage] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const stagesCount = headerCarousselStages.length;

    // Avance automático
    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setCurrentStage((prev) => (prev + 1) % stagesCount);
        }, AUTO_ADVANCE_INTERVAL);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [stagesCount]);

    // Cambio manual y reinicio del intervalo
    const goToStage = (idx: number) => {
        setCurrentStage(idx);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
                setCurrentStage((prev) => (prev + 1) % stagesCount);
            }, AUTO_ADVANCE_INTERVAL);
        }
    };

    return (
        <>
            <header className="relative flex flex-col items-center md:justify-center w-full h-screen bg-gradient-to-b from-amaranth-pink-200 to-amaranth-pink-300 text-white font-grotesk">
                <div className="w-9/12 bg-transparent shadow-2xl h-5/12 my-4 md:w-2/3 lg:h-full lg:absolute left-0 lg:[clip-path:polygon(0_0,100%_0%,50%_100%,0%_100%)] rounded-4xl lg:rounded-none">
                    <Image src={headerCarousselStages[currentStage].mainMedia} alt="Example Image" width={800} height={800} className="object-contain lg:object-cover w-full h-full" />
                    {/* <img src={headerCarousselStages[0].mainMedia} className="object-contain lg:object-cover w-full h-full" /> */}
                    {headerCarousselStages[currentStage].content}
                </div>
                <h1 className="text-center text-6xl text-white my-4 lg:z-10 justify-self-end font-extrabold">Hello, World!</h1>
                <p className="text-white text-[1.15rem] text-center my-2 w-3/4 lg:z-10 justify-self-end">Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora libero nobis nihil ullam modi quos eius. Ea reprehenderit architecto sunt, dolores eius sequi sit. Perferendis atque porro illo aut ipsa?</p>
                <nav className="flex items-center justify-center flex-row w-2/3 mx-auto h-10 my-4 lg:z-10 lg:absolute lg:left-5/6 lg:top-1/2 lg:rotate-z-90 lg:w-3/12">
                    {headerCarousselStages.map((_, idx) => (
                        <VignetButton
                            key={idx} 
                            link="#home"
                            isActive={currentStage === idx}
                            onClick={() => goToStage(idx)}
                        />
                    ))}
                </nav>
            </header>
        </>
    )
}

export default Header;