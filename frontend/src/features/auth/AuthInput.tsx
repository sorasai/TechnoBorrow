import React from "react";
interface AuthInputProps {
    label: string;
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AuthInput = ({ label, type, placeholder, value, onChange }: AuthInputProps) => (
    <div className="auth-field">
        <label className="auth-field__label">{label}</label>
        <input
            className="auth-field__input"
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
    </div>
);

export default AuthInput;
