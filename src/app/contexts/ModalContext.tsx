'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ModalContextType {
    isAnyModalOpen: boolean;
    setModalOpen: (isOpen: boolean) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
    const context = useContext(ModalContext);
    if (context === undefined) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAnyModalOpen, setIsAnyModalOpen] = useState(false);

    const setModalOpen = (isOpen: boolean) => {
        setIsAnyModalOpen(isOpen);
    };

    return (
        <ModalContext.Provider value={{ isAnyModalOpen, setModalOpen }}>
            {children}
        </ModalContext.Provider>
    );
};
