import React, { useEffect, useState } from 'react';
import { getProductos } from '../functions/apiService';

export function DashboardPage() {
    const backendDataStr = localStorage.getItem('backendData');
    const backendData = backendDataStr ? JSON.parse(backendDataStr) : null;
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        if (backendData?.token) {
            cargarProductos(backendData.token);
        }
    }, []);

    const cargarProductos = async (token) => {
        try {
            const res = await getProductos(token);
            if (res.ok) {
                const data = await res.json();
                setProductos(data);
            } else {
                console.error("Error al obtener productos");
            }
        } catch (error) {
            console.error("Error de red", error);
        } finally {
            setCargando(false);
        }
    };

    if (!backendData) return <p>Sesión inválida.</p>;

    return (
        <div>
            <h2>Catálogo de Productos 🛒</h2>
            {cargando ? <p>Cargando productos...</p> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
                    {productos.map(prod => (
                        <div key={prod.id} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{prod.nombre}</h3>
                            <p style={{ fontSize: '14px', color: '#666', height: '40px' }}>{prod.descripcion}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#107c10' }}>${prod.precio}</span>
                                <span style={{ fontSize: '12px', padding: '4px 8px', backgroundColor: '#e7f4e4', borderRadius: '12px' }}>Stock: {prod.stock}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}