// src/components/molecules/ProductoCard.jsx
import React from 'react';
import { Button } from '../atoms/Button';
import { formatarDinero } from '../utils/formatCurrency'; 
import './css/ProductoCard.css';

export function ProductoCard({ producto, onVerDetalle }) {
    const imagenPorDefecto = "https://via.placeholder.com/250x250/f4f0fa/7a28cb?text=Sin+Imagen";
    
    return (
        <div className="product-card">
            <div className="product-card__image-container">
                <img 
                    src={producto.imagenUrl || imagenPorDefecto} 
                    alt={`Imagen de ${producto.nombre}`} 
                    className="product-card__image"
                />
            </div>
            
            <div className="product-card__content">
                <h3 className="product-card__title">{producto.nombre}</h3>
                <p className="product-card__description">{producto.descripcion}</p>
                
                <div className="product-card__meta">
                    <span className="product-card__price">
                        {formatearDinero(producto.precio)} {/* <-- Aplicado aquí */}
                    </span>
                    <span className="product-card__stock">
                        Stock: {producto.stock}
                    </span>
                </div>
                
                <Button 
                    onClick={() => onVerDetalle(producto.id)} 
                    style={{ backgroundColor: '#7a28cb', color: 'white', width: '100%' }}
                >
                    Ver Detalle
                </Button>
            </div>
        </div>
    );
}   