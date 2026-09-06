// src/functions/apiService.js
const API_URL = "https://nku8zd8ok9.execute-api.us-east-1.amazonaws.com/desarrollo1/api/usuarios";
const API_PRODUCTOS_URL = "https://peq4cfx9b1.execute-api.us-east-1.amazonaws.com/desarrolloprocarr/api/v1/productos";
const API_CARRITO_URL = 'https://bhpifynk8i.execute-api.us-east-1.amazonaws.com/desarrollocarrito/api/v1/carrito';

// Función para intentar el login en tu backend
export const loginBackend = async (correo, token) => {
    return await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // <- AÑADIDO
        },
        body: JSON.stringify({ correo })
    });
};

export const registrarUsuario = async (usuarioData, token) => {
    return await fetch(API_URL, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // <- AÑADIDO
        },
        body: JSON.stringify(usuarioData)
    });
};

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

// Obtener el carrito actual
export const getCarrito = async (token) => {
    return await fetch(API_CARRITO_URL, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        }
    });
};

// Agregar un item al carrito
export const agregarItemCarrito = async (productoId, cantidad, precioUnitario, token) => {
    return await fetch(`${API_CARRITO_URL}/items`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        // Añadimos precioUnitario al cuerpo de la petición
        body: JSON.stringify({ productoId, cantidad, precioUnitario }) 
    });
};

// Vaciar todo el carrito
export const vaciarCarritoBackend = async (token) => {
    return await fetch(API_CARRITO_URL, {
        method: 'DELETE',
        headers: { 
            'Authorization': `Bearer ${token}` 
        }
    });
};

export const eliminarItemCarrito = async (productoId, token) => {
    return await fetch(`${API_CARRITO_URL}/items/${productoId}`, {
        method: 'DELETE',
        headers: { 
            'Authorization': `Bearer ${token}` 
        }
    });
};