import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { confirmarPagoWebpay, vaciarCarritoBackend, crearOrden, getCarrito } from '../functions/apiService';
import { Button } from '../atoms/Button';
import './css/CarritoPage.css';

export function CallbackWebpayPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [estadoPago, setEstadoPago] = useState('procesando');
    const [mensaje, setMensaje] = useState('Validando tu pago con el banco...');
    const yaProcesado = useRef(false);

    useEffect(() => {
        if (yaProcesado.current) return;
        yaProcesado.current = true;

        const confirmarTransaccion = async () => {
            try {
                const searchParams = new URLSearchParams(location.search);
                const tokenWs = searchParams.get('token_ws');
                const tbkToken = searchParams.get('TBK_TOKEN');

                if (tbkToken) {
                    setEstadoPago('error');
                    setMensaje('Cancelaste la compra en Webpay.');
                    return;
                }

                if (!tokenWs) {
                    setEstadoPago('error');
                    setMensaje('No se recibió el token de confirmación de Transbank.');
                    return;
                }

                const response = await confirmarPagoWebpay(tokenWs);
                
                if (response.data && response.data.status === 'AUTHORIZED') {
                    setEstadoPago('exito');
                    setMensaje('¡Pago aprobado exitosamente! Procesando tu orden...');
                    
                    const resCarrito = await getCarrito();
                    const itemsCarrito = resCarrito.data.items || [];
                    
                    if (itemsCarrito.length > 0) {
                        const itemsDTO = itemsCarrito.map(item => ({
                            productoId: item.productoId,
                            nombreProducto: `Producto #${item.productoId}`,
                            cantidad: item.cantidad,
                            precioUnitario: item.precioUnitario
                        }));
                        await crearOrden(itemsDTO);
                    }

                    await vaciarCarritoBackend();
                    
                    setTimeout(() => {
                        navigate('/mis-ordenes');
                    }, 2500);
                } else {
                    throw new Error("Pago rechazado");
                }
            } catch (error) {
                console.error("Error confirmando pago:", error);
                setEstadoPago('error');
                setMensaje('El pago fue rechazado por el banco o hubo un error de conexión.');
            }
        };

        confirmarTransaccion();
    }, [location, navigate]);

    return (
        <div className="cart-page-bg" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <div className="cart-summary-card" style={{ textAlign: 'center', padding: '40px', maxWidth: '500px' }}>
                {estadoPago === 'procesando' && (
                    <>
                        <h2>⏳ Un momento...</h2>
                        <p>{mensaje}</p>
                    </>
                )}
                {estadoPago === 'exito' && (
                    <>
                        <h2 style={{ color: '#00a650' }}>✅ ¡Pago Exitoso!</h2>
                        <p>{mensaje}</p>
                    </>
                )}
                {estadoPago === 'error' && (
                    <>
                        <h2 style={{ color: '#dc2626' }}>❌ Error en el pago</h2>
                        <p>{mensaje}</p>
                        <Button 
                            style={{ backgroundColor: '#3483fa', marginTop: '20px', color: 'white', width: '100%' }}
                            onClick={() => navigate('/carrito')}
                        >
                            Volver al Carrito
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}