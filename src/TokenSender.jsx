// src/TokenSender.jsx
import React, { useState, useEffect } from 'react';
import { useMsal } from "@azure/msal-react";

// Apuntamos directamente a tu microservicio local
const MS_USUARIOS_URL = "http://3.208.93.5:8081/api/usuarios";

export function TokenSender() {
    const { accounts } = useMsal();
    
    // Estados para manejar la lógica
    const [status, setStatus] = useState('checking'); // 'checking', 'user_exists', 'needs_registration', 'error'
    const [backendData, setBackendData] = useState(null); // Aquí guardaremos el Token JWT y datos del MS
    const [errorMessage, setErrorMessage] = useState('');

    // Estado para el formulario de registro
    const [formData, setFormData] = useState({
        edad: '',
        genero: 'Masculino',
        telefono: '',
        direccion: '',
        ocupacion: '',
        tipoUsuario: 'cliente' // Por defecto
    });

    // 1. Cuando el componente carga y hay un usuario de Microsoft, intentamos hacer login en TU backend
    useEffect(() => {
        if (accounts.length > 0) {
            intentarLoginBackend(accounts[0].username); // username suele contener el correo en Azure
        }
    }, [accounts]);

    const intentarLoginBackend = async (correo) => {
        setStatus('checking');
        try {
            const response = await fetch(`${MS_USUARIOS_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo: correo }) // Enviamos el SsoLoginRequestDTO
            });

            if (response.ok) {
                // El usuario existe en la BD
                const data = await response.json();
                setBackendData(data); // Guarda el Token, sessionId y el usuario
                setStatus('user_exists');
            } else if (response.status === 401) {
                // 401: Microsoft lo validó, pero NO existe en tu BD local
                setStatus('needs_registration');
            } else {
                setErrorMessage(`Error del servidor: ${response.status}`);
                setStatus('error');
            }
        } catch (error) {
            setErrorMessage('Error de red: No se pudo conectar con ms-usuarios en el puerto 8081');
            setStatus('error');
        }
    };

    // Manejador del formulario para registrar usuario nuevo
    const handleRegister = async (e) => {
        e.preventDefault();
        setStatus('checking');

        const cuentaMicrosoft = accounts[0];
        
        // Armamos el objeto con los datos de MS + los del formulario
        const nuevoUsuario = {
            correo: cuentaMicrosoft.username,
            nombre: cuentaMicrosoft.name, // Lo sacamos de Microsoft
            edad: parseInt(formData.edad),
            genero: formData.genero,
            telefono: formData.telefono,
            direccion: formData.direccion,
            ocupacion: formData.ocupacion,
            tipoUsuario: formData.tipoUsuario
        };

        try {
            const response = await fetch(MS_USUARIOS_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoUsuario)
            });

            if (response.ok || response.status === 201) {
                // Se creó exitosamente. Ahora volvemos a hacer login para obtener el Token.
                intentarLoginBackend(cuentaMicrosoft.username);
            } else {
                const errData = await response.text();
                setErrorMessage(`Error al registrar: ${errData}`);
                setStatus('error');
            }
        } catch (error) {
            setErrorMessage('Error de red al intentar registrar al usuario.');
            setStatus('error');
        }
    };

    // --- RENDERIZADOS SEGÚN EL ESTADO ---

    if (accounts.length === 0) return null;

    if (status === 'checking') {
        return <div style={{ padding: '20px', color: '#005a9e' }}>Conectando con ms-usuarios (BD local)... ⏳</div>;
    }

    if (status === 'error') {
        return <div style={{ padding: '20px', color: 'red', background: '#fdd' }}>{errorMessage}</div>;
    }

    // PANTALLA: EL USUARIO YA EXISTE EN LA BASE DE DATOS
    if (status === 'user_exists' && backendData) {
        return (
            <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#e7f4e4', border: '1px solid #107c10', borderRadius: '6px' }}>
                <h3 style={{ color: '#107c10' }}>¡Autenticación Exitosa en tu Backend! ✅</h3>
                <p>El usuario fue encontrado en la base de datos PostgreSQL local.</p>
                
                <div style={{ background: 'white', padding: '15px', borderRadius: '4px', marginTop: '10px' }}>
                    <strong>Datos del Usuario (Desde BD):</strong>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li>ID: {backendData.usuario.id}</li>
                        <li>Nombre: {backendData.usuario.nombre}</li>
                        <li>Rol: {backendData.usuario.tipoUsuario}</li>
                        <li>Edad: {backendData.usuario.edad}</li>
                    </ul>
                </div>

                <div style={{ marginTop: '15px' }}>
                    <h4>Token JWT Generado por ms-usuarios:</h4>
                    <textarea
                        readOnly
                        value={backendData.token}
                        rows={4}
                        style={{ width: '100%', fontFamily: 'monospace', fontSize: '11px', padding: '8px' }}
                    />
                </div>
            </div>
        );
    }

    // PANTALLA: EL USUARIO NO EXISTE -> PEDIR DATOS FALTANTES
    if (status === 'needs_registration') {
        return (
            <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#fff3cd', border: '1px solid #ffeeba', borderRadius: '6px' }}>
                <h3 style={{ color: '#856404' }}>¡Hola {accounts[0].name}! Es tu primera vez aquí. 👋</h3>
                <p style={{ color: '#856404' }}>Tu correo <strong>{accounts[0].username}</strong> fue verificado por Microsoft, pero necesitamos un par de datos más para registrarte en nuestro sistema.</p>
                
                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px', maxWidth: '400px' }}>
                    <div>
                        <label>Edad:</label><br/>
                        <input type="number" required value={formData.edad} onChange={e => setFormData({...formData, edad: e.target.value})} style={{width: '100%', padding: '5px'}} min="18" max="100"/>
                    </div>
                    <div>
                        <label>Género:</label><br/>
                        <select value={formData.genero} onChange={e => setFormData({...formData, genero: e.target.value})} style={{width: '100%', padding: '5px'}}>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>
                    <div>
                        <label>Teléfono:</label><br/>
                        <input type="text" required value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} style={{width: '100%', padding: '5px'}}/>
                    </div>
                    <div>
                        <label>Dirección:</label><br/>
                        <input type="text" value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} style={{width: '100%', padding: '5px'}}/>
                    </div>
                    <div>
                        <label>Ocupación:</label><br/>
                        <input type="text" value={formData.ocupacion} onChange={e => setFormData({...formData, ocupacion: e.target.value})} style={{width: '100%', padding: '5px'}}/>
                    </div>
                    <button type="submit" style={{ backgroundColor: '#0078d4', color: 'white', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px', fontWeight: 'bold' }}>
                        Completar Registro
                    </button>
                </form>
            </div>
        );
    }

    return null;
}