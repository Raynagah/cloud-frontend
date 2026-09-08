import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductoById, agregarItemCarrito } from '../functions/apiService';
import { Button } from '../atoms/Button';
import { formatarDinero } from '../utils/formatCurrency';
import './css/ProductoDetallePage.css'; 

export function ProductoDetallePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const backendDataStr = localStorage.getItem('backendData');
    const backendData = backendDataStr ? JSON.parse(backendDataStr) : null;
    
    const [producto, setProducto] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [cantidad, setCantidad] = useState(1);
    const [procesando, setProcesando] = useState(false);

    // Placeholder para productos sin imagen
    const imagenPorDefecto = "https://via.placeholder.com/450x450/f4f0fa/7a28cb?text=Sin+Imagen";

    useEffect(() => {
        if (backendData) {
            cargarProductoDetalle(); // 1. Ya no pasamos el token
        }
    }, [id]);

    const cargarProductoDetalle = async () => {
        try {
            // 2. Usamos Axios. Si falla (ej. 404 No encontrado), salta al catch
            const res = await getProductoById(id);
            
            // 3. Axios ya procesó el JSON en res.data
            setProducto(res.data);
            setCantidad(res.data.stock > 0 ? 1 : 0);
            
        } catch (err) {
            console.error("Error al cargar producto:", err);
        } finally {
            setCargando(false);
        }
    };

    const sumarCantidad = () => {
        if (cantidad < producto.stock) setCantidad(cantidad + 1);
    };

    const restarCantidad = () => {
        if (cantidad > 1) setCantidad(cantidad - 1);
    };

    const handleAgregarCarrito = async (redirigirAlCarrito) => {
        // 4. Verificamos que el usuario esté logueado, pero ya no necesitamos sacar su token explícitamente
        if (!backendData || cantidad <= 0) return;

        setProcesando(true);
        try {
            // 5. Quitamos el token de los parámetros. El interceptor lo inyecta por detrás
            await agregarItemCarrito(
                producto.id, 
                cantidad, 
                producto.precio
            );

            // 6. Si Axios no lanzó error, asumimos que fue exitoso (código 2xx)
            setProducto(prev => ({ ...prev, stock: prev.stock - cantidad }));
            setCantidad(1); 

            if (redirigirAlCarrito) {
                navigate('/carrito'); 
            } else {
                alert("¡Producto agregado al carrito con éxito!");
            }
            
        } catch (error) {
            console.error("Error agregando al carrito:", error);
            alert("Error de conexión al agregar al carrito.");
        } finally {
            setProcesando(false);
        }
    };

    if (cargando) return (
        <div className="product-detail-page" style={{textAlign: 'center', padding: '50px'}}>
            <h2>Cargando información del producto... 📦</h2>
        </div>
    );
    
    if (!producto) return (
        <div className="product-detail-page" style={{textAlign: 'center', padding: '50px'}}>
            <h2>Producto no encontrado. 🕵️‍♂️</h2>
        </div>
    );

    const agotado = producto.stock === 0;

    return (
        <div className="product-detail-page">
            
            <Button 
                onClick={() => navigate(-1)} 
                variant="text" 
                style={{ marginBottom: '20px', color: '#7a28cb', fontSize: '1rem' }}
            >
                ← Volver al catálogo
            </Button>
            
            <div className="product-detail__card">
                
                {/* LADO IZQUIERDO: Imagen */}
                <div className="product-detail__image-wrapper">
                    <img 
                        src={producto.imagenUrl || imagenPorDefecto} 
                        alt={producto.nombre} 
                        className="product-detail__image"
                    />
                </div>

                {/* LADO DERECHO: Detalles */}
                <div className="product-detail__info">
                    <h2 className="product-detail__title">{producto.nombre}</h2>
                    <p className="product-detail__description">{producto.descripcion}</p>
                    
                    <div className="product-detail__price-box">
                        <span className="product-detail__price">
                            {formatearDinero(producto.precio)} {/* <-- Precio unitario */}
                        </span>
                        <div className="product-detail__stock">
                            Disponibles: 
                            <strong className={agotado ? "out-of-stock" : ""}>
                                {producto.stock} unidades
                            </strong>
                        </div>
                    </div>

                    <div className="product-detail__quantity-section">
                        <span className="product-detail__quantity-label">Cantidad:</span>
                        
                        <div className="product-detail__quantity-controls">
                            <Button 
                                onClick={restarCantidad} 
                                variant="text" 
                                style={{ padding: '5px 15px', fontSize: '20px', color: '#2b2b2b' }}
                                disabled={cantidad <= 1 || agotado}
                            >
                                -
                            </Button>
                            <span className="product-detail__quantity-val">{cantidad}</span>
                            <Button 
                                onClick={sumarCantidad} 
                                variant="text" 
                                style={{ padding: '5px 15px', fontSize: '20px', color: '#2b2b2b' }}
                                disabled={cantidad >= producto.stock || agotado}
                            >
                                +
                            </Button>
                        </div>
                        
                        {!agotado && (
                            <span className="product-detail__subtotal">
                                (Subtotal: {formatearDinero(producto.precio * cantidad)}) {/* <-- Subtotal dinámico */}
                            </span>
                        )}
                    </div>

                    <div className="product-detail__actions">
                        <Button 
                            style={{ flex: 1, fontSize: '1rem', backgroundColor: '#1a1525', color: 'white' }} 
                            onClick={() => handleAgregarCarrito(false)}
                            disabled={procesando || agotado}
                        >
                            {procesando ? 'Agregando...' : 'Agregar al carrito 🛒'}
                        </Button>
                        
                        <Button 
                            style={{ flex: 1, fontSize: '1rem', backgroundColor: '#7a28cb', color: 'white' }} 
                            onClick={() => handleAgregarCarrito(true)}
                            disabled={procesando || agotado}
                        >
                            Comprar ahora 🛍️
                        </Button>
                    </div>
                    
                    {agotado && (
                        <div className="product-detail__alert">
                            Lo sentimos, este producto se encuentra agotado temporalmente.
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}