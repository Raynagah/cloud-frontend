// src/components/organisms/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { LoginButton } from '../molecules/LoginButton';
import { CartButton } from '../molecules/CartButton';

export function Navbar() {
    return (
        <nav style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '15px 30px', 
            backgroundColor: '#005a9e', 
            color: 'white' 
        }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '20px' }}>MiTienda</h2>
                <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
                    Productos
                </Link>
                <Link to="/perfil" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
                    Mi Perfil
                </Link>
            </div>
            
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <CartButton />
                <LoginButton />
            </div>
        </nav>
    );
}