'use client'
import React, { useState, useRef } from 'react';
import { BackspaceIcon, MagnifyingGlassCircleIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
  className?: string;
}

const Search_Bar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Encuentra los productos que buscas"
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Detectar Ctrl+Del (Delete key con Ctrl presionado)
    if (e.ctrlKey && e.key === 'Delete') {
      e.preventDefault();
      handleClear();
    }
  };

  return (
    <div className={`mx-auto text-gray-950 w-full`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center bg-white rounded-2xl">  
          {/* Botones */}
          <div className="flex ">
            {/* Botón de búsqueda */}
            <button
              type="submit"
              className="flex h-12 px-4 py-3 text-davys-gray-700 font-semibold outline-none transition-all duration-300 cursor-pointer"
            >
              <MagnifyingGlassCircleIcon className="h-6 lg:h-10 self-center" /><span className="mx-2">Buscar</span>
            </button>
          </div>

          {/* Input de búsqueda */}
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full px-4 py-3 pl-12 pr-20 text-davys-gray-100 placeholder-davys-gray-700 outline-none"
            />
            {/* Botón de limpiar - solo visible en dispositivos móviles */}
            {searchTerm && (
              <button
                type="button"
                onClick={handleClear}
                className="md:hidden h-full right-0.5 absolute px-4 py-3 text-davys-gray-100 outline-none"
              >
                 <BackspaceIcon className="h-full" />
              </button>
              
            )}
          </div>
        </div>
      </form>

      {/* Búsqueda rápida con Enter */}
      <p className="text-white/80 text-sm text-center mt-2 hidden lg:block">
        Presiona Enter para buscar • Ctrl+Del para limpiar
      </p>
    </div>
  );
};

export default Search_Bar; 