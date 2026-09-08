import React, { useState } from 'react';
import { useMsal } from "@azure/msal-react";
import { useNavigate } from 'react-router-dom';
import { registrarUsuario, loginBackend } from '../functions/apiService';

// Importamos los componentes visuales
import { Button } from '../atoms/Button';
import { InputField } from '../atoms/InputField';
import { SelectField } from '../atoms/SelectField';
import './css/RegistroPage.css';

export function RegistroPage() {
    const { accounts } = useMsal();
    const navigate = useNavigate();
    const [estado, setEstado] = useState('idle');
    const [mensajeError, setMensajeError] = useState('');

    const [formData, setFormData] = useState({
        edad: '', 
        genero: 'Masculino', 
        telefono: '', 
        direccion: '', 
        ocupacion: '', 
        tipoUsuario: 'cliente'
    });

    if (accounts.length === 0) return <p>No hay sesión de Microsoft activa.</p>;

    const handleRegister = async (e) => {
        e.preventDefault();
        setEstado('cargando');
        const cuenta = accounts[0];
        const microsoftToken = localStorage.getItem('tempToken');

        const nuevoUsuario = {
            correo: cuenta.username,
            nombre: cuenta.name,
            ...formData,
            edad: parseInt(formData.edad)
        };

        try {
            const response = await registrarUsuario(nuevoUsuario, microsoftToken);
            
            if (response.ok || response.status === 201) {
                const loginRes = await loginBackend(cuenta.username, microsoftToken);
                
                if (loginRes.ok) {
                    const usuarioBD = await loginRes.json();
                    localStorage.setItem('backendData', JSON.stringify({
                        usuario: usuarioBD,
                        token: microsoftToken
                    }));
                    localStorage.removeItem('tempToken');
                    navigate('/dashboard');
                }
            } else {
                const err = await response.text();
                setMensajeError(`Error del servidor: ${err}`);
                setEstado('error');
            }
        } catch (error) {
            setMensajeError('Error de red al registrar.');
            setEstado('error');
        }
    };

    return (
        <div className="registro-page__wrapper">
            <div className="registro-page__card">
                
                <div className="registro-page__header">
                    <h2>¡Hola, <span>{accounts[0].name.split(' ')[0]}</span>! 👋</h2>
                    <p className="registro-page__subtitle">Completa tu perfil otaku para finalizar el registro y empezar a coleccionar.</p>
                </div>

                {estado === 'error' && (
                    <div className="registro-page__alert registro-page__alert--error">
                        {mensajeError}
                    </div>
                )}
                {estado === 'cargando' && (
                    <div className="registro-page__alert registro-page__alert--loading">
                        Preparando tu espacio en Pedidos360... ⏳
                    </div>
                )}

                <form onSubmit={handleRegister}>
                    <div className="registro-form__grid">
                        <InputField 
                            label="Edad" 
                            type="number" 
                            min="18"
                            required 
                            placeholder="Ej. 25"
                            value={formData.edad} 
                            onChange={e => setFormData({...formData, edad: e.target.value})} 
                        />
                        
                        <SelectField 
                            label="Género" 
                            options={['Masculino', 'Femenino', 'Otro']}
                            value={formData.genero} 
                            onChange={e => setFormData({...formData, genero: e.target.value})} 
                        />

                        <InputField 
                            label="Teléfono" 
                            type="tel" 
                            required 
                            placeholder="+56 9 1234 5678"
                            value={formData.telefono} 
                            onChange={e => setFormData({...formData, telefono: e.target.value})} 
                        />

                        <InputField 
                            label="Ocupación" 
                            placeholder="Ej. Estudiante, Diseñador..."
                            value={formData.ocupacion} 
                            onChange={e => setFormData({...formData, ocupacion: e.target.value})} 
                        />

                        <div className="registro-form__full-width">
                            <InputField 
                                label="Dirección de Envío" 
                                placeholder="Calle Falsa 123, Ciudad"
                                value={formData.direccion} 
                                onChange={e => setFormData({...formData, direccion: e.target.value})} 
                            />
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        variant="primary" 
                        disabled={estado === 'cargando'}
                        style={{ width: '100%', padding: '14px', fontSize: '1rem', backgroundColor: '#7a28cb' }}
                    >
                        {estado === 'cargando' ? 'Registrando...' : '¡Completar Registro!'}
                    </Button>
                </form>
            </div>
        </div>
    );
}