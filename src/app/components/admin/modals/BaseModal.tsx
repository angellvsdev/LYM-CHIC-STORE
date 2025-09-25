'use client';
import React, { useEffect } from 'react';

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
    closeOnOverlay?: boolean;
}

const BaseModal: React.FC<BaseModalProps> = ({ isOpen, onClose, children, className, closeOnOverlay = true }) => {
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
            {/* Overlay */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
                onClick={closeOnOverlay ? onClose : undefined}
            />

            {/* Modal container */}
            <div 
                role="dialog" 
                aria-modal="true" 
                className={`relative z-[101] w-88 max-w-[95vw] sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] xl:max-w-[60vw] ${className || ''}`}
            >
                {children}
            </div>
        </div>
    );
};

export default BaseModal;
