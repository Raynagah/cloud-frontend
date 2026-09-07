import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductos } from '../functions/apiService';
import { ProductoCard } from '../molecules/ProductoCard';
import './css/DashboardPage.css';

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

    if (!backendData) return <p className="dashboard__error">Sesión inválida.</p>;

    return (
        <div>
            <div className="dashboard__header">
                <h1 className="dashboard__title">Catálogo Coleccionable 👾</h1>
            </div>

            {cargando ? (
                <p className="dashboard__loading">Cargando tu próximo tesoro... ⏳</p>
            ) : (
                <div className="dashboard__grid">
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