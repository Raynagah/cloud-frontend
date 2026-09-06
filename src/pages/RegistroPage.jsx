// src/pages/RegistroPage.jsx
import React, { useState } from 'react';
import { useMsal } from "@azure/msal-react";
import { useNavigate } from 'react-router-dom';
import { registrarUsuario, loginBackend } from '../functions/apiService';

export function RegistroPage() {
    const { accounts } = useMsal();
    const navigate = useNavigate();
    const [estado, setEstado] = useState('idle');
    const [mensajeError, setMensajeError] = useState('');

    const [formData, setFormData] = useState({
        edad: '', genero: 'Masculino', telefono: '', direccion: '', ocupacion: '', tipoUsuario: 'cliente'
    });

    if (accounts.length === 0) return <p>No hay sesión de Microsoft activa.</p>;

    const handleRegister = async (e) => {
        e.preventDefault();
        setEstado('cargando');
        const cuenta = accounts[0];
        const microsoftToken = localStorage.getItem('tempToken'); // Recuperamos el token

        const nuevoUsuario = {
            correo: cuenta.username,
            nombre: cuenta.name,
            ...formData,
            edad: parseInt(formData.edad)
        };

        try {
            // Mandamos los datos y el token
            const response = await registrarUsuario(nuevoUsuario, microsoftToken);
            
            if (response.ok || response.status === 201) {
                // Si el registro es exitoso, hacemos login para guardar todo
                const loginRes = await loginBackend(cuenta.username, microsoftToken);
                
                if (loginRes.ok) {
                    const usuarioBD = await loginRes.json();
                    
                    localStorage.setItem('backendData', JSON.stringify({
                        usuario: usuarioBD,
                        token: microsoftToken
                    }));
                    
                    localStorage.removeItem('tempToken'); // Limpiamos la basura
                    navigate('/dashboard');
                }
            } else {
                const err = await response.text();
                setMensajeError(`Error del servidor: ${err}`);
                setEstado('error');
            }
        } catch (error) {
            setMensajeError('Error de red al registrar.');
            setEstado('error');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', border: '1px solid #ffeeba', backgroundColor: '#fff3cd', borderRadius: '6px' }}>
            <h3 style={{ color: '#856404' }}>¡Hola {accounts[0].name}! 👋</h3>
            <p style={{ color: '#856404', fontSize: '14px' }}>Completa estos datos para finalizar tu registro.</p>
            
            {estado === 'error' && <p style={{ color: 'red' }}>{mensajeError}</p>}
            
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label>Edad: <input type="number" required value={formData.edad} onChange={e => setFormData({...formData, edad: e.target.value})} style={{width: '100%'}} min="18"/></label>
                <label>Género: 
                    <select value={formData.genero} onChange={e => setFormData({...formData, genero: e.target.value})} style={{width: '100%'}}>
                        <option>Masculino</option><option>Femenino</option><option>Otro</option>
                    </select>
                </label>
                <label>Teléfono: <input type="text" required value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} style={{width: '100%'}}/></label>
                <label>Dirección: <input type="text" value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} style={{width: '100%'}}/></label>
                <label>Ocupación: <input type="text" value={formData.ocupacion} onChange={e => setFormData({...formData, ocupacion: e.target.value})} style={{width: '100%'}}/></label>
                
                <button type="submit" disabled={estado === 'cargando'} style={{ backgroundColor: '#0078d4', color: 'white', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>
                    {estado === 'cargando' ? 'Registrando...' : 'Completar Registro'}
                </button>
            </form>
        </div>
    );
}