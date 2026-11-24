import React from 'react';
import { Link } from 'react-router-dom';
import { LoginButton } from '../molecules/LoginButton';
import { CartButton } from '../molecules/CartButton';
import { NotificationButton } from '../molecules/NotificationButton';
import './css/Navbar.css';

// Solo cosmético: oculta el enlace a quien no es admin. La protección real está en el servidor.
const esAdminLocal = () => {
    try {
        return JSON.parse(localStorage.getItem('backendData') || '{}').usuario?.tipoUsuario === 'admin';
    } catch {
        return false;
    }
};

export function Navbar() {
    const mostrarAnalitica = esAdminLocal();
    return (
        <nav className="navbar">
            <div className="navbar__left">
                <h2 className="navbar__brand">Pedidos360</h2>
                <Link to="/dashboard" className="navbar__link">
                    Productos
                </Link>
                {mostrarAnalitica && (
                    <Link to="/analitica" className="navbar__link">
                        Analítica
                    </Link>
                )}
                <Link to="/perfil" className="navbar__link">
                    Mi Perfil
                </Link>
            </div>
            
            <div className="navbar__right">
                <Link to="/mis-ordenes" className="navbar__link">Mis Órdenes</Link>
                <NotificationButton />
                <CartButton />
                <LoginButton />
            </div>
        </nav>
    );
}