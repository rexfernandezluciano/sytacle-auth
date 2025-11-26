/** @format */

import { TokenManager } from "../auth/TokenManager";

const API_BASE = "https://api.sytacle.com";

export interface LogoutOptions {
    revokeToken?: boolean;
}

export async function logout(options?: LogoutOptions): Promise<void> {
    const accessToken = TokenManager.getToken();

    if (options?.revokeToken && accessToken) {
        try {
            await fetch(`${API_BASE}/v2/auth/revoke`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                }
            });
        } catch {
            // Silent fail - token will be cleared locally regardless
        }
    }

    TokenManager.clearToken();

    if (typeof document !== "undefined") {
        document.cookie =
            "sytacle_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
}
