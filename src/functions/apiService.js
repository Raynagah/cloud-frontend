// src/functions/apiService.js
const API_URL = "https://nku8zd8ok9.execute-api.us-east-1.amazonaws.com/desarrollo1/api/usuarios";

// Función para intentar el login en tu backend
export const loginBackend = async (correo) => {
    return await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo })
    });
};

// Función para registrar un usuario nuevo
export const registrarUsuario = async (usuarioData) => {
    return await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuarioData)
    });
};