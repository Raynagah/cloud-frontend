
import React, { useEffect, useState } from 'react';
import { useMsal } from "@azure/msal-react";
import {
    InteractionRequiredAuthError,
    InteractionStatus
} from "@azure/msal-browser";
import { useNavigate } from 'react-router-dom';
import { LoginButton } from '../molecules/LoginButton';
import { loginBackend } from '../functions/apiService';
import { apiRequest } from "../auth/AuthConfig";
import './css/LoginPage.css';

export function LoginPage() {
    const { instance, accounts, inProgress } = useMsal();
    const navigate = useNavigate();

    const [estado, setEstado] = useState('esperando');

    const cuenta = instance.getActiveAccount() || accounts[0];

    useEffect(() => {
        if (cuenta && inProgress === InteractionStatus.None) {
            verificarEnBackend(cuenta);
        }
    }, [cuenta, inProgress]);

    const verificarEnBackend = async (cuenta) => {
        setEstado('cargando');

        try {
            instance.setActiveAccount(cuenta);

            // El interceptor obtiene el Access Token desde MSAL.
            const response = await loginBackend(cuenta.username);

            const usuarioBD = response.data;

            // Guardamos únicamente los datos del usuario.
            localStorage.setItem('backendData', JSON.stringify({
                usuario: usuarioBD
            }));

            // Eliminamos el token temporal de la versión anterior.
            localStorage.removeItem('tempToken');

            navigate('/dashboard');

        } catch (error) {

            if (error instanceof InteractionRequiredAuthError) {
                setEstado('consentimiento');
                return;
            }

            const respuesta = error.response;

            // El backend devuelve este mensaje cuando
            // el usuario todavía no está registrado.
            const mensaje = typeof respuesta?.data === 'string'
                ? respuesta.data
                : JSON.stringify(respuesta?.data || {});

            if (
                respuesta?.status === 401 &&
                mensaje.includes('no está registrado')
            ) {
                localStorage.removeItem('backendData');
                localStorage.removeItem('tempToken');

                navigate('/registro');
                return;
            }

            setEstado('error');

            console.error(
                "Error de autenticación:",
                error.response?.status || error.errorCode || error.message
            );
        }
    };

    const autorizarAplicacion = async () => {
        try {
            await instance.acquireTokenRedirect({
                ...apiRequest,
                account: cuenta
            });
        } catch (error) {
            setEstado('error');

            console.error(
                "Error solicitando autorización:",
                error.errorCode || error.message
            );
        }
    };

    return (
        <div className="login-page__wrapper">
            <div className="login-page__card">

                <h1 className="login-page__title">
                    Bienvenido a <span>Pedidos360</span>
                </h1>

                <p className="login-page__subtitle">
                    Tu portal exclusivo de Funko Pops, peluches
                    y artículos de Anime. Inicia sesión para
                    empezar tu colección.
                </p>

                <div className="login-page__status-container">

                    {estado === 'cargando' ? (
                        <p className="login-page__loading">
                            <span>Verificando credenciales...</span> ⏳
                        </p>

                    ) : estado === 'consentimiento' ? (
                        <div className="login-page__action-area">
                            <p>
                                Microsoft requiere autorización
                                para acceder a Pedidos360.
                            </p>

                            <button
                                onClick={autorizarAplicacion}
                                disabled={
                                    inProgress !== InteractionStatus.None
                                }
                            >
                                Autorizar aplicación
                            </button>
                        </div>

                    ) : estado === 'error' ? (
                        <div>
                            <p className="login-page__error">
                                Hubo un error de autenticación o conexión.
                            </p>

                            <button onClick={() => window.location.reload()}>
                                Reintentar
                            </button>
                        </div>

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
