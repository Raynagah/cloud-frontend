import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useIsAuthenticated } from "@azure/msal-react";

import { LoginPage } from './pages/LoginPage';
import { RegistroPage } from './pages/RegistroPage';
import { DashboardPage } from './pages/DashboardPage';
import { PerfilPage } from './pages/PerfilPage';
import { MainLayout } from './templates/MainLayout';

function App() {
  const isAuthenticated = useIsAuthenticated();

  return (
    // Recuerda dejar el basename que configuramos antes
    <BrowserRouter basename="/desarrollo">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        
        <Route path="/registro" element={isAuthenticated ? <RegistroPage /> : <Navigate to="/" />} />
        
        {/* Rutas protegidas envueltas en el Layout (Navbar incluido) */}
        <Route element={isAuthenticated ? <MainLayout /> : <Navigate to="/" />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/perfil" element={<PerfilPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;