import React from 'react';
import './css/FormFields.css';

export function InputField({ label, type = "text", value, onChange, required, min, placeholder }) {
    return (
        <div className="custom-field__wrapper">
            {label && <label className="custom-field__label">{label} {required && '*'}</label>}
            <input 
                className="custom-field__input"
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                min={min}
                placeholder={placeholder}
            />
        </div>
    );
}