# Pedidos360 - Frontend React (`cloud-frontend`)

Aplicación web desarrollada en **React** que sirve como interfaz de usuario principal de la plataforma **Pedidos360**. Se comunica de forma centralizada con el microservicio **Backend-For-Frontend (BFF)** para autenticar usuarios mediante Azure AD, presentar el catálogo de productos y gestionar el carrito de compras en una experiencia unificada.

## 🛠️ Tecnologías Utilizadas

* **Librería Principal:** React 18+
* **Empaquetador:** Vite / Node.js
* **Autenticación:** MSAL (Microsoft Authentication Library / Azure AD)
* **Cliente HTTP:** Axios / Fetch API
* **Contenedorización:** Docker (Servidor Nginx para producción)

## 🚀 Integración con el Backend (BFF)

La aplicación consumirá de manera exclusiva las APIs expuestas por el **BFF** (`cloud-backend-bff`). No realiza peticiones directas a los microservicios de carrito o producto. Cada petición HTTP adjunta la cabecera `Authorization: Bearer <token>` obtenida tras el inicio de sesión exitoso con Microsoft Azure AD.

## ⚙️ Instalación y Ejecución

### Requisitos Previos

* Node.js 18.x o superior
* npm o yarn
* Docker (opcional)

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto basándote en la siguiente configuración:

| Variable | Descripción | Valor Ejemplo |
| :--- | :--- | :--- |
| `VITE_BFF_URL` | URL base del microservicio BFF | `http://localhost:8084` (o IP de la EC2 del BFF) |
| `VITE_AZURE_TENANT_ID` | ID del Inquilino en Azure AD | `78b145ef-56b9-4397-b87c-27b242a9fce5` |
| `VITE_AZURE_CLIENT_ID` | ID de la aplicación registrada en Azure | `<CLIENT_ID_AZURE>` |

### Ejecución en Desarrollo (Local)

1. **Instalar dependencias:**

```bash
npm install
```

2. **Iniciar servidor de desarrollo:**

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173` (o `http://localhost:3000`).

### Despliegue con Docker

1. **Construir la imagen:**

```bash
docker build -t pedidos360/frontend:v1 .
```

2. **Ejecutar contenedor:**

```bash
docker run -d \
  --name cloud-frontend \
  -p 80:80 \
  -e VITE_BFF_URL="http://<IP_EC2_BFF>:8084" \
  pedidos360/frontend:v1
```

---

## 🔗 Ecosistema de Repositorios

### Frontend

* [Frontend React (Este repositorio)](https://github.com/Raynagah/cloud-frontend.git)

### Backend

* [BFF Orchestrator](https://github.com/Raynagah/cloud-backend-bff)
* [Microservicio Producto](https://github.com/Raynagah/cloud-backend-producto)
* [Microservicio Carrito](https://github.com/Raynagah/cloud-backend-carrito)
* [Microservicio Usuarios](https://github.com/NBello26/ms-usuarios-cloud.git)