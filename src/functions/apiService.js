// src/functions/apiService.js

// 1. URL Base de tu API Gateway del BFF en AWS
const BFF_BASE_URL = "https://ubu9hwv4t3.execute-api.us-east-1.amazonaws.com/desarrollobff/api/v1/bff";

// 2. Rutas específicas basadas en tus controladores del BFF
const API_USUARIOS_URL = `${BFF_BASE_URL}/usuarios`;
const API_CARRITO_URL = `${BFF_BASE_URL}/carritos`;
const API_PRODUCTOS_URL = `${BFF_BASE_URL}/productos`; // Ver nota abajo

// --- USUARIOS Y LOGIN ---

export const loginBackend = async (correo, token) => {
    return await fetch(`${API_USUARIOS_URL}/login`, { // Coincide con @PostMapping("/login")
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ correo })
    });
};

export const registrarUsuario = async (usuarioData, token) => {
    return await fetch(API_USUARIOS_URL, { // Coincide con @PostMapping
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(usuarioData)
    });
};

// --- PRODUCTOS ---

export const getProductos = async (token) => {
    return await fetch(API_PRODUCTOS_URL, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        }
    });
};

export const getProductoById = async (id, token) => {
    return await fetch(`${API_PRODUCTOS_URL}/${id}`, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        }
    });
};

// --- CARRITO ---

export const getCarrito = async (token) => {
    return await fetch(API_CARRITO_URL, { // Coincide con @GetMapping
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        }
    });
};

export const agregarItemCarrito = async (productoId, cantidad, precioUnitario, token) => {
    return await fetch(`${API_CARRITO_URL}/items`, { // Coincide con @PostMapping("/items")
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ productoId, cantidad, precioUnitario }) 
    });
};

export const eliminarItemCarrito = async (productoId, token) => {
    return await fetch(`${API_CARRITO_URL}/items/${productoId}`, { // Coincide con @DeleteMapping("/items/{productoId}")
        method: 'DELETE',
        headers: { 
            'Authorization': `Bearer ${token}` 
        }
    });
};

export const vaciarCarritoBackend = async (token) => {
    return await fetch(API_CARRITO_URL, { // Coincide con @DeleteMapping
        method: 'DELETE',
        headers: { 
            'Authorization': `Bearer ${token}` 
        }
    });
};