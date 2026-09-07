import React from 'react';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../auth/AuthConfig";
import './css/LoginButton.css'; // Importamos el CSS exclusivo

export function LoginButton() {
    const { instance, accounts } = useMsal();

    const handleLogin = () => {
        instance.loginRedirect(loginRequest).catch(e => {
            console.error("Error en el inicio de sesión:", e);
        });
    };

    const handleLogout = () => {
        instance.logoutRedirect().catch(e => {
            console.error("Error al cerrar sesión:", e);
        });
    };

    if (accounts.length > 0) {
        return (
            <div className="login-btn__user-container">
                <span className="login-btn__greeting">
                    Hola, <strong>{accounts[0].name}</strong>
                </span>
                <button onClick={handleLogout} className="login-btn__logout">
                    Cerrar Sesión
                </button>
            </div>
        );
    }

    return (
        <button onClick={handleLogin} className="login-btn__ms-login">
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