/** @format */

import { TokenManager } from "../auth/TokenManager";
import type { User, GetCurrentUserOptions } from "../types";

const API_BASE = "https://api.sytacle.com";

export async function getCurrentUser(
    options?: GetCurrentUserOptions
): Promise<User | null> {
    const accessToken = options?.accessToken ?? TokenManager.getToken();

    const headers: HeadersInit = {
        "Content-Type": "application/json"
    };

    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    try {
        const res = await fetch(`${API_BASE}/v2/accounts/info`, {
            method: "GET",
            credentials: "include",
            headers
        });

        if (!res.ok) {
            if (res.status === 401) {
                TokenManager.clearToken();
            }
            return null;
        }

        const user: User = await res.json();
        return user;
    } catch {
        return null;
    }
}
