
import React from 'react';
import { useMsal } from "@azure/msal-react";
import { apiRequest } from "../auth/AuthConfig";
import './css/LoginButton.css';

export function LoginButton() {
    const { instance, accounts } = useMsal();

    const cuenta = instance.getActiveAccount() || accounts[0];

    const handleLogin = () => {
        instance.loginRedirect(apiRequest).catch(e => {
            console.error("Error en el inicio de sesión:", e);
        });
    };

    const handleLogout = () => {
        // Eliminar los datos de nuestra sesión local.
        localStorage.removeItem('backendData');
        localStorage.removeItem('tempToken');

        instance.logoutRedirect({
            account: cuenta
        }).catch(e => {
            console.error("Error al cerrar sesión:", e);
        });
    };

    if (cuenta) {
        return (
            <div className="login-btn__user-container">
                <span className="login-btn__greeting">
                    Hola, <strong>{cuenta.name}</strong>
                </span>

                <button
                    onClick={handleLogout}
                    className="login-btn__logout"
                >
                    Cerrar Sesión
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={handleLogin}
            className="login-btn__ms-login"
        >
            <span className="login-btn__ms-icon">
                <span className="login-btn__ms-icon-box login-btn__ms-icon-box--red"></span>
                <span className="login-btn__ms-icon-box login-btn__ms-icon-box--green"></span>
                <span className="login-btn__ms-icon-box login-btn__ms-icon-box--blue"></span>
                <span className="login-btn__ms-icon-box login-btn__ms-icon-box--yellow"></span>
            </span>

            Continuar con Microsoft
        </button>
    );
}
