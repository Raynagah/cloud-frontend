// src/utils/formatCurrency.js
export function formatearDinero(valor) {
    // 1. Convertimos el valor a número por si el Backend lo está enviando como texto (string)
    const numero = Number(valor);
    
    // 2. Si por alguna razón no es un número válido, retornamos $0
    if (isNaN(numero)) return "$0";
    
    // 3. toLocaleString('es-CL') se encarga de poner los puntos de miles al estilo chileno
    return "$" + numero.toLocaleString('es-CL');
}