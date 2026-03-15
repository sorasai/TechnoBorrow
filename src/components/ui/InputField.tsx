import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ 
    label, 
    error, 
    className = "", 
    ...props 
}) => {
    return (
        <div className="ui-field">
            <label className="ui-field__label">{label}</label>
            <input
                className={`ui-field__input ${className}`}
                {...props}
            />
            {error && <span className="ui-field__error">{error}</span>}
        </div>
    );
};
