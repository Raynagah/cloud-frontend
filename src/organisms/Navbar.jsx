import React from 'react';
import { Link } from 'react-router-dom';
import { LoginButton } from '../molecules/LoginButton';
import { CartButton } from '../molecules/CartButton';
import './css/Navbar.css';

export function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar__left">
                <h2 className="navbar__brand">Pedidos360</h2>
                <Link to="/dashboard" className="navbar__link">
                    Productos
                </Link>
                <Link to="/perfil" className="navbar__link">
                    Mi Perfil
                </Link>
            </div>
            
            <div className="navbar__right">
                <CartButton />
                <LoginButton />
            </div>
        </nav>
    );
}