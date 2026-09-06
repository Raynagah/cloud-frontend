// src/pages/LoginPage.jsx
import React, { useEffect, useState } from 'react';
import { useMsal } from "@azure/msal-react";
import { useNavigate } from 'react-router-dom';
import { LoginButton } from '../molecules/LoginButton';
import { loginBackend } from '../functions/apiService';
import { loginRequest } from "../auth/AuthConfig"; // IMPORTANTE: importar tus scopes

export function LoginPage() {
    const { instance, accounts } = useMsal(); // Agregamos 'instance'
    const navigate = useNavigate();
    const [estado, setEstado] = useState('esperando');

    useEffect(() => {
        if (accounts.length > 0) {
            verificarEnBackend(accounts[0]); // Pasamos la cuenta completa
        }
    }, [accounts]);

    const verificarEnBackend = async (cuenta) => {
        setEstado('cargando');
        try {
            // 1. OBTENEMOS EL TOKEN DE MICROSOFT SILENCIOSAMENTE
            const tokenResponse = await instance.acquireTokenSilent({
                ...loginRequest,
                account: cuenta
            });
            const microsoftToken = tokenResponse.idToken; // o accessToken, dependiendo de cómo lo lee tu backend (normalmente idToken para Azure B2C/Entra ID)

            // 2. HACEMOS LOGIN EN EL BACKEND ENVIANDO EL TOKEN
            const response = await loginBackend(cuenta.username, microsoftToken);

            if (response.ok) {
                const usuarioBD = await response.json();
                
                // 3. ARMAMOS NUESTRO OBJETO CON EL TOKEN DE MICROSOFT
                const backendData = {
                    usuario: usuarioBD,
                    token: microsoftToken
                };

                localStorage.setItem('backendData', JSON.stringify(backendData));
                navigate('/dashboard');
            } 
            else if (response.status === 401) {
                // Microsoft validó, pero no está en BD -> Registrar
                // Guardamos temporalmente el token para la página de registro
                localStorage.setItem('tempToken', microsoftToken); 
                navigate('/registro');
            } 
            else {
                setEstado('error');
                console.error("Error del servidor:", response.status);
            }
        } catch (error) {
            setEstado('error');
            console.error("Error al obtener token de MS o de red:", error);
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
                <p style={{ color: 'red' }}>Hubo un error de conexión. Intenta nuevamente.</p>
            ) : (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <LoginButton />
                </div>
            )}
        </div>
    );
}