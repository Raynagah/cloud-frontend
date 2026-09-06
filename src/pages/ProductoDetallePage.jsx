// src/pages/ProductoDetallePage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductoById, agregarItemCarrito } from '../functions/apiService';
import { Button } from '../atoms/Button';

export function ProductoDetallePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const backendDataStr = localStorage.getItem('backendData');
    const backendData = backendDataStr ? JSON.parse(backendDataStr) : null;
    
    const [producto, setProducto] = useState(null);
    const [cargando, setCargando] = useState(true);
    
    // NUEVOS ESTADOS para manejar cantidad y carga del botón
    const [cantidad, setCantidad] = useState(1);
    const [procesando, setProcesando] = useState(false);

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
                // Si el stock es 0, seteamos la cantidad a 0, sino a 1
                setCantidad(data.stock > 0 ? 1 : 0);
            }
        } catch (err) {
            console.error("Error:", err);
        } finally {
            setCargando(false);
        }
    };

    // --- FUNCIONES PARA SUMAR Y RESTAR CANTIDAD ---
    const sumarCantidad = () => {
        if (cantidad < producto.stock) {
            setCantidad(cantidad + 1);
        }
    };

    const restarCantidad = () => {
        if (cantidad > 1) {
            setCantidad(cantidad - 1);
        }
    };

    // --- FUNCIÓN PARA AGREGAR AL CARRITO ---
    const handleAgregarCarrito = async (redirigirAlCarrito) => {
        if (!backendData?.token || cantidad <= 0) return;

        setProcesando(true);
        try {
            const res = await agregarItemCarrito(
                producto.id, 
                cantidad, 
                producto.precio, // Pasamos el precio al backend
                backendData.token
            );

            if (res.ok) {
                // Actualizamos el stock localmente para no tener que recargar la página entera
                setProducto(prev => ({ ...prev, stock: prev.stock - cantidad }));
                setCantidad(1); // Reseteamos el contador

                if (redirigirAlCarrito) {
                    navigate('/carrito'); // Redirige a la página del carrito (asegúrate de tener esta ruta)
                } else {
                    alert("¡Producto agregado al carrito con éxito!");
                }
            } else {
                alert("Hubo un problema al agregar el producto al carrito.");
            }
        } catch (error) {
            console.error("Error agregando al carrito:", error);
            alert("Error de conexión al agregar al carrito.");
        } finally {
            setProcesando(false);
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
                <span style={{ fontSize: '14px', color: '#555' }}>
                    Disponibles: <strong style={{ color: producto.stock > 0 ? '#107c10' : '#d83b01' }}>{producto.stock}</strong>
                </span>
            </div>

            {/* CONTROLES DE CANTIDAD */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <span style={{ fontWeight: 'bold' }}>Cantidad:</span>
                <Button 
                    onClick={restarCantidad} 
                    variant="secondary" 
                    style={{ padding: '5px 12px', fontSize: '18px' }}
                    disabled={cantidad <= 1 || producto.stock === 0}
                >
                    -
                </Button>
                <span style={{ fontSize: '20px', width: '30px', textAlign: 'center' }}>
                    {cantidad}
                </span>
                <Button 
                    onClick={sumarCantidad} 
                    variant="secondary" 
                    style={{ padding: '5px 12px', fontSize: '18px' }}
                    disabled={cantidad >= producto.stock || producto.stock === 0}
                >
                    +
                </Button>
                <span style={{ fontSize: '14px', color: '#666' }}>
                    (Subtotal: ${ (producto.precio * cantidad).toFixed(2) })
                </span>
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div style={{ display: 'flex', gap: '15px' }}>
                <Button 
                    variant="danger" 
                    style={{ flex: 1, fontSize: '16px' }} 
                    onClick={() => handleAgregarCarrito(false)}
                    disabled={procesando || producto.stock === 0}
                >
                    {procesando ? 'Agregando...' : 'Agregar al carrito 🛒'}
                </Button>
                
                <Button 
                    variant="primary" 
                    style={{ flex: 1, fontSize: '16px' }} 
                    onClick={() => handleAgregarCarrito(true)}
                    disabled={procesando || producto.stock === 0}
                >
                    Añadir e ir al carrito 🛍️
                </Button>
            </div>
            
            {producto.stock === 0 && (
                <p style={{ color: '#d83b01', marginTop: '15px', textAlign: 'center', fontWeight: 'bold' }}>
                    Producto agotado por el momento.
                </p>
            )}
        </div>
    );
}