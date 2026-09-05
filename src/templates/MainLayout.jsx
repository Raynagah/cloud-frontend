import React from 'react';
import { Navbar } from '../organisms/Navbar';
import { Outlet } from 'react-router-dom';

export function MainLayout() {
    return (
        <div style={{ backgroundColor: '#f3f2f1', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
                {/* Aquí adentro se renderizarán ProductosPage o PerfilPage según la ruta */}
                <Outlet />
            </main>
        </div>
    );
}