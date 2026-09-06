import React from 'react';
import { Button } from '../atoms/Button';

export function ProductoCard({ producto, onVerDetalle }) {
    return (
        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{producto.nombre}</h3>
            
            <p style={{ fontSize: '14px', color: '#666', height: '40px', overflow: 'hidden' }}>
                {producto.descripcion}
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', marginBottom: '15px' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#107c10' }}>
                    ${producto.precio}
                </span>
                <span style={{ fontSize: '12px', padding: '4px 8px', backgroundColor: '#e7f4e4', borderRadius: '12px' }}>
                    Stock: {producto.stock}
                </span>
            </div>
            
            {/* Usamos el Átomo */}
            <Button 
                onClick={() => onVerDetalle(producto.id)} 
                variant="primary" 
                style={{ marginTop: 'auto' }}
            >
                Ver Detalle
            </Button>
        </div>
    );
}