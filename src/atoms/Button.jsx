import React from 'react';

export function Button({ children, onClick, variant = 'primary', style = {}, ...props }) {
    const baseStyle = {
        padding: '10px 15px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '14px',
        ...style
    };

    // Definimos los diferentes estilos según el uso
    const variants = {
        primary: { backgroundColor: '#005a9e', color: 'white' }, // Azul Microsoft
        secondary: { backgroundColor: '#2f2f2f', color: 'white' }, // Oscuro
        danger: { backgroundColor: '#d83b01', color: 'white' }, // Naranja/Rojo
        text: { backgroundColor: 'transparent', color: '#005a9e', padding: 0 } // Botón sin fondo (tipo link)
    };

    const combinedStyle = { ...baseStyle, ...variants[variant] };

    return (
        <button onClick={onClick} style={combinedStyle} {...props}>
            {children}
        </button>
    );
}