export const msalConfig = {
    auth: {
        clientId: "5afd63dd-9376-4b61-a4f7-688b2cb81fd6",
        authority: "https://login.microsoftonline.com/78b145ef-56b9-4397-b87c-27b242a9fce5",
        
        // Toma la variable de entorno de Vite o por defecto el origen actual del navegador (ej. http://localhost)
        redirectUri: import.meta.env.VITE_REDIRECT_URI || window.location.origin,
        postLogoutRedirectUri: import.meta.env.VITE_POST_LOGOUT_REDIRECT_URI || import.meta.env.VITE_REDIRECT_URI || window.location.origin,
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    },
};

// Permisos (scopes) que solicitas al iniciar sesión
export const loginRequest = {
    scopes: ["User.Read"]
};

// Scopes para consumir TU PROPIO backend
export const apiRequest = {
    scopes: ["api://5afd63dd-9376-4b61-a4f7-688b2cb81fd6/read-write"]
};