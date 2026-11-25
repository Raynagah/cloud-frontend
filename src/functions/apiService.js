import axios from 'axios';
import { obtenerAccessToken } from '../auth/msalInstance';  

// 1. Usar variable de entorno de React (con fallback a localhost para desarrollo)
// Si usas Create React App usa process.env.REACT_APP_BFF_URL
// Si usas Vite usa import.meta.env.VITE_BFF_URL
const BFF_BASE_URL = import.meta.env.VITE_BFF_URL || "http://localhost:8084/api/v1/bff";

// 2. Crear la instancia global de Axios
const apiClient = axios.create({
    baseURL: BFF_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 3. INTERCEPTOR MÁGICO 🪄
// Interceptor de autenticación mediante Microsoft Azure.
apiClient.interceptors.request.use(
    async (config) => {
        if (!config.headers.Authorization) {
            const token = await obtenerAccessToken();
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// --- USUARIOS Y LOGIN ---
export const loginBackend = async (correo) => {
    return await apiClient.post('/usuarios/login', { correo });
};

// Usuario dueño del token con su rol REAL (lo decide el servidor). Úsalo para autorizar la UI;
// el rol guardado en localStorage es solo informativo y el usuario puede modificarlo.
export const getMe = async () => {
    return await apiClient.get('/usuarios/me');
};

export const registrarUsuario = async (usuarioData) => {
    return await apiClient.post('/usuarios', usuarioData);
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

// --- ANALÍTICA Y RECOMENDACIONES ---
// URL del WebSocket de métricas en tiempo real (ms-analytics-recommendations)
export const ANALYTICS_WS_URL = import.meta.env.VITE_ANALYTICS_WS_URL || "ws://localhost:8089/ws/metrics";

export const getRecomendaciones = async (productoId, max = 4) => {
    return await apiClient.get('/analitica/recomendaciones', { params: { productoId, max } });
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

// --- PAGOS (siempre a través del BFF) ---
export const iniciarPagoWebpay = async (peticionData) => {
    return await apiClient.post('/pagos/iniciar', peticionData);
};

export const confirmarPagoWebpay = async (tokenWs) => {
    return await apiClient.post('/pagos/commit', null, { params: { token_ws: tokenWs } });
};
