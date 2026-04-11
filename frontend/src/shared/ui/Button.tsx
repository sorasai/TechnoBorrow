import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
    children, 
    variant = 'primary', 
    loading = false, 
    className = "", 
    disabled,
    ...props 
}) => {
    const baseClass = "ui-btn";
    const variantClass = `ui-btn--${variant}`;
    
    return (
        <button 
            className={`${baseClass} ${variantClass} ${className}`} 
            disabled={disabled || loading}
            {...props}
        >
            {loading ? "Loading..." : children}
        </button>
    );
};
