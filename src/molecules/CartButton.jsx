// src/components/molecules/CartButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../atoms/Button';

export function CartButton() {
    const navigate = useNavigate();

    return (
        <Button 
            onClick={() => navigate('/carrito')}
            variant="text"
            style={{ 
                padding: '8px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
            }}
            aria-label="Ir al carrito"
        >
            {/* Puedes usar una URL de imagen, tu propio asset local o un SVG */}
            <img 
                src="https://cdn-icons-png.flaticon.com/512/107/107831.png" 
                alt="Carrito de compras" 
                style={{ 
                    width: '24px', 
                    height: '24px', 
                    filter: 'brightness(0) invert(1)' // Vuelve la imagen blanca para resaltar sobre el fondo azul
                }} 
            />
        </Button>
    );
}