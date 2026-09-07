import React, { useEffect, useState } from 'react';
import { useMsal } from "@azure/msal-react";
import { useNavigate } from 'react-router-dom';
import { LoginButton } from '../components/molecules/LoginButton'; // Ajusta la ruta si es necesario
import { loginBackend } from '../functions/apiService';
import { loginRequest } from "../auth/AuthConfig";
import './LoginPage.css'; // Importamos el CSS exclusivo

export function LoginPage() {
    const { instance, accounts } = useMsal();
    const navigate = useNavigate();
    const [estado, setEstado] = useState('esperando');

    useEffect(() => {
        if (accounts.length > 0) {
            verificarEnBackend(accounts[0]);
        }
    }, [accounts]);

    const verificarEnBackend = async (cuenta) => {
        setEstado('cargando');
        try {
            const tokenResponse = await instance.acquireTokenSilent({
                ...loginRequest,
                account: cuenta
            });
            const microsoftToken = tokenResponse.idToken;

            const response = await loginBackend(cuenta.username, microsoftToken);

            if (response.ok) {
                const usuarioBD = await response.json();
                
                const backendData = {
                    usuario: usuarioBD,
                    token: microsoftToken
                };

                localStorage.setItem('backendData', JSON.stringify(backendData));
                navigate('/dashboard');
            } 
            else if (response.status === 401) {
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
        <div className="login-page__wrapper">
            <div className="login-page__card">
                <h1 className="login-page__title">Bienvenido a <span>TiendaGeek</span></h1>
                <p className="login-page__subtitle">
                    Tu portal exclusivo de Funko Pops, peluches y artículos de Anime. Inicia sesión para empezar tu colección.
                </p>

                <div className="login-page__status-container">
                    {estado === 'cargando' ? (
                        <p className="login-page__loading">
                            <span>Verificando credenciales...</span> ⏳
                        </p>
                    ) : estado === 'error' ? (
                        <p className="login-page__error">
                            Hubo un error de conexión. Intenta nuevamente.
                        </p>
                    ) : (
                        <div className="login-page__action-area">
                            <LoginButton />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}