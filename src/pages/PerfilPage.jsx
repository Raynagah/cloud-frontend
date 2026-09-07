import React from 'react';
import './css/PerfilPage.css';

export function PerfilPage() {
    const backendDataStr = localStorage.getItem('backendData');
    const backendData = backendDataStr ? JSON.parse(backendDataStr) : null;

    if (!backendData) return (
        <div className="profile-page__wrapper">
            <p style={{ textAlign: 'center', color: '#ff1053', fontWeight: 'bold' }}>
                Sesión inválida o expirada.
            </p>
        </div>
    );
    
    const { usuario } = backendData;

    return (
        <div className="profile-page__wrapper">
            <div className="profile-card">
                
                {/* Cabecera con Banner y Avatar */}
                <div className="profile-card__banner">
                    <div className="profile-card__avatar">
                        👾 {/* Puedes cambiar esto por una imagen (img) o las iniciales del usuario */}
                    </div>
                </div>

                {/* Contenido del Perfil */}
                <div className="profile-card__content">
                    <h2 className="profile-card__title">{usuario.nombre}</h2>
                    <p className="profile-card__subtitle">Credencial de Usuario</p>

                    <div className="profile-card__grid">
                        <div className="profile-item">
                            <span className="profile-item__label">Nombre Completo</span>
                            <p className="profile-item__value">{usuario.nombre}</p>
                        </div>

                        <div className="profile-item">
                            <span className="profile-item__label">Correo Electrónico</span>
                            <p className="profile-item__value">{usuario.correo}</p>
                        </div>

                        <div className="profile-item">
                            <span className="profile-item__label">Ocupación / Gremio</span>
                            <p className="profile-item__value">{usuario.ocupacion}</p>
                        </div>

                        <div className="profile-item">
                            <span className="profile-item__label">Nivel de Acceso</span>
                            <p className="profile-item__value" style={{ textTransform: 'capitalize' }}>
                                {usuario.tipoUsuario}
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}