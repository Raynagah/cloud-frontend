
import {
    PublicClientApplication,
    InteractionRequiredAuthError
} from "@azure/msal-browser";

import { msalConfig, apiRequest } from "./AuthConfig";

export const msalInstance =
    new PublicClientApplication(msalConfig);

export const obtenerAccessToken = async () => {
    const cuenta =
        msalInstance.getActiveAccount() ||
        msalInstance.getAllAccounts()[0];

    if (!cuenta) {
        window.dispatchEvent(
            new Event('pedidos360:sesion-requerida')
        );

        throw new Error(
            "No existe una sesión activa de Microsoft."
        );
    }

    try {
        const response = await msalInstance.acquireTokenSilent({
            ...apiRequest,
            account: cuenta
        });

        return response.accessToken;

    } catch (error) {
        if (error instanceof InteractionRequiredAuthError) {
            window.dispatchEvent(
                new Event('pedidos360:sesion-requerida')
            );
        }

        throw error;
    }
};
