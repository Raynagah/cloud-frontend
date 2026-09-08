// src/utils/formatCurrency.js
export function formatarDinero(valor) {
    if (valor === undefined || valor === null) return "$0";
    
    // Cambia 'es-CL' y 'CLP' por tu país/moneda local si es necesario (ej: 'en-US' y 'USD', o 'es-MX' y 'MXN')
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0, // Usa 2 si tu moneda tiene centavos
        maximumFractionDigits: 2
    }).format(valor);
}