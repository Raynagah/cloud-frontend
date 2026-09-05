// src/pages/LoginPage.jsx
import React, { useEffect, useState } from 'react';
import { useMsal } from "@azure/msal-react";
import { useNavigate } from 'react-router-dom';
import { LoginButton } from '../molecules/LoginButton';
import { loginBackend } from '../functions/apiService';

export function LoginPage() {
    const { accounts } = useMsal();
    const navigate = useNavigate();
    const [estado, setEstado] = useState('esperando'); // 'esperando', 'cargando', 'error'

    useEffect(() => {
        // Si el usuario ya se autenticó con Microsoft, verificamos en el Backend
        if (accounts.length > 0) {
            verificarEnBackend(accounts[0].username);
        }
    }, [accounts]);

    const verificarEnBackend = async (correo) => {
        setEstado('cargando');
        try {
            const response = await loginBackend(correo);

            if (response.ok) {
                // El usuario existe en la BD -> Vamos al dashboard
                const data = await response.json();
                // Opcional: Podrías guardar el token en localStorage o en un Contexto global aquí
                localStorage.setItem('backendData', JSON.stringify(data));
                navigate('/dashboard');
            } 
            else if (response.status === 401) {
                // Microsoft lo validó, pero no está en la BD -> Vamos a registrarlo
                navigate('/registro');
            } 
            else {
                setEstado('error');
                console.error("Error del servidor:", response.status);
            }
        } catch (error) {
            setEstado('error');
            console.error("Error de red:", error);
        }
    };

    return (
        <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <h1>Bienvenido al Sistema</h1>
            <p style={{ color: '#605e5c', marginBottom: '30px' }}>
                Inicia sesión con tu cuenta corporativa para continuar.
            </p>

            {estado === 'cargando' ? (
                <p style={{ color: '#005a9e', fontWeight: 'bold' }}>Verificando credenciales... ⏳</p>
            ) : estado === 'error' ? (
                <p style={{ color: 'red' }}>Hubo un error de conexión con el servidor. Intenta nuevamente.</p>
            ) : (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <LoginButton />
                </div>
            )}
        </div>
    );
}