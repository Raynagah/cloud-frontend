import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getMe } from '../functions/apiService';

// Protege una ruta consultando el rol REAL al servidor (GET /usuarios/me), no a localStorage.
// Es una mejora de UX: la autorización de verdad la imponen ms-usuarios y ms-analytics.
export function AdminRoute({ children }) {
    const [estado, setEstado] = useState('verificando'); // verificando | ok | denegado

    useEffect(() => {
        let activo = true;
        getMe()
            .then((res) => activo && setEstado(res.data?.tipoUsuario === 'admin' ? 'ok' : 'denegado'))
            .catch(() => activo && setEstado('denegado'));
        return () => { activo = false; };
    }, []);

    if (estado === 'verificando') return <p style={{ padding: '2rem' }}>Verificando permisos…</p>;
    return estado === 'ok' ? children : <Navigate to="/dashboard" replace />;
}
