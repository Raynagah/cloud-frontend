import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductos } from '../functions/apiService';
import { ProductoCard } from '../molecules/ProductoCard'; // <- Importamos la molécula

export function DashboardPage() {
    const backendDataStr = localStorage.getItem('backendData');
    const backendData = backendDataStr ? JSON.parse(backendDataStr) : null;
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const navigate = useNavigate();

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
                    {/* Renderizamos las moléculas */}
                    {productos.map(prod => (
                        <ProductoCard 
                            key={prod.id} 
                            producto={prod} 
                            onVerDetalle={(id) => navigate(`/producto/${id}`)} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
}