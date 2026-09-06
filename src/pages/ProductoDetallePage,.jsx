import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductoById } from '../functions/apiService';
import { Button } from '../atoms/Button'; // <- Importamos el átomo

export function ProductoDetallePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const backendDataStr = localStorage.getItem('backendData');
    const backendData = backendDataStr ? JSON.parse(backendDataStr) : null;
    
    const [producto, setProducto] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        if (backendData?.token) {
            cargarProductoDetalle(backendData.token);
        }
    }, [id]);

    const cargarProductoDetalle = async (token) => {
        try {
            const res = await getProductoById(id, token);
            if (res.ok) {
                const data = await res.json();
                setProducto(data);
            }
        } catch (err) {
            console.error("Error:", err);
        } finally {
            setCargando(false);
        }
    };

    if (cargando) return <p>Cargando detalle...</p>;
    if (!producto) return <p>Producto no encontrado.</p>;

    return (
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', maxWidth: '600px', margin: '0 auto' }}>
            
            <Button onClick={() => navigate(-1)} variant="text" style={{ marginBottom: '20px' }}>
                ← Volver al catálogo
            </Button>
            
            <h2 style={{ fontSize: '28px', margin: '0 0 10px 0' }}>{producto.nombre}</h2>
            <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.6' }}>{producto.descripcion}</p>
            
            <div style={{ backgroundColor: '#f3f2f1', padding: '20px', borderRadius: '6px', margin: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#107c10' }}>${producto.precio}</span>
                <span style={{ fontSize: '14px', color: '#555' }}>Disponibles: <strong>{producto.stock}</strong></span>
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
                <Button variant="danger" style={{ flex: 1, fontSize: '16px' }} onClick={() => console.log('Agregar al carrito', producto.id)}>
                    Agregar al carrito 🛒
                </Button>
                
                <Button variant="secondary" style={{ flex: 1, fontSize: '16px' }} onClick={() => console.log('Ir al carrito')}>
                    Ir al carrito 🛍️
                </Button>
            </div>
        </div>
    );
}