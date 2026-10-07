import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useIsAuthenticated } from "@azure/msal-react";

import { LoginPage } from './pages/LoginPage';
import { RegistroPage } from './pages/RegistroPage';
import { DashboardPage } from './pages/DashboardPage';
import { PerfilPage } from './pages/PerfilPage';
import { ProductoDetallePage } from './pages/ProductoDetallePage';
import { MainLayout } from './templates/MainLayout';
import { CarritoPage } from './pages/CarritoPage';
import { NotificacionesPage } from './pages/NotificacionesPage';
import { HistorialOrdenesPage } from './pages/HistorialOrdenesPage';
import { DetalleOrdenPage } from './pages/DetalleOrdenPage';
import { EditProfilePage } from './pages/EditProfilePage'; 

function App() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <BrowserRouter basename="/desarrollo">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        
        <Route path="/registro" element={isAuthenticated ? <RegistroPage /> : <Navigate to="/" />} />
        
        {/* Rutas protegidas envueltas en el Layout (Navbar incluido) */}
        <Route element={isAuthenticated ? <MainLayout /> : <Navigate to="/" />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/perfil" element={<PerfilPage />} />
            <Route path="/notificaciones" element={<NotificacionesPage />} />
            <Route path="/editar-perfil" element={<EditProfilePage />} />
            {/* NUEVA RUTA PARA EL DETALLE */}
            <Route path="/producto/:id" element={<ProductoDetallePage />} />
            <Route path="/carrito" element={<CarritoPage />} />
            <Route path="/mis-ordenes" element={<HistorialOrdenesPage />} />
            <Route path="/ordenes/:id" element={<DetalleOrdenPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;