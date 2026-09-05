import React from 'react';
import { LoginButton } from '../molecules/LoginButton';

export function DashboardPage() {
    const backendDataStr = localStorage.getItem('backendData');
    const backendData = backendDataStr ? JSON.parse(backendDataStr) : null;

    if (!backendData) {
        return <p style={{ textAlign: 'center', marginTop: '40px' }}>No hay datos de sesión local. Por favor inicia sesión de nuevo.</p>;
    }

    const { usuario, token } = backendData;

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', backgroundColor: '#e7f4e4', border: '1px solid #107c10', borderRadius: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ color: '#107c10', margin: 0 }}>¡Dashboard Principal! ✅</h3>
                <LoginButton /> {/* Esto renderizará el botón de Cerrar Sesión automáticamente */}
            </div>
            <p>Bienvenido a la aplicación, tu cuenta está verificada.</p>
            
            <div style={{ background: 'white', padding: '15px', borderRadius: '4px', marginTop: '15px' }}>
                <strong>Tus Datos:</strong>
                <ul style={{ paddingLeft: '20px' }}>
                    <li>ID: {usuario.id}</li>
                    <li>Nombre: {usuario.nombre}</li>
                    <li>Rol: {usuario.tipoUsuario}</li>
                    <li>Ocupación: {usuario.ocupacion}</li>
                </ul>
            </div>

            <div style={{ marginTop: '15px' }}>
                <h4>Token JWT Activo:</h4>
                <textarea readOnly value={token} rows={4} style={{ width: '100%', fontFamily: 'monospace', fontSize: '11px', padding: '8px' }} />
            </div>
        </div>
    );
}