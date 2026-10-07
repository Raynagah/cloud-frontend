import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrdenById } from '../functions/apiService';
import { Button } from '../atoms/Button';
import { formatearDinero } from '../utils/formatCurrency';
import './css/DetalleOrdenPage.css';

// Secuencia cronológica del despacho
const PASOS_SECUENCIA = [
    { key: 'PROCESADO',      label: 'Orden Procesada', icon: '📝' },
    { key: 'EN_PREPARACION', label: 'En Preparación', icon: '📦' },
    { key: 'EN_TRANSITO',    label: 'En Tránsito',    icon: '🚚' },
    { key: 'ENTREGADO',      label: 'Entregado',      icon: '✅' }
];

export function DetalleOrdenPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [orden, setOrden] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        cargarDetalleOrden();
    }, [id]);

    const cargarDetalleOrden = async () => {
        try {
            const res = await getOrdenById(id);
            setOrden(res.data);
        } catch (error) {
            console.error("Error al cargar detalle de la orden:", error);
        } finally {
            setCargando(false);
        }
    };

    if (cargando) return <p className="detalle-orden__loading">Cargando estado del envío... ⌛</p>;
    if (!orden) return (
        <div className="detalle-orden__container">
            <h2>Orden no encontrada 🔍</h2>
            <Button onClick={() => navigate('/mis-ordenes')}>Volver al historial</Button>
        </div>
    );

    const esCancelado = orden.estado === 'CANCELADO';

    // Determinar índice actual en la secuencia (0 = PROCESADO, 1 = EN_PREPARACION, etc.)
    const indiceEstadoActual = PASOS_SECUENCIA.findIndex(
        step => step.key === (orden.estado || 'PROCESADO')
    );

    return (
        <div className="detalle-orden__bg">
            <div className="detalle-orden__container">
                <Button variant="text" onClick={() => navigate('/mis-ordenes')} className="btn-volver">
                    ← Volver al historial
                </Button>

                <div className="detalle-orden__header">
                    <h2>Seguimiento de Orden #{orden.id}</h2>
                    <span className="detalle-orden__fecha">
                        Fecha de compra: {new Date(orden.fechaCreacion).toLocaleDateString()}
                    </span>
                </div>

                {/* --- BARRA DE PROGRESO / STEPPER --- */}
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

                {/* --- DETALLE DE ARTÍCULOS --- */}
                <div className="detalle-orden__items-card">
                    <h3>Productos en esta orden</h3>
                    <div className="items-list">
                        {(orden.detalles || orden.items)?.map((item, index) => (
                            <div key={index} className="item-row">
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