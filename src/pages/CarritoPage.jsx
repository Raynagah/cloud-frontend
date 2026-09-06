// src/pages/CarritoPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCarrito, vaciarCarritoBackend, eliminarItemCarrito, getProductos } from '../functions/apiService';
import { Button } from '../atoms/Button';

export function CarritoPage() {
    const navigate = useNavigate();
    const backendDataStr = localStorage.getItem('backendData');
    const backendData = backendDataStr ? JSON.parse(backendDataStr) : null;

    const [carrito, setCarrito] = useState(null);
    const [diccionarioProductos, setDiccionarioProductos] = useState({});
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        if (backendData?.token) {
            cargarCarritoYProductos(backendData.token);
        }
    }, []);

    const cargarCarritoYProductos = async (token) => {
        setCargando(true);
        try {
            // Hacemos ambas peticiones en paralelo para que sea más rápido
            const [resCarrito, resProductos] = await Promise.all([
                getCarrito(token),
                getProductos(token)
            ]);

            if (resProductos.ok) {
                const dataProductos = await resProductos.json();
                // Creamos un diccionario { id: 'Nombre del producto' } para buscar rápido
                const map = {};
                dataProductos.forEach(prod => {
                    map[prod.id] = prod.nombre;
                });
                setDiccionarioProductos(map);
            }

            if (resCarrito.ok) {
                const dataCarrito = await resCarrito.json();
                setCarrito(dataCarrito);
            }
        } catch (error) {
            console.error("Error al cargar datos:", error);
        } finally {
            setCargando(false);
        }
    };

    const handleVaciarCarrito = async () => {
        if (!window.confirm("¿Estás seguro de que deseas vaciar todo el carrito?")) return;
        
        try {
            const res = await vaciarCarritoBackend(backendData.token);
            if (res.ok || res.status === 204) {
                // Actualizamos la vista localmente (el backend ya hizo su trabajo y devolvió los stocks)
                setCarrito(prev => ({ ...prev, items: [], total: 0 }));
            } else {
                alert("Hubo un problema al vaciar el carrito");
            }
        } catch (error) {
            console.error("Error vaciando carrito:", error);
        }
    };

    const handleEliminarItem = async (productoId) => {
        try {
            const res = await eliminarItemCarrito(productoId, backendData.token);
            if (res.ok) {
                const carritoActualizado = await res.json();
                setCarrito(carritoActualizado); // El backend nos devuelve el carrito recalculado
            } else {
                alert("No se pudo eliminar el ítem");
            }
        } catch (error) {
            console.error("Error eliminando ítem:", error);
        }
    };

    if (cargando) return <p style={{ padding: '20px' }}>Cargando tu carrito... 🛒</p>;
    if (!carrito) return <p style={{ padding: '20px' }}>No se pudo cargar el carrito.</p>;

    const hayItems = carrito.items && carrito.items.length > 0;

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>Mi Carrito de Compras 🛍️</h2>
                <Button variant="text" onClick={() => navigate('/dashboard')}>
                    ← Seguir comprando
                </Button>
            </div>

            {!hayItems ? (
                <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ color: '#666' }}>Tu carrito está vacío</h3>
                    <p style={{ color: '#999', marginBottom: '20px' }}>¡Explora nuestro catálogo y descubre productos increíbles!</p>
                    <Button onClick={() => navigate('/dashboard')}>Ir a Productos</Button>
                </div>
            ) : (
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    
                    {/* Lista de Items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {carrito.items.map(item => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>
                                <div style={{ flex: 2 }}>
                                    <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>
                                        {diccionarioProductos[item.productoId] || `Producto #${item.productoId}`}
                                    </h4>
                                    <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
                                        Precio unitario: ${item.precioUnitario}
                                    </p>
                                </div>
                                
                                <div style={{ flex: 1, textAlign: 'center' }}>
                                    <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Cant: {item.cantidad}</span>
                                </div>
                                
                                <div style={{ flex: 1, textAlign: 'right' }}>
                                    <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', color: '#107c10' }}>
                                        Subtotal: ${item.subtotal}
                                    </p>
                                    <Button 
                                        variant="text" 
                                        style={{ color: '#d83b01', padding: 0, fontSize: '13px' }} 
                                        onClick={() => handleEliminarItem(item.productoId)}
                                    >
                                        Quitar producto
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Resumen Total y Acciones */}
                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '20px' }}>
                        <Button 
                            variant="text" 
                            style={{ color: '#d83b01', padding: '10px' }} 
                            onClick={handleVaciarCarrito}
                        >
                            🗑️ Vaciar todo el carrito
                        </Button>

                        <div style={{ textAlign: 'right' }}>
                            <p style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#555' }}>
                                Total a Pagar:
                            </p>
                            <h3 style={{ margin: 0, fontSize: '28px', color: '#107c10' }}>
                                ${carrito.total}
                            </h3>
                            <Button 
                                variant="primary" 
                                style={{ marginTop: '15px', padding: '12px 30px', fontSize: '16px' }}
                                onClick={() => alert("Función de pago en construcción 🚀")}
                            >
                                Proceder al Pago
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}