import React from 'react';

const ProductSkeleton = React.memo(() => {
    return (
        <div className="flex flex-col bg-davys-gray-100/50 rounded-lg shadow-lg w-full max-w-[320px] h-[450px] border shadow-amaranth-pink-500/50 animate-pulse relative">
            {/* Image Placeholder */}
            <div className="relative w-full h-[200px] bg-gray-400/50 rounded-t-lg"></div>

            {/* Content Placeholder */}
            <div className="flex flex-col flex-grow p-4 space-y-3">
                {/* Title */}
                <div className="w-3/4 h-6 bg-gray-400/50 rounded"></div>

                {/* Tags */}
                <div className="flex gap-2">
                    <div className="w-12 h-6 bg-gray-400/50 rounded"></div>
                    <div className="w-16 h-6 bg-gray-400/50 rounded"></div>
                </div>

                {/* Description */}
                <div className="w-full flex-grow flex flex-col gap-2 mt-2">
                    <div className="w-full h-4 bg-gray-400/50 rounded"></div>
                    <div className="w-5/6 h-4 bg-gray-400/50 rounded"></div>
                </div>

                {/* Footer (Price and Button) */}
                <div className="flex justify-between items-center pt-2 mt-auto">
                    <div className="flex flex-col gap-1">
                        <div className="w-16 h-7 bg-gray-400/50 rounded"></div>
                        <div className="w-20 h-4 bg-gray-400/50 rounded"></div>
                    </div>
                    <div className="w-28 h-10 bg-gray-400/50 rounded-lg"></div>
                </div>
            </div>
        </div>
    );
});

ProductSkeleton.displayName = 'ProductSkeleton';

export default ProductSkeleton;
