import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/PerfilPage.css';

// Función para transformar el nombre a formato capitalizado 
const capitalizarPalabras = (texto) => {
    if (!texto) return '';
    return texto.toLowerCase().split(' ').map(palabra => 
        palabra.charAt(0).toUpperCase() + palabra.slice(1)
    ).join(' ');
};

export function PerfilPage() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const backendDataStr = localStorage.getItem('backendData');
    const backendData = backendDataStr ? JSON.parse(backendDataStr) : null;

    if (!backendData) {
        return (
            <div className="profile-page__wrapper">
                <p style={{ textAlign: 'center', color: '#ff1053', fontWeight: 'bold' }}>
                    Sesión inválida o expirada.
                </p>
            </div>
        );
    }
    
    const { usuario } = backendData;
    const nombreCapitalizado = capitalizarPalabras(usuario.nombre);

    // Handler para disparar la carga de imagen localmente
    const handleAddPhotoClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log("Archivo seleccionado:", file.name);
            // Aquí puedes llamar a tu servicio API de carga de imágenes
        }
    };

    return (
        <div className="profile-page__wrapper">
            <div className="profile-card">
                
                {/* Cabecera con Banner y Avatar */}
                <div className="profile-card__banner">
                    <div className="profile-card__avatar">
                        👾
                    </div>

                    {/* Input oculto para cargar archivos */}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        style={{ display: 'none' }} 
                    />

                    {/* Botón para agregar/cambiar foto */}
                    <button 
                        type="button"
                        className="profile-card__add-photo-btn" 
                        onClick={handleAddPhotoClick}
                        title="Cambiar fotografía"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                            <circle cx="12" cy="13" r="4"></circle>
                        </svg>
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
                            <p className="profile-item__value">{usuario.telefono || 'No registrado'}</p>
                        </div>

                        <div className="profile-item">
                            <span className="profile-item__label">Dirección</span>
                            <p className="profile-item__value">{usuario.direccion || 'No registrada'}</p>
                        </div>

                        <div className="profile-item">
                            <span className="profile-item__label">Edad</span>
                            <p className="profile-item__value">{usuario.edad ? `${usuario.edad} años` : 'N/A'}</p>
                        </div>

                        <div className="profile-item">
                            <span className="profile-item__label">Género</span>
                            <p className="profile-item__value">{usuario.genero || 'N/A'}</p>
                        </div>

                        <div className="profile-item">
                            <span className="profile-item__label">Ocupación / Clase</span>
                            <p className="profile-item__value">{usuario.ocupacion || 'N/A'}</p>
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
                            type="button"
                            className="profile-card__edit-btn"
                            onClick={() => navigate('/editar-perfil')}
                        >
                            Editar Perfil
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}