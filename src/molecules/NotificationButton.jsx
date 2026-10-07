import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotificaciones, marcarNotificacionLeida } from '../functions/apiService';
import './css/NotificationButton.css';

export function NotificationButton() {
    const [notificaciones, setNotificaciones] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const cargarNotificaciones = async () => {
        try {
            const res = await getNotificaciones();
            setNotificaciones(res.data || []);
        } catch (error) {
            console.error('Error al cargar notificaciones en navbar', error);
        }
    };

    useEffect(() => {
        cargarNotificaciones();
        const interval = setInterval(cargarNotificaciones, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const sinLeerCount = notificaciones.filter(n => !n.leido).length;

    const handleMarcarLeida = async (e, id) => {
        e.stopPropagation();
        try {
            await marcarNotificacionLeida(id);
            setNotificaciones(prev =>
                prev.map(n => n.id === id ? { ...n, leido: true } : n)
            );
        } catch (error) {
            console.error('Error al marcar como leída', error);
        }
    };

    const handleVerTodas = () => {
        setIsOpen(false);
        navigate('/notificaciones');
    };

    // Limpia las líneas divisoras y deja un resumen en una sola línea
    const obtenerResumenMensaje = (mensaje) => {
        if (!mensaje) return '';
        return mensaje
            .replace(/-{3,}/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    };

    return (
        <div className="notif-dropdown" ref={dropdownRef}>
            <button
                className={`notif-btn ${isOpen ? 'notif-btn--active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Notificaciones"
            >
                <span className="notif-btn__icon">🔔</span>
                {sinLeerCount > 0 && (
                    <span className="notif-btn__badge">
                        {sinLeerCount > 9 ? '9+' : sinLeerCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="notif-menu">
                    <div className="notif-menu__header">
                        <span className="notif-menu__title">Notificaciones</span>
                        {sinLeerCount > 0 ? (
                            <span className="notif-menu__unread-tag">{sinLeerCount} sin leer</span>
                        ) : (
                            <span className="notif-menu__all-read">Al día ✓</span>
                        )}
                    </div>

                    <div className="notif-menu__body">
                        {notificaciones.length === 0 ? (
                            <div className="notif-menu__empty">
                                <span>📬</span>
                                <p>Sin notificaciones recientes</p>
                            </div>
                        ) : (
                            notificaciones.slice(0, 5).map((notif) => (
                                <div
                                    key={notif.id}
                                    className={`notif-item ${!notif.leido ? 'notif-item--unread' : ''}`}
                                    onClick={handleVerTodas}
                                >
                                    <div className="notif-item__content">
                                        <strong className="notif-item__title">{notif.titulo}</strong>
                                        <p className="notif-item__message">
                                            {obtenerResumenMensaje(notif.mensaje)}
                                        </p>
                                        <time className="notif-item__date">
                                            {new Date(notif.fechaCreacion).toLocaleString('es-CL', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </time>
                                    </div>
                                    {!notif.leido && (
                                        <button
                                            className="notif-item__read-btn"
                                            title="Marcar como vista"
                                            onClick={(e) => handleMarcarLeida(e, notif.id)}
                                        >
                                            ✓
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    <div className="notif-menu__footer">
                        <button onClick={handleVerTodas} className="notif-menu__see-all">
                            Ver todo el historial →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}