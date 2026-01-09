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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
            {/* Overlay */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
                onClick={closeOnOverlay ? onClose : undefined}
            />

            {/* Modal container */}
            <div 
                role="dialog" 
                aria-modal="true"
                aria-labelledby="modal-title"
                className={`relative z-[101] w-full max-h-[90vh] 
                    max-w-lg 
                    sm:max-w-xl 
                    md:max-w-2xl 
                    lg:max-w-3xl 
                    xl:max-w-4xl
                    mx-auto
                    ${className || ''}`}
            >
                {children}
            </div>
        </div>
    );
};

export default BaseModal;
