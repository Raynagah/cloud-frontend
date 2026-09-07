import React from 'react';
import './css/PerfilPage.css';

// Función para transformar el nombre a formato capitalizado 
const capitalizarPalabras = (texto) => {
    if (!texto) return '';
    return texto.toLowerCase().split(' ').map(palabra => 
        palabra.charAt(0).toUpperCase() + palabra.slice(1)
    ).join(' ');
};

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
    
    // Capitalizamos el nombre antes de usarlo
    const nombreCapitalizado = capitalizarPalabras(usuario.nombre);

    return (
        <div className="profile-page__wrapper">
            <div className="profile-card">
                
                {/* Cabecera con Banner y Avatar */}
                <div className="profile-card__banner">
                    <div className="profile-card__avatar">
                        👾 {/* Más adelante puedes cambiarlo por: <img src={usuario.fotoUrl} ... /> */}
                    </div>
                    {/* Botón para agregar/cambiar foto */}
                    <button 
                        className="profile-card__add-photo-btn" 
                        onClick={() => console.log("Abriendo selector de imágenes...")}
                        title="Cambiar fotografía"
                    >
                        📷
                    </button>
                </div>

                {/* Contenido del Perfil */}
                <div className="profile-card__content">
                    <h2 className="profile-card__title">{nombreCapitalizado}</h2>
                    <p className="profile-card__subtitle">Credencial de Usuario</p>

                    <div className="profile-card__grid">
                        <div className="profile-item">
                            <span className="profile-item__label">Nombre Completo</span>
                            <p className="profile-item__value">{nombreCapitalizado}</p>
                        </div>

                        <div className="profile-item">
                            <span className="profile-item__label">Correo Electrónico</span>
                            <p className="profile-item__value">{usuario.correo}</p>
                        </div>

                        <div className="profile-item">
                            <span className="profile-item__label">Teléfono</span>
                            <p className="profile-item__value">{usuario.telefono}</p>
                        </div>

                        <div className="profile-item">
                            <span className="profile-item__label">Dirección</span>
                            <p className="profile-item__value">{usuario.direccion}</p>
                        </div>

                        <div className="profile-item">
                            <span className="profile-item__label">Edad</span>
                            <p className="profile-item__value">{usuario.edad} años</p>
                        </div>

                        <div className="profile-item">
                            <span className="profile-item__label">Género</span>
                            <p className="profile-item__value">{usuario.genero}</p>
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

                    {/* Botonera inferior */}
                    <div className="profile-card__actions">
                        <button 
                            className="profile-card__edit-btn"
                            onClick={() => console.log("Abriendo modal para editar perfil...")}
                        >
                            Editar Perfil
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}