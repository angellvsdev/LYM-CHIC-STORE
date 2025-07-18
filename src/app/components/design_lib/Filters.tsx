import React, { useState, useEffect } from "react";
import 'animate.css';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { AdjustmentsHorizontalIcon } from "@heroicons/react/16/solid";
import { useSwipeable } from "react-swipeable";

interface Category {
  id: string;
  name: string;
}

interface FiltersProps {
  categories: Category[];
  selectedCategory?: string;
  onCategoryChange: (categoryId: string) => void;
  minPrice: number;
  maxPrice: number;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
}

const Filters: React.FC<FiltersProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  minPrice,
  maxPrice,
  priceRange,
  onPriceChange,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [localRange, setLocalRange] = useState<[number, number]>(priceRange);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setLocalRange(priceRange);
  }, [priceRange]);


    const swipeHandlers = useSwipeable({
      onSwipedDown: () => setShowMenu(false),
      trackMouse: true,
    });

  const handleRangeChange = (value: number, idx: 0 | 1) => {
    const newRange: [number, number] = [...localRange] as [number, number];
    newRange[idx] = value;
    // Asegurar que min <= max
    if (newRange[0] > newRange[1]) {
      if (idx === 0) newRange[1] = newRange[0];
      else newRange[0] = newRange[1];
    }
    setLocalRange(newRange);
  };

  const applyPriceFilter = () => {
    onPriceChange(localRange);
    setShowMenu(false);
  };

  // --- Renderizado ---
  const filtersContent = (
    <div className="flex flex-col gap-6 p-0">
      {/* Encabezado y botón de cierre */}
      <div className="flex items-center justify-between border-b border-gray-200 px-2 sm:px-6 py-4 w-full">
        <span className="text-2xl font-bold text-gray-900">Filtros</span>
        {isMobile && (
          <button onClick={() => setShowMenu(false)} className="text-gray-500 hover:text-amaranth-pink-500">
            <XMarkIcon className="h-7 w-7" />
          </button>
        )}
      </div>
      {/* Filtro de precio tipo slider */}
      <div className="px-2 sm:px-6 pt-2 pb-4 w-full">
        <label className="block text-gray-500 text-sm mb-2">Precio</label>
        <div className="flex items-center gap-2 mb-2">
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={localRange[0]}
            onChange={e => handleRangeChange(Number(e.target.value), 0)}
            className="w-full accent-amaranth-pink-500"
          />
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={localRange[1]}
            onChange={e => handleRangeChange(Number(e.target.value), 1)}
            className="w-full accent-amaranth-pink-500"
          />
        </div>
        <div className="flex justify-between text-gray-700 text-sm">
          <span>Min: ${localRange[0]}</span>
          <span>Max: ${localRange[1]}</span>
        </div>
        <button
          onClick={applyPriceFilter}
          className="mt-3 w-full py-2 bg-amaranth-pink-500 text-white rounded-lg font-semibold hover:bg-amaranth-pink-600 transition-all"
        >
          Aplicar rango de precio
        </button>
      </div>
      {/* Filtro de categorías tipo toggle */}
      <div className="px-2 sm:px-6 pb-6 w-full">
        <label className="block text-gray-500 text-sm mb-2">Categoría</label>
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 w-full">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`w-full px-2 py-2 rounded-lg border font-semibold transition-all duration-200
                ${selectedCategory === cat.id
                  ? 'bg-amaranth-pink-500 text-white border-amaranth-pink-500'
                  : 'bg-white text-amaranth-pink-500 border-amaranth-pink-200 hover:bg-amaranth-pink-50'}
              `}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // --- Móvil/Tablet: menú modal deslizable desde abajo ---
  if (isMobile) {
    return (
      <>
        <button
          className="flex-col text-sm w-full left-0 bottom-1/2 z-10 text-amaranth-pink-200 p-4 shadow-lg flex justify-center rounded-lg bg-gradient-to-br from-white to-amaranth-pink-800"
          onClick={() => setShowMenu((v) => !v)}
        >
          Filtros
          <AdjustmentsHorizontalIcon className="h-10 py-2" />
        </button>
        {showMenu && (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
            onClick={() => setShowMenu(false)}
          >
            <div
              {...swipeHandlers}
              className="w-full bg-white rounded-t-3xl shadow-2xl animate__animated animate__slideInUp animate__faster"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-12 h-1 bg-amaranth-pink-200 rounded-full mx-auto mt-2 mb-2" />
              <div className="p-2 sm:p-6">{filtersContent}</div>
            </div>
          </div>
        )}
      </>
    );
  }
  // --- PC: menú desplegable en el mismo espacio ---
  return (
    <div className="w-full mx-auto bg-white rounded-2xl shadow-lg animate__animated animate__fadeIn animate__faster flex flex-col">
      <button
        className="flex items-center justify-center gap-2 text-base w-full py-3 text-amaranth-pink-200 font-bold rounded-t-2xl rounded-lg bg-gradient-to-br from-white to-amaranth-pink-800 focus:outline-none"
        onClick={() => setShowMenu((v) => !v)}
      >
        <AdjustmentsHorizontalIcon className="h-6 w-6" />
        Filtros
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${showMenu ? 'max-h-[1000px] animate__animated animate__flipInX' : 'max-h-0'}`}
        style={{ minHeight: showMenu ? '320px' : '0px' }}
      >
        {showMenu && (
          <div className="p-2 sm:p-6">
            {filtersContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default Filters; 