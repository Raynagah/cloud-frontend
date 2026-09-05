import React from 'react';

export function PerfilPage() {
    const backendDataStr = localStorage.getItem('backendData');
    const backendData = backendDataStr ? JSON.parse(backendDataStr) : null;

    if (!backendData) return <p>Sesión inválida.</p>;
    const { usuario, token } = backendData;

    return (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2>Mi Perfil 👤</h2>
            <p>Bienvenido, aquí puedes ver tu información registrada.</p>
            
            <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                <li><strong>Nombre:</strong> {usuario.nombre}</li>
                <li><strong>Correo:</strong> {usuario.correo}</li>
                <li><strong>Ocupación:</strong> {usuario.ocupacion}</li>
                <li><strong>Rol:</strong> {usuario.tipoUsuario}</li>
            </ul>

            <div style={{ marginTop: '20px' }}>
                <h4>Tu Token JWT (Para pruebas):</h4>
                <textarea readOnly value={token} rows={4} style={{ width: '100%', fontFamily: 'monospace', fontSize: '11px', padding: '8px', backgroundColor: '#f8f9fa' }} />
            </div>
        </div>
    );
}