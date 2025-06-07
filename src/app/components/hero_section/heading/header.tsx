import VignetButton from "../../design_lib/CarousselVignet";
import { MoonIcon } from "@heroicons/react/24/outline";
import { ShoppingBagIcon }  from "@heroicons/react/24/outline";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { HeaderCarouselData } from "@/types/carousel";
import Image from "next/image";


const headerCarousselStages: HeaderCarouselData = [
    {
        mainMedia: "https://cdn3d.iconscout.com/3d/premium/thumb/svg-file-3d-icon-download-in-png-blend-fbx-gltf-formats--document-format-art-and-design-pack-development-icons-5410015.png",
        content: 
        <>
            <span className="font-grotesk inline-flex p-3 text-gray-900 absolute z-30 top-10 left-10 rounded-md bg-gradient-to-r from-gray-300 to-gray-400 bg-opacity-50 backdrop-blur-md text-center font-bold text-nowrap shadow-2xl shadow-gray-900 md:left-1/3"><MoonIcon className="h-6 w-6 mx-2"/>¡Elegante!</span>
            <span className="font-grotesk inline-flex p-3 text-gray-900 absolute z-30 top-24 right-3 rounded-md bg-gradient-to-r from-gray-300 to-gray-400 bg-opacity-50 backdrop-blur-md text-center font-bold text-nowrap shadow-2xl shadow-gray-900 md:right-1/4"><ShoppingBagIcon className="h-6 w-6 mx-2"/>Lujoso.</span>
            <span className="font-grotesk inline-flex p-3 text-gray-900 absolute z-30 top-52 left-4 rounded-md bg-gradient-to-r from-gray-300 to-gray-400 bg-opacity-50 backdrop-blur-md text-center font-bold text-nowrap shadow-2xl shadow-gray-900 md:left-2/12 md:top-2/12"><SparklesIcon className="h-6 w-6 mx-2"/>Glamuroso.</span>
        </>
    }
]

const Header = () => {
    return (
        <>
            <header className="relative flex flex-col items-center md:justify-center w-full h-screen bg-gradient-to-b from-amaranth-pink-200 to-amaranth-pink-300 text-white">
                <div className="w-9/12 bg-transparent shadow-2xl h-5/12 my-4 md:w-2/3 lg:h-full lg:absolute left-0 lg:[clip-path:polygon(0_0,100%_0%,50%_100%,0%_100%)] rounded-4xl lg:rounded-none">
                    <Image src={headerCarousselStages[0].mainMedia} alt="Example Image" width={800} height={800} className="object-contain lg:object-cover w-full h-full" />
                    {/* <img src={headerCarousselStages[0].mainMedia} className="object-contain lg:object-cover w-full h-full" /> */}
                    {headerCarousselStages[0].content}
                </div>
                <h1 className="text-center text-4xl text-white my-4 lg:z-10 justify-self-end">Hello, World!</h1>
                <p className="text-white text-[1.15rem] text-center my-2 w-3/4 lg:z-10 justify-self-end">Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora libero nobis nihil ullam modi quos eius. Ea reprehenderit architecto sunt, dolores eius sequi sit. Perferendis atque porro illo aut ipsa?</p>
                <nav className="flex items-center justify-center flex-row w-2/3 mx-auto h-10 my-4 lg:z-10 lg:absolute lg:left-5/6 lg:top-1/2 lg:rotate-z-90 lg:w-3/12">
                    <VignetButton link="#home" isActive={true} />
                    <VignetButton link="#home" isActive={false} />
                </nav>
            </header>
        </>
    )
}


export default Header;