
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMsal } from "@azure/msal-react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { apiRequest } from "../auth/AuthConfig";
import { getProductos } from '../functions/apiService';
import { ProductoCard } from '../molecules/ProductoCard';
import './css/DashboardPage.css';

export function DashboardPage() {
    const backendDataStr = localStorage.getItem('backendData');
    const backendData = backendDataStr ? JSON.parse(backendDataStr) : null;

    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);

    const navigate = useNavigate();
    const { instance, accounts } = useMsal();

    useEffect(() => {
        if (backendData) {
            cargarProductos();
        }
    }, []);

    const cargarProductos = async () => {
        try {
            const res = await getProductos();
            setProductos(res.data);
        } catch (error) {
            console.error("Error al cargar productos", error);
        } finally {
            setCargando(false);
        }
    };

    // Prueba temporal de Access Token de Azure
    const probarAccessToken = async () => {
        if (accounts.length === 0) {
            console.error("No existe una sesión activa de Microsoft.");
            return;
        }

        const request = {
            ...apiRequest,
            account: accounts[0]
        };

        try {
            let response;

            try {
                response = await instance.acquireTokenSilent(request);
            } catch (error) {
                if (error instanceof InteractionRequiredAuthError) {
                    await instance.acquireTokenRedirect(request);
                    return;
                }

                throw error;
            }

            let payload = response.accessToken
                .split(".")[1]
                .replace(/-/g, "+")
                .replace(/_/g, "/");

            payload = payload.padEnd(
                Math.ceil(payload.length / 4) * 4,
                "="
            );

            const datos = JSON.parse(atob(payload));

            console.log("Access Token obtenido correctamente.");

            console.table({
                iss: datos.iss,
                aud: datos.aud,
                scp: datos.scp,
                ver: datos.ver,
                exp: new Date(datos.exp * 1000).toISOString()
            });

        } catch (error) {
            console.error(
                "Error obteniendo Access Token:",
                error.errorCode,
                error.errorMessage || error.message
            );
        }
    };

    if (!backendData) {
        return (
            <p className="dashboard__error">
                Sesión inválida.
            </p>
        );
    }

    return (
        <div>
            <div className="dashboard__header">
                <h1 className="dashboard__title">
                    Catálogo Coleccionable 👾
                </h1>

                {/* Botón temporal de diagnóstico */}
                {backendData.usuario?.tipoUsuario === 'admin' && (
                    <button
                        onClick={probarAccessToken}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#2563eb',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            margin: '10px'
                        }}
                    >
                        Probar Access Token
                    </button>
                )}
            </div>

            {cargando ? (
                <p className="dashboard__loading">
                    Cargando tu próximo tesoro... ⏳
                </p>
            ) : (
                <div className="dashboard__grid">
                    {productos.map(prod => (
                        <ProductoCard
                            key={prod.id}
                            producto={prod}
                            onVerDetalle={(id) =>
                                navigate(`/producto/${id}`)
                            }
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
