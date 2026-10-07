import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { actualizarUsuario } from '../functions/apiService';
import { InputField } from '../atoms/InputField';
import { Button } from '../atoms/Button';
import './css/EditProfilePage.css';

export function EditProfilePage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(null);
    
    // Estado adaptado exactamente a UsuarioPerfilUpdateDTO
    const [formData, setFormData] = useState({
        nombre: '',
        edad: '',
        genero: '',
        telefono: '',
        fotoUrl: '',
        ocupacion: '',
        direccion: ''
    });

    useEffect(() => {
        const backendDataStr = localStorage.getItem('backendData');
        if (backendDataStr) {
            const { usuario } = JSON.parse(backendDataStr);
            if (usuario) {
                setUserId(usuario.id);
                setFormData({
                    nombre: usuario.nombre || '',
                    edad: usuario.edad || '',
                    genero: usuario.genero || '',
                    telefono: usuario.telefono || '',
                    fotoUrl: usuario.fotoUrl || '',
                    ocupacion: usuario.ocupacion || '',
                    direccion: usuario.direccion || ''
                });
            }
        } else {
            navigate('/perfil');
        }
    }, [navigate]);

    const handleChange = (e, field) => {
        // Asegura que edad se guarde como número
        const value = field === 'edad' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value;
        
        setFormData({
            ...formData,
            [field]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Envía el payload con la estructura de UsuarioPerfilUpdateDTO
            const response = await actualizarUsuario(userId, formData);
            
            // Actualiza el localStorage preservando el tipoUsuario original que ya existía
            const backendDataStr = localStorage.getItem('backendData');
            const parsedData = JSON.parse(backendDataStr);
            parsedData.usuario = { ...parsedData.usuario, ...response.data };
            localStorage.setItem('backendData', JSON.stringify(parsedData));

            navigate('/perfil');
        } catch (error) {
            console.error("Error al actualizar el perfil:", error);
            alert("Hubo un error al actualizar tus datos. Revisa que el nombre, edad y género estén completos.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="edit-profile__wrapper">
            <div className="edit-profile-card">
                <div className="edit-profile-card__banner">
                    <div className="edit-profile-card__avatar">✏️</div>
                </div>

                <div className="edit-profile-card__content">
                    <h2 className="edit-profile-card__title">Editar Perfil</h2>
                    <p className="edit-profile-card__subtitle">Actualiza tu información personal</p>

                    <form onSubmit={handleSubmit} className="edit-profile-form">
                        <div className="edit-profile-form__grid">
                            {/* Campos obligatorios según UsuarioPerfilUpdateDTO */}
                            <InputField 
                                label="Nombre Completo" 
                                value={formData.nombre} 
                                onChange={(e) => handleChange(e, 'nombre')} 
                                required 
                            />
                            
                            <InputField 
                                label="Edad" 
                                type="number"
                                min="18"
                                max="100"
                                value={formData.edad} 
                                onChange={(e) => handleChange(e, 'edad')} 
                                required 
                            />

                            <InputField 
                                label="Género" 
                                value={formData.genero} 
                                onChange={(e) => handleChange(e, 'genero')} 
                                required 
                            />

                            {/* Campos opcionales */}
                            <InputField 
                                label="Teléfono" 
                                type="tel"
                                value={formData.telefono} 
                                onChange={(e) => handleChange(e, 'telefono')} 
                            />

                            <InputField 
                                label="Ocupación" 
                                value={formData.ocupacion} 
                                onChange={(e) => handleChange(e, 'ocupacion')} 
                            />

                            <InputField 
                                label="Dirección" 
                                value={formData.direccion} 
                                onChange={(e) => handleChange(e, 'direccion')} 
                            />
                        </div>

                        <div className="edit-profile-card__actions">
                            <Button 
                                type="button" 
                                variant="text" 
                                onClick={() => navigate('/perfil')}
                                style={{ marginRight: '15px' }}
                            >
                                Cancelar
                            </Button>
                            <Button 
                                type="submit" 
                                variant="primary" 
                                disabled={loading}
                                style={{ backgroundColor: '#7a28cb' }}
                            >
                                {loading ? 'Guardando...' : 'Guardar Cambios'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}