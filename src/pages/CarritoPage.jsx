import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCarrito, vaciarCarritoBackend, eliminarItemCarrito, getProductos } from '../functions/apiService';
import { Button } from '../atoms/Button';
import './css/CarritoPage.css'; 

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
            const [resCarrito, resProductos] = await Promise.all([
                getCarrito(token),
                getProductos(token)
            ]);

            if (resProductos.ok) {
                const dataProductos = await resProductos.json();
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
        if (!window.confirm("¿Estás seguro de que deseas vaciar todo tu botín?")) return;
        
        try {
            const res = await vaciarCarritoBackend(backendData.token);
            if (res.ok || res.status === 204) {
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
                setCarrito(carritoActualizado);
            } else {
                alert("No se pudo eliminar el ítem");
            }
        } catch (error) {
            console.error("Error eliminando ítem:", error);
        }
    };

    if (cargando) return (
        <div className="cart-page" style={{textAlign: 'center', padding: '50px'}}>
            <h2>Armando tu carrito... 🛒</h2>
        </div>
    );
    
    if (!carrito) return (
        <div className="cart-page" style={{textAlign: 'center', padding: '50px'}}>
            <h2 style={{color: '#ff1053'}}>No se pudo cargar tu carrito. 😿</h2>
        </div>
    );

    const hayItems = carrito.items && carrito.items.length > 0;

    return (
        <div className="cart-page">
            
            <div className="cart-page__header">
                <h2 className="cart-page__title">Mi Carrito 🛍️</h2>
                <Button 
                    variant="text" 
                    onClick={() => navigate('/dashboard')}
                    style={{ color: '#7a28cb', fontWeight: 'bold' }}
                >
                    ← Seguir explorando
                </Button>
            </div>

            {!hayItems ? (
                <div className="cart-page__empty">
                    <h3 style={{ color: '#1a1525', margin: '0 0 10px 0' }}>Tu inventario está vacío 📦</h3>
                    <p style={{ color: '#888', marginBottom: '25px' }}>¡Explora nuestro catálogo y descubre Funkos increíbles!</p>
                    <Button 
                        onClick={() => navigate('/dashboard')}
                        style={{ backgroundColor: '#7a28cb', color: 'white', padding: '12px 30px' }}
                    >
                        Ir a Productos
                    </Button>
                </div>
            ) : (
                <div className="cart-page__content">
                    
                    {/* Encabezados alineados con las clases de columnas */}
                    <div className="cart-page__list-header">
                        <div className="col-product">Producto</div>
                        <div className="col-price">Precio Un.</div>
                        <div className="col-qty">Cantidad</div>
                        <div className="col-subtotal">Subtotal</div>
                        <div className="col-action">Acción</div>
                    </div>

                    {/* Lista de Items */}
                    <div className="cart-page__list-body">
                        {carrito.items.map(item => (
                            <div key={item.id} className="cart-page__item">
                                
                                <div className="col-product">
                                    <h4 className="cart-item__title">
                                        {diccionarioProductos[item.productoId] || `Producto #${item.productoId}`}
                                    </h4>
                                    <p className="cart-item__id">Ref: {item.productoId}</p>
                                </div>
                                
                                <div className="col-price cart-item__price">
                                    ${item.precioUnitario}
                                </div>
                                
                                <div className="col-qty cart-item__qty">
                                    {item.cantidad}
                                </div>
                                
                                <div className="col-subtotal cart-item__subtotal">
                                    ${item.subtotal}
                                </div>
                                
                                <div className="col-action">
                                    <Button 
                                        variant="text" 
                                        style={{ color: '#ff1053', padding: '5px 10px', fontSize: '0.9rem' }} 
                                        onClick={() => handleEliminarItem(item.productoId)}
                                        title="Quitar del carrito"
                                    >
                                        ✖ Quitar
                                    </Button>
                                </div>

                            </div>
                        ))}
                    </div>

                    {/* Resumen Final */}
                    <div className="cart-page__summary">
                        <Button 
                            variant="text" 
                            style={{ color: '#ff1053', padding: '10px 0', fontSize: '0.95rem', fontWeight: 'bold' }} 
                            onClick={handleVaciarCarrito}
                        >
                            🗑️ Vaciar inventario
                        </Button>

                        <div className="cart-page__total-box">
                            <span className="cart-page__total-label">Total a Pagar</span>
                            <h3 className="cart-page__total-value">${carrito.total}</h3>
                            
                            <Button 
                                style={{ backgroundColor: '#7a28cb', color: 'white', padding: '14px 45px', fontSize: '1.05rem', borderRadius: '8px' }}
                                onClick={() => alert("¡Módulo de pago en construcción! 🚀")}
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