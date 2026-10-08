import axios from 'axios';

// 1. Usar variable de entorno de React (con fallback a localhost para desarrollo)
// Si usas Create React App usa process.env.REACT_APP_BFF_URL
// Si usas Vite usa import.meta.env.VITE_BFF_URL
const BFF_BASE_URL = process.env.REACT_APP_BFF_URL || "http://localhost:8084/api/v1/bff";

// 2. Crear la instancia global de Axios
const apiClient = axios.create({
    baseURL: BFF_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 3. INTERCEPTOR MÁGICO 🪄
apiClient.interceptors.request.use(
    (config) => {
        if (!config.headers.Authorization) {
            const backendDataStr = localStorage.getItem('backendData');
            if (backendDataStr) {
                const { token } = JSON.parse(backendDataStr);
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// --- USUARIOS Y LOGIN ---
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

export const actualizarUsuario = async (id, usuarioData) => {
    return await apiClient.put(`/usuarios/${id}`, usuarioData);
};

// --- PRODUCTOS ---
export const getProductos = async () => {
    return await apiClient.get('/productos');
};

export const getProductoById = async (id) => {
    return await apiClient.get(`/productos/${id}`);
};

// --- CARRITO ---
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

// --- ÓRDENES ---
export const crearOrden = async (items) => {
    return await apiClient.post('/ordenes/checkout', { items });
};

export const getHistorialOrdenes = async () => {
    return await apiClient.get('/ordenes');
};

export const getOrdenById = async (id) => {
    return await apiClient.get(`/ordenes/${id}`);
};

// --- NOTIFICACIONES ---
export const getNotificaciones = async () => {
    return await apiClient.get('/notificaciones');
};

export const marcarNotificacionLeida = async (id) => {
    return await apiClient.put(`/notificaciones/${id}/leer`);
};

export const eliminarNotificacion = async (id) => {
    return await apiClient.delete(`/notificaciones/${id}`);
};