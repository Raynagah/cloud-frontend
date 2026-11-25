
// Dashboard de métricas analíticas en tiempo real
// WebSocket -> API Gateway -> ms-analytics-recommendations

import React, { useEffect, useRef, useState } from 'react';
import { ANALYTICS_WS_URL } from '../functions/apiService';
import './css/AnaliticaPage.css';
import { obtenerAccessToken } from '../auth/msalInstance';

const ETIQUETAS_TIPO = {
    PRODUCTO_VISTO: 'Productos vistos',
    CARRITO_ITEM_AGREGADO: 'Agregados al carrito',
    CARRITO_ITEM_ELIMINADO: 'Quitados del carrito',
    CARRITO_VACIADO: 'Carritos vaciados',
    COMPRA_REALIZADA: 'Compras realizadas',
};

const hora = (ms) => new Date(ms).toLocaleTimeString('es-CL', {
    hour: '2-digit',
    minute: '2-digit'
});

export function AnaliticaPage() {
    const [metricas, setMetricas] = useState(null);
    const [estado, setEstado] = useState('conectando');

    const wsRef = useRef(null);
    const reintentoRef = useRef(null);
    const fallosRef = useRef(0);

    useEffect(() => {
        if (ANALYTICS_WS_URL === "disabled") {
            setEstado("deshabilitado");
            return;
        }

        let activo = true;
        fallosRef.current = 0;

        const conectar = async () => {
            if (!activo) return;

            setEstado('conectando');

            let token;

            try {
                // MSAL obtiene y renueva el Access Token.
                token = await obtenerAccessToken();
            } catch (error) {
                if (activo) {
                    setEstado('rechazado');

                    console.error(
                        'No se pudo obtener el Access Token:',
                        error.errorCode || error.message
                    );
                }
                return;
            }

            if (!activo) return;

            if (!token) {
                setEstado('rechazado');
                return;
            }

            let ws;

            try {
                const url = new URL(ANALYTICS_WS_URL);

                if (url.protocol !== 'wss:') {
                    throw new Error('Se requiere una conexión WSS.');
                }

                url.searchParams.set('token', token);

                ws = new WebSocket(url.toString());
                wsRef.current = ws;

            } catch {
                setEstado('rechazado');
                console.error('No se pudo iniciar el WebSocket.');
                return;
            }

            let abierto = false;

            ws.onopen = () => {
                if (!activo) return;

                abierto = true;
                fallosRef.current = 0;
                setEstado('conectado');
            };

            ws.onmessage = (ev) => {
                if (!activo) return;

                try {
                    setMetricas(JSON.parse(ev.data));
                } catch {
                    console.error('Mensaje de métricas inválido.');
                }
            };

            ws.onclose = () => {
                if (!activo) return;

                if (!abierto) {
                    fallosRef.current += 1;
                }

                if (fallosRef.current >= 3) {
                    setEstado('rechazado');
                    return;
                }

                setEstado('desconectado');

                reintentoRef.current = setTimeout(
                    conectar,
                    3000
                );
            };

            ws.onerror = () => {
                ws.close();
            };
        };

        conectar();

        return () => {
            activo = false;

            clearTimeout(reintentoRef.current);

            if (wsRef.current) {
                wsRef.current.onopen = null;
                wsRef.current.onmessage = null;
                wsRef.current.onclose = null;
                wsRef.current.onerror = null;
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, []);

    const maxMinuto = metricas
        ? Math.max(
            1,
            ...metricas.clicsPorMinuto.map(m => m.clics)
        )
        : 1;

    const maxVistas = metricas && metricas.productosMasVistos.length
        ? Math.max(
            1,
            ...metricas.productosMasVistos.map(p => p.vistas)
        )
        : 1;

    const etiquetasEstado = {
        conectado: 'En vivo',
        conectando: 'Conectando…',
        rechazado: 'Sin acceso al servicio',
        desconectado: 'Reconectando…',
        deshabilitado: 'Temporalmente deshabilitado'
    };

    return (
        <div className="analitica">
            <div className="analitica__header">
                <h1 className="analitica__title">
                    Analítica en tiempo real 📊
                </h1>

                <span className={`analitica__estado analitica__estado--${estado === 'deshabilitado' ? 'rechazado' : estado
                    }`}>
                    ● {etiquetasEstado[estado]}
                </span>
            </div>

            {estado === 'deshabilitado' ? (
                <p className="analitica__vacio">
                    El servicio WebSocket está temporalmente deshabilitado
                    mientras se realizan las pruebas de autenticación.
                </p>
            ) : !metricas ? (
                <p className="analitica__vacio">
                    Esperando datos del pipeline de Kafka…
                </p>
            ) : (
                <>
                    {/* Métrica 1 y 2: contadores */}
                    <div className="analitica__kpis">

                        <div className="analitica__kpi">
                            <span className="analitica__kpi-valor">
                                {metricas.totalClics}
                            </span>
                            <span className="analitica__kpi-label">
                                Clics totales
                            </span>
                        </div>

                        <div className="analitica__kpi">
                            <span className="analitica__kpi-valor">
                                {metricas.usuariosActivos}
                            </span>
                            <span className="analitica__kpi-label">
                                Usuarios activos (5 min)
                            </span>
                        </div>

                        <div className="analitica__kpi analitica__kpi--alerta">
                            <span className="analitica__kpi-valor">
                                {metricas.alertasFraude.total}
                            </span>
                            <span className="analitica__kpi-label">
                                Alertas de fraude
                            </span>
                        </div>

                    </div>

                    <div className="analitica__grid">

                        {/* Métrica 3: productos más vistos */}
                        <section className="analitica__card">
                            <h3>Productos más vistos</h3>

                            {metricas.productosMasVistos.length === 0 && (
                                <p className="analitica__vacio">
                                    Sin visitas aún.
                                </p>
                            )}

                            {metricas.productosMasVistos.map(p => (
                                <div
                                    key={p.productoId}
                                    className="analitica__fila"
                                >
                                    <span className="analitica__fila-nombre">
                                        {p.nombre}
                                    </span>

                                    <div className="analitica__barra-fondo">
                                        <div
                                            className="analitica__barra"
                                            style={{
                                                width: `${(p.vistas / maxVistas) * 100}%`
                                            }}
                                        />
                                    </div>

                                    <strong>{p.vistas}</strong>
                                </div>
                            ))}
                        </section>

                        {/* Métrica 4: clics por minuto */}
                        <section className="analitica__card">
                            <h3>Clics por minuto (últimos 10)</h3>

                            <div className="analitica__columnas">
                                {metricas.clicsPorMinuto.map(m => (
                                    <div
                                        key={m.minuto}
                                        className="analitica__columna"
                                        title={`${hora(m.minuto)}: ${m.clics}`}
                                    >
                                        <span className="analitica__columna-valor">
                                            {m.clics}
                                        </span>

                                        <div
                                            className="analitica__columna-barra"
                                            style={{
                                                height: `${(m.clics / maxMinuto) * 100}%`
                                            }}
                                        />

                                        <small>{hora(m.minuto)}</small>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Métrica 5: eventos por tipo */}
                        <section className="analitica__card">
                            <h3>Eventos por tipo</h3>

                            {Object.entries(metricas.eventosPorTipo).length === 0 && (
                                <p className="analitica__vacio">
                                    Sin eventos aún.
                                </p>
                            )}

                            <ul className="analitica__lista">
                                {Object.entries(metricas.eventosPorTipo).map(
                                    ([tipo, n]) => (
                                        <li key={tipo}>
                                            <span>
                                                {ETIQUETAS_TIPO[tipo] || tipo}
                                            </span>
                                            <strong>{n}</strong>
                                        </li>
                                    )
                                )}
                            </ul>
                        </section>

                        {/* Alertas de fraude recientes */}
                        <section className="analitica__card">
                            <h3>Alertas antifraude recientes</h3>

                            {metricas.alertasFraude.recientes.length === 0 && (
                                <p className="analitica__vacio">
                                    Sin alertas. 🛡️
                                </p>
                            )}

                            <ul className="analitica__lista">
                                {metricas.alertasFraude.recientes.map((a, i) => (
                                    <li key={i}>
                                        <span>
                                            {a.claveEvaluada} — {a.intentos} intentos
                                        </span>
                                        <small>{hora(a.timestamp)}</small>
                                    </li>
                                ))}
                            </ul>
                        </section>

                    </div>
                </>
            )}
        </div>
    );
}
