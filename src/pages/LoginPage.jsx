import React, { useEffect, useState } from 'react';
import { useMsal } from "@azure/msal-react";
import { useNavigate } from 'react-router-dom';
import { LoginButton } from '../molecules/LoginButton';
import { loginBackend } from '../functions/apiService';
import { loginRequest } from "../auth/AuthConfig";
import './css/LoginPage.css';

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
        
        // 1. Declaramos el token fuera del try para poder usarlo en el catch si da 401
        let microsoftToken = null; 

        try {
            const tokenResponse = await instance.acquireTokenSilent({
                ...loginRequest,
                account: cuenta
            });
            microsoftToken = tokenResponse.idToken;

            // 2. Llamada a la API con Axios
            const response = await loginBackend(cuenta.username, microsoftToken);

            // 3. Axios ya procesó el JSON en response.data, ya no usamos .json() ni comprobamos .ok
            const usuarioBD = response.data;
            
            const backendData = {
                usuario: usuarioBD,
                token: microsoftToken
            };

            localStorage.setItem('backendData', JSON.stringify(backendData));
            navigate('/dashboard');

        } catch (error) {
            // 4. Con Axios, un error 401 (Unauthorized) cae directamente aquí en el catch
            if (error.response && error.response.status === 401) {
                localStorage.setItem('tempToken', microsoftToken); 
                navigate('/registro');
            } else {
                setEstado('error');
                console.error("Error del servidor o de red:", error);
            }
        }
    };

    return (
        <div className="login-page__wrapper">
            <div className="login-page__card">
                <h1 className="login-page__title">Bienvenido a <span>Pedidos360</span></h1>
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