// src/functions/apiService.js
import axios from 'axios';

// 1. URL Base de tu API Gateway
const BFF_BASE_URL = "https://ubu9hwv4t3.execute-api.us-east-1.amazonaws.com/desarrollobff/api/v1/bff";

// 2. Crear la instancia global de Axios
const apiClient = axios.create({
    baseURL: BFF_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 3. EL INTERCEPTOR MÁGICO 🪄
apiClient.interceptors.request.use(
    (config) => {
        // Si la petición ya trae un token (ej. Login/Registro), lo respetamos
        if (!config.headers.Authorization) {
            // Buscamos el token en localStorage
            const backendDataStr = localStorage.getItem('backendData');
            if (backendDataStr) {
                const { token } = JSON.parse(backendDataStr);
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`; // Sello automático
                }
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// --- USUARIOS Y LOGIN (Requieren token manual porque aún no se ha guardado en localStorage) ---
export const loginBackend = async (correo, token) => {
    return await apiClient.post('/usuarios/login', { correo }, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
};

export const registrarUsuario = async (usuarioData, token) => {
    return await apiClient.post('/usuarios', usuarioData, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
};

// --- PRODUCTOS (¡Ya no necesitan el parámetro token!) ---
export const getProductos = async () => {
    return await apiClient.get('/productos');
};

export const getProductoById = async (id) => {
    return await apiClient.get(`/productos/${id}`);
};

// --- CARRITO (¡Tampoco necesitan el token!) ---
export const getCarrito = async () => {
    return await apiClient.get('/carritos');
};

export const agregarItemCarrito = async (productoId, cantidad, precioUnitario) => {
    return await apiClient.post('/carritos/items', { productoId, cantidad, precioUnitario });
};

export const eliminarItemCarrito = async (productoId) => {
    return await apiClient.delete(`/carritos/items/${productoId}`);
};

export const vaciarCarritoBackend = async () => {
    return await apiClient.delete('/carritos');
};