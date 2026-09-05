import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useIsAuthenticated } from "@azure/msal-react";

// Importación de las futuras páginas
import { LoginPage } from './pages/LoginPage';
import { RegistroPage } from './pages/RegistroPage';
import { DashboardPage } from './pages/DashboardPage';

function App() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública de inicio de sesión */}
        <Route path="/" element={<LoginPage />} />

        {/* Rutas protegidas: Requieren sesión activa en MSAL */}
        <Route 
          path="/registro" 
          element={isAuthenticated ? <RegistroPage /> : <Navigate to="/" />} 
        />
        
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <DashboardPage /> : <Navigate to="/" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;