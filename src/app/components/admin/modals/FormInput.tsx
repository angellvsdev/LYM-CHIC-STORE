'use client';
import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    fullWidth?: boolean;
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    error?: string;
    fullWidth?: boolean;
    children: React.ReactNode;
}

export const FormInput: React.FC<FormInputProps> = ({ 
    label, 
    error, 
    fullWidth = false, 
    className = '', 
    ...props 
}) => {
    const baseClasses = "w-full px-3 py-2.5 border border-davys-gray-300 rounded-lg focus:ring-2 focus:ring-amaranth-pink-400 focus:border-transparent transition-all duration-200 text-davys-gray-900 placeholder-davys-gray-500";
    const errorClasses = error ? "border-red-300 focus:ring-red-400" : "";
    
    return (
        <div className={fullWidth ? "col-span-full" : ""}>
            <label className="block text-sm font-medium text-davys-gray-700 mb-2">
                {label}
            </label>
            <input
                className={`${baseClasses} ${errorClasses} ${className}`}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

export const FormSelect: React.FC<FormSelectProps> = ({ 
    label, 
    error, 
    fullWidth = false, 
    className = '', 
    children,
    ...props 
}) => {
    const baseClasses = "w-full px-3 py-2.5 border border-davys-gray-300 rounded-lg focus:ring-2 focus:ring-amaranth-pink-400 focus:border-transparent transition-all duration-200 text-davys-gray-900 cursor-pointer";
    const errorClasses = error ? "border-red-300 focus:ring-red-400" : "";
    
    return (
        <div className={fullWidth ? "col-span-full" : ""}>
            <label className="block text-sm font-medium text-davys-gray-700 mb-2">
                {label}
            </label>
            <select
                className={`${baseClasses} ${errorClasses} ${className}`}
                {...props}
            >
                {children}
            </select>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};
