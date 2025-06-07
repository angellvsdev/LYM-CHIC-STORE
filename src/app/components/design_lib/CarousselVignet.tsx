interface VignetButtonProps {
    link: string;
    isActive?: boolean;
    onClick?: () => void;
}

const VignetButton = (props: VignetButtonProps) => {
    return (   
        <button 
            type="button" 
            onClick={props.onClick}
            className={`
                relative
                hover:cursor-pointer 
                rounded-full 
                border-gray-950 
                bg-transparent 
                h-6 
                w-6 
                border-4 
                hover:border-gray-800
                transition-all
                duration-300
                ease-in-out
                mx-3
                lg:mx-3.5
                ${props.isActive ? 'border-amaranth-pink-200 shadow-lg' : ''}
                ${props.isActive ? 'after:content-[""] after:absolute after:-inset-4 after:rounded-full after:bg-amaranth-pink-100/40 after:animate-[pulse_2s_ease-in-out_infinite]' : ''}
            `}
        >
            <a href={props.link} className="block w-full h-full"></a>
        </button>
    );
}

export default VignetButton;