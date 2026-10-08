import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistorialOrdenes } from '../functions/apiService';
import { formatearDinero } from '../utils/formatCurrency';
import { ESTADOS_ORDEN } from '../constants/estadosOrden';
import './css/HistorialOrdenesPage.css';

export function HistorialOrdenesPage() {
    const navigate = useNavigate();
    const [ordenes, setOrdenes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        cargarHistorial();
    }, []);

    const cargarHistorial = async () => {
        try {
            const res = await getHistorialOrdenes();
            setOrdenes(res.data);
        } catch (err) {
            console.error("Error al cargar el historial de órdenes", err);
            setError("No se pudo obtener el historial de compras.");
        } finally {
            setCargando(false);
        }
    };

    const renderEstadoBadge = (estadoRaw) => {
        const estadoKey = estadoRaw ? estadoRaw.toUpperCase() : 'PROCESADO';
        const config = ESTADOS_ORDEN[estadoKey] || {
            label: estadoRaw || 'Desconocido',
            color: '#4b5563',
            bg: '#f3f4f6',
            icon: '📌'
        };

        return (
            <span
                className="status-badge"
                style={{ backgroundColor: config.bg, color: config.color }}
            >
                <span className="status-dot" style={{ backgroundColor: config.color }} />
                <span className="status-icon">{config.icon}</span>
                <span className="status-text">{config.label}</span>
            </span>
        );
    };

    if (cargando) return <p className="historial__loading">Buscando tus registros... ⏳</p>;
    if (error) return <p className="historial__error">{error}</p>;

    return (
        <div className="historial">
            <div className="historial__header">
                <h1 className="historial__title">Historial de Compras 📦</h1>
            </div>

            {ordenes.length === 0 ? (
                <p className="historial__empty">Aún no tienes compras registradas.</p>
            ) : (
                <div className="historial__grid">
                    {ordenes.map(orden => (
                        <div
                            key={orden.id}
                            className="historial__card historial__card--clickable"
                            onClick={() => navigate(`/ordenes/${orden.id}`)}
                        >
                            <div className="historial__card-header">
                                <h3>Orden #{orden.id}</h3>
                                {renderEstadoBadge(orden.estado)}
                            </div>
                            <p><strong>Fecha:</strong> {new Date(orden.fechaCreacion).toLocaleDateString('es-CL')}</p>
                            <p><strong>Total:</strong> {formatearDinero(orden.total)}</p>
                            <hr />
                            <div className="historial__items">
                                <h4>Artículos:</h4>
                                <ul>
                                    {(orden.detalles || orden.items)?.map((item, index) => {
                                        const nombre = item.nombreProducto || item.nombre || `Producto #${item.productoId}`;
                                        return (
                                            <li key={item.id || index}>
                                                <strong>{item.cantidad}x</strong> {nombre} - {formatearDinero(item.precioUnitario)}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}