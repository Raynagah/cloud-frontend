import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCarrito, vaciarCarritoBackend, eliminarItemCarrito, getProductos, crearOrden } from '../functions/apiService';
import { Button } from '../atoms/Button';
import { formatearDinero } from '../utils/formatCurrency';
import './css/CarritoPage.css'; 

export function CarritoPage() {
    const navigate = useNavigate();
    const backendDataStr = localStorage.getItem('backendData');
    const backendData = backendDataStr ? JSON.parse(backendDataStr) : null;

    const [carrito, setCarrito] = useState(null);
    const [diccionarioProductos, setDiccionarioProductos] = useState({});
    const [cargando, setCargando] = useState(true);
    const [procesandoCompra, setProcesandoCompra] = useState(false);

    useEffect(() => {
        if (backendData) {
            cargarCarritoYProductos();
        } else {
            setCargando(false);
        }
    }, []);

    const cargarCarritoYProductos = async () => {
        setCargando(true);
        try {
            const [resCarrito, resProductos] = await Promise.all([
                getCarrito(),
                getProductos()
            ]);

            const dataProductos = resProductos.data;
            const map = {};
            dataProductos.forEach(prod => {
                map[prod.id] = prod.nombre;
            });
            setDiccionarioProductos(map);
            setCarrito(resCarrito.data);
            
        } catch (error) {
            console.error("Error al cargar datos:", error);
        } finally {
            setCargando(false);
        }
    };

    const handleVaciarCarrito = async () => {
        if (!window.confirm("¿Estás seguro de que deseas vaciar todo tu botín?")) return;
        
        try {
            await vaciarCarritoBackend();
            setCarrito(prev => ({ ...prev, items: [], total: 0 }));
        } catch (error) {
            console.error("Error vaciando carrito:", error);
            alert("Hubo un problema al vaciar el carrito");
        }
    };

    const handleEliminarItem = async (productoId) => {
        try {
            const res = await eliminarItemCarrito(productoId);
            setCarrito(res.data);
        } catch (error) {
            console.error("Error eliminando ítem:", error);
            alert("No se pudo eliminar el ítem");
        }
    };

    const handleProcesarCompra = async () => {
        if (!carrito || !carrito.items || carrito.items.length === 0) return;

        setProcesandoCompra(true);
        try {
            // Mapeamos los ítems incluyendo 'nombreProducto' sacado del diccionario
            const itemsDTO = carrito.items.map(item => ({
                productoId: item.productoId,
                nombreProducto: diccionarioProductos[item.productoId] || `Producto #${item.productoId}`, // <--- NUEVO CAMPO
                cantidad: item.cantidad,
                precioUnitario: item.precioUnitario
            }));

            // Invocar ms-ordenes vía BFF
            await crearOrden(itemsDTO);

            alert("¡Compra procesada exitosamente! 🚀");
            
            // Redirigir al usuario al dashboard
            navigate('/dashboard');

        } catch (error) {
            console.error("Error al procesar la orden:", error);
            alert("Ocurrió un error al procesar tu orden. Inténtalo nuevamente.");
        } finally {
            setProcesandoCompra(false);
        }
    };

    if (cargando) return (
        <div className="cart-page-bg" style={{textAlign: 'center', padding: '50px'}}>
            <h2>Armando tu carrito... 🛒</h2>
        </div>
    );
    
    if (!carrito) return (
        <div className="cart-page-bg" style={{textAlign: 'center', padding: '50px'}}>
            <h2 style={{color: '#ff1053'}}>No se pudo cargar tu carrito. 😿</h2>
        </div>
    );

    const hayItems = carrito.items && carrito.items.length > 0;

    return (
        <div className="cart-page-bg">
            <div className="cart-container">
                
                <div className="cart-header">
                    <h2>Mi Carrito 🛍️</h2>
                    <Button variant="text" onClick={() => navigate('/dashboard')} style={{ color: '#3483fa', fontWeight: '600' }}>
                        ← Seguir explorando
                    </Button>
                </div>

                {!hayItems ? (
                    <div className="cart-empty-card">
                        <h3>Tu carrito está vacío 📦</h3>
                        <p>¡Explora nuestro catálogo y descubre productos increíbles!</p>
                        <Button onClick={() => navigate('/dashboard')} style={{ backgroundColor: '#3483fa', color: 'white', padding: '12px 30px', marginTop: '15px' }}>
                            Ir a Productos
                        </Button>
                    </div>
                ) : (
                    <div className="cart-layout">
                        
                        {/* Columna Izquierda: Lista de Productos */}
                        <div className="cart-items-section">
                            {carrito.items.map(item => (
                                <div key={item.id} className="cart-item-card">
                                    <div className="cart-item-info">
                                        <div className="cart-item-image-placeholder">
                                            <span>📷</span>
                                        </div>
                                        <div className="cart-item-details">
                                            <h4>{diccionarioProductos[item.productoId] || `Producto #${item.productoId}`}</h4>
                                            <p className="cart-item-ref">Ref: {item.productoId}</p>
                                            
                                            <div className="cart-item-actions">
                                                <button className="cart-item-delete" onClick={() => handleEliminarItem(item.productoId)}>
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="cart-item-pricing">
                                        <div className="cart-item-qty-box">
                                            Cantidad: <b>{item.cantidad}</b>
                                        </div>
                                        <div className="cart-item-price">
                                            {formatearDinero(item.subtotal)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            <div className="cart-empty-actions">
                                <Button variant="text" style={{ color: '#ff1053', fontWeight: 'bold' }} onClick={handleVaciarCarrito}>
                                    🗑️ Vaciar todo el carrito
                                </Button>
                            </div>
                        </div>

                        {/* Columna Derecha: Resumen de Compra */}
                        <div className="cart-summary-section">
                            <div className="cart-summary-card">
                                <h3>Resumen de compra</h3>
                                <hr className="summary-divider" />
                                
                                <div className="summary-row">
                                    <span>Productos ({carrito.items.reduce((acc, item) => acc + item.cantidad, 0)})</span>
                                    <span>{formatearDinero(carrito.total)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Envío</span>
                                    <span style={{ color: '#00a650', fontWeight: '600' }}>Gratis</span>
                                </div>
                                
                                <hr className="summary-divider" />
                                
                                <div className="summary-row total-row">
                                    <span>Total</span>
                                    <span>{formatearDinero(carrito.total)}</span>
                                </div>
                                
                                <Button 
                                    style={{ 
                                        backgroundColor: procesandoCompra ? '#ccc' : '#3483fa', 
                                        color: 'white', 
                                        width: '100%', 
                                        padding: '14px 0', 
                                        fontSize: '1.1rem', 
                                        borderRadius: '6px', 
                                        marginTop: '20px',
                                        cursor: procesandoCompra ? 'not-allowed' : 'pointer'
                                    }}
                                    disabled={procesandoCompra}
                                    onClick={handleProcesarCompra}
                                >
                                    {procesandoCompra ? 'Procesando compra...' : 'Continuar compra'}
                                </Button>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}