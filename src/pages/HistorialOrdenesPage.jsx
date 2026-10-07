import React, { useEffect, useState } from 'react';
import { getHistorialOrdenes } from '../functions/apiService';
import './css/HistorialOrdenesPage.css';
import { useNavigate } from 'react-router-dom';

// Configuración de estados mapeada a EstadoDespacho + PROCESADO
const CONFIG_ESTADOS = {
    PROCESADO: { label: 'Procesado', color: '#2563eb', bg: '#dbeafe', icon: '⚙️' },
    EN_PREPARACION: { label: 'En Preparación', color: '#d97706', bg: '#fef3c7', icon: '📦' },
    EN_TRANSITO: { label: 'En Tránsito', color: '#7c3aed', bg: '#ede9fe', icon: '🚚' },
    ENTREGADO: { label: 'Entregado', color: '#16a34a', bg: '#dcfce7', icon: '✅' },
    CANCELADO: { label: 'Cancelado', color: '#dc2626', bg: '#fee2e2', icon: '❌' }
};

export function HistorialOrdenesPage() {
    const navigate = useNavigate();
    const backendDataStr = localStorage.getItem('backendData');
    const backendData = backendDataStr ? JSON.parse(backendDataStr) : null;

    const [ordenes, setOrdenes] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        if (backendData) {
            cargarHistorial();
        } else {
            setCargando(false);
        }
    }, [backendData]);

    const cargarHistorial = async () => {
        try {
            const res = await getHistorialOrdenes();
            setOrdenes(res.data);
        } catch (error) {
            console.error("Error al cargar el historial de órdenes", error);
        } finally {
            setCargando(false);
        }
    };

    const renderEstadoBadge = (estadoRaw) => {
        const estadoKey = estadoRaw ? estadoRaw.toUpperCase() : 'PROCESADO';
        const config = CONFIG_ESTADOS[estadoKey] || {
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
                <span
                    className="status-dot"
                    style={{ backgroundColor: config.color }}
                />
                <span className="status-icon">{config.icon}</span>
                <span className="status-text">{config.label}</span>
            </span>
        );
    };

    if (!backendData) return <p className="historial__error">Debes iniciar sesión para ver tus compras.</p>;

    return (
        <div className="historial">
            <div className="historial__header">
                <h1 className="historial__title">Historial de Compras 📦</h1>
            </div>

            {cargando ? (
                <p className="historial__loading">Buscando tus registros... ⏳</p>
            ) : ordenes.length === 0 ? (
                <p className="historial__empty">Aún no tienes compras registradas.</p>
            ) : (
                <div className="historial__grid">
                    {ordenes.map(orden => (
                        <div
                            key={orden.id}
                            className="historial__card historial__card--clickable"
                            onClick={() => navigate(`/ordenes/${orden.id}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="historial__card-header">
                                <h3>Orden #{orden.id}</h3>
                                {renderEstadoBadge(orden.estado)}
                            </div>
                            <p><strong>Fecha:</strong> {new Date(orden.fechaCreacion).toLocaleDateString()}</p>
                            <p><strong>Total:</strong> ${orden.total}</p>
                            <hr />
                            <div className="historial__items">
                                <h4>Artículos:</h4>
                                <ul>
                                    {(orden.detalles || orden.items)?.map((item, index) => {
                                        const nombre = item.nombreProducto
                                            || item.nombre
                                            || `Producto #${item.productoId}`;

                                        return (
                                            <li key={index}>
                                                <strong>{item.cantidad}x</strong> {nombre} - ${item.precioUnitario}
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