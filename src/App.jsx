import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useIsAuthenticated } from "@azure/msal-react";

import { LoginPage } from './pages/LoginPage';
import { RegistroPage } from './pages/RegistroPage';
import { DashboardPage } from './pages/DashboardPage';

function App() {
  const isAuthenticated = useIsAuthenticated();

  return (
    // 👇 Añade el basename con el nombre exacto de tu stage en API Gateway
    <BrowserRouter basename="/desarrollo">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/registro" element={isAuthenticated ? <RegistroPage /> : <Navigate to="/" />} />
        <Route path="/dashboard" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;