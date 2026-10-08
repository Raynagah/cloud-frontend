import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrdenById } from '../functions/apiService';
import { Button } from '../atoms/Button';
import { formatearDinero } from '../utils/formatCurrency';
import { ESTADOS_ORDEN, PASOS_SECUENCIA } from '../constants/estadosOrden';
import './css/DetalleOrdenPage.css';

export function DetalleOrdenPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [orden, setOrden] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const cargarDetalleOrden = useCallback(async (silencioso = false) => {
        if (!silencioso) setCargando(true);
        try {
            const res = await getOrdenById(id);
            setOrden(res.data);
            setError(null);
        } catch (err) {
            console.error("Error al cargar detalle de la orden:", err);
            setError("No se pudo cargar la orden. Inténtalo nuevamente.");
        } finally {
            if (!silencioso) setCargando(false);
        }
    }, [id]);

    useEffect(() => {
        cargarDetalleOrden();

        // Polling cada 10s para refrescar el stepper si no es un estado final
        const interval = setInterval(() => {
            if (orden && orden.estado !== 'ENTREGADO' && orden.estado !== 'CANCELADO') {
                cargarDetalleOrden(true);
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [cargarDetalleOrden, orden?.estado]);

    if (cargando) return <p className="detalle-orden__loading">Cargando estado del envío... ⌛</p>;

    if (error || !orden) return (
        <div className="detalle-orden__container">
            <h2>{error || "Orden no encontrada 🔍"}</h2>
            <Button onClick={() => navigate('/mis-ordenes')}>Volver al historial</Button>
        </div>
    );

    const esCancelado = orden.estado === 'CANCELADO';
    const estadoInfo = ESTADOS_ORDEN[orden.estado] || ESTADOS_ORDEN.PROCESADO;
    const indiceEstadoActual = estadoInfo.pasoIndex;

    return (
        <div className="detalle-orden__bg">
            <div className="detalle-orden__container">
                <Button variant="text" onClick={() => navigate('/mis-ordenes')} className="btn-volver">
                    ← Volver al historial
                </Button>

                <div className="detalle-orden__header">
                    <h2>Seguimiento de Orden #{orden.id}</h2>
                    <span className="detalle-orden__fecha">
                        Fecha de compra: {new Date(orden.fechaCreacion).toLocaleDateString('es-CL')}
                    </span>
                </div>

                <div className="stepper-card">
                    <h3>Estado del Envío</h3>

                    {esCancelado ? (
                        <div className="cancelado-banner">
                            ❌ Esta orden ha sido <strong>CANCELADA</strong>.
                        </div>
                    ) : (
                        <div className="stepper-wrapper">
                            {PASOS_SECUENCIA.map((paso, index) => {
                                const completado = index <= indiceEstadoActual;
                                const activo = index === indiceEstadoActual;

                                return (
                                    <div 
                                        key={paso.key} 
                                        className={`step-item ${completado ? 'completed' : ''} ${activo ? 'active' : ''}`}
                                    >
                                        <div className="step-node">
                                            <span className="step-icon">{paso.icon}</span>
                                        </div>
                                        <p className="step-label">{paso.label}</p>
                                        {index < PASOS_SECUENCIA.length - 1 && (
                                            <div className={`step-line ${index < indiceEstadoActual ? 'filled' : ''}`} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="detalle-orden__items-card">
                    <h3>Productos en esta orden</h3>
                    <div className="items-list">
                        {(orden.detalles || orden.items)?.map((item, index) => (
                            <div key={item.id || index} className="item-row">
                                <div className="item-info">
                                    <span className="item-qty">{item.cantidad}x</span>
                                    <span className="item-name">
                                        {item.nombreProducto || item.nombre || `Producto #${item.productoId}`}
                                    </span>
                                </div>
                                <span className="item-price">
                                    {formatearDinero((item.precioUnitario || 0) * item.cantidad)}
                                </span>
                            </div>
                        ))}
                    </div>

                    <hr className="divider" />

                    <div className="total-row">
                        <span>Total pagado:</span>
                        <span className="total-monto">{formatearDinero(orden.total)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}