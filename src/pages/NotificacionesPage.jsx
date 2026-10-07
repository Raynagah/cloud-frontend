import React, { useEffect, useState } from 'react';
import { getNotificaciones, marcarNotificacionLeida, eliminarNotificacion } from '../functions/apiService';
import './css/NotificacionesPage.css';

export function NotificacionesPage() {
    const [notificaciones, setNotificaciones] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [filtro, setFiltro] = useState('TODAS'); // 'TODAS' | 'NO_LEIDAS'

    useEffect(() => {
        cargarHistorial();
    }, []);

    const cargarHistorial = async () => {
        try {
            const res = await getNotificaciones();
            setNotificaciones(res.data || []);
        } catch (error) {
            console.error("Error al obtener notificaciones", error);
        } finally {
            setCargando(false);
        }
    };

    const handleMarcarLeida = async (id) => {
        try {
            await marcarNotificacionLeida(id);
            setNotificaciones(prev =>
                prev.map(n => n.id === id ? { ...n, leido: true } : n)
            );
        } catch (error) {
            console.error("Error al marcar notificación", error);
        }
    };

    const handleEliminar = async (id) => {
        try {
            await eliminarNotificacion(id);
            setNotificaciones(prev => prev.filter(n => n.id !== id));
        } catch (error) {
            console.error("Error al eliminar notificación", error);
        }
    };

    const notificacionesFiltradas = notificaciones.filter(n => {
        if (filtro === 'NO_LEIDAS') return !n.leido;
        return true;
    });

    // Limpia y le da formato visual a los mensajes estructurados
    const formatearMensaje = (mensaje) => {
        if (!mensaje) return null;
        return mensaje
            .replace(/-{5,}/g, '\n---\n') // Convierte cadenas de guiones largas en un separador limpio
            .split('\n')
            .map((linea, index) => {
                if (linea.trim() === '---') {
                    return <hr key={index} className="notif-card__divider" />;
                }
                if (!linea.trim()) return null;
                return <p key={index} className="notif-card__line">{linea}</p>;
            });
    };

    return (
        <div className="notificaciones-page">
            <header className="notificaciones-page__header">
                <div className="notificaciones-page__title-group">
                    <h1 className="notificaciones-page__title">Centro de Notificaciones</h1>
                    <span className="notificaciones-page__badge">🔔 {notificaciones.length}</span>
                </div>
                
                <div className="notificaciones-page__filters">
                    <button 
                        className={`filter-btn ${filtro === 'TODAS' ? 'filter-btn--active' : ''}`}
                        onClick={() => setFiltro('TODAS')}
                    >
                        Todas ({notificaciones.length})
                    </button>
                    <button 
                        className={`filter-btn ${filtro === 'NO_LEIDAS' ? 'filter-btn--active' : ''}`}
                        onClick={() => setFiltro('NO_LEIDAS')}
                    >
                        Sin leer ({notificaciones.filter(n => !n.leido).length})
                    </button>
                </div>
            </header>

            {cargando ? (
                <div className="notificaciones-page__loading">
                    <span className="spinner">⏳</span>
                    <p>Cargando tus notificaciones...</p>
                </div>
            ) : notificacionesFiltradas.length === 0 ? (
                <div className="notificaciones-page__empty">
                    <div className="empty-icon">📬</div>
                    <h3>No tienes notificaciones en esta sección</h3>
                    <p>Te avisaremos cuando haya actualizaciones sobre tus compras o cuenta.</p>
                </div>
            ) : (
                <div className="notificaciones-page__list">
                    {notificacionesFiltradas.map((notif) => (
                        <article 
                            key={notif.id} 
                            className={`notif-card ${!notif.leido ? 'notif-card--unread' : ''}`}
                        >
                            <div className="notif-card__status-indicator" />
                            <div className="notif-card__body">
                                <div className="notif-card__top">
                                    <h3 className="notif-card__title">{notif.titulo}</h3>
                                    <time className="notif-card__date">
                                        {new Date(notif.fechaCreacion).toLocaleString('es-CL', {
                                            dateStyle: 'medium',
                                            timeStyle: 'short'
                                        })}
                                    </time>
                                </div>
                                
                                <div className="notif-card__message">
                                    {formatearMensaje(notif.mensaje)}
                                </div>
                                
                                <footer className="notif-card__actions">
                                    {!notif.leido && (
                                        <button 
                                            className="action-btn action-btn--read"
                                            onClick={() => handleMarcarLeida(notif.id)}
                                        >
                                            ✓ Marcar como vista
                                        </button>
                                    )}
                                    <button 
                                        className="action-btn action-btn--delete"
                                        onClick={() => handleEliminar(notif.id)}
                                    >
                                        🗑 Eliminar
                                    </button>
                                </footer>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}