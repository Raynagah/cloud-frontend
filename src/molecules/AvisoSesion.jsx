
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export function AvisoSesion() {
    const [visible, setVisible] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const mostrarAviso = () => {
            setVisible(true);
        };

        window.addEventListener(
            'pedidos360:sesion-requerida',
            mostrarAviso
        );

        return () => {
            window.removeEventListener(
                'pedidos360:sesion-requerida',
                mostrarAviso
            );
        };
    }, []);

    useEffect(() => {
        if (location.pathname === '/') {
            setVisible(false);
        }
    }, [location.pathname]);

    if (
        !visible ||
        location.pathname === '/' ||
        location.pathname === '/registro'
    ) {
        return null;
    }

    return (
        <div style={{
            padding: '15px',
            backgroundColor: '#fff3cd',
            color: '#664d03',
            textAlign: 'center'
        }}>
            Tu sesión necesita una nueva autorización de Microsoft.

            {location.pathname === '/callback' && (
                <p>
                    Verifica el estado de tu pago antes de
                    intentar comprar nuevamente.
                </p>
            )}

            <Link
                to="/"
                style={{
                    marginLeft: '12px',
                    fontWeight: 'bold',
                    color: '#664d03'
                }}
            >
                Autorizar sesión
            </Link>
        </div>
    );
}
