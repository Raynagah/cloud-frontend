import React from 'react';
import './css/FormFields.css';

export function SelectField({ label, value, onChange, options }) {
    return (
        <div className="custom-field__wrapper">
            {label && <label className="custom-field__label">{label}</label>}
            <select className="custom-field__input" value={value} onChange={onChange}>
                {options.map((opt, index) => (
                    <option key={index} value={opt}>{opt}</option>
                ))}
            </select>
        </div>
    );
}