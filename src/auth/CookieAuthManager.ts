/**
 * CookieAuthManager.ts
 *
 * @format
 */

export class CookieAuthManager {
    private cookieName = "sytacle_access_token";
    private fallbackToken: string | null = null;

    constructor(private apiBase: string) {}

    /** Read cookie value (if accessible) */
    getCookie(): string | null {
        if (typeof document === "undefined") return null;
        const match = document.cookie.match(
            new RegExp(`(^| )${this.cookieName}=([^;]+)`)
        );
        return match ? decodeURIComponent(match[2]) : null;
    }

    /** Set fallback token manually (e.g. from login response) */
    setFallbackToken(token: string) {
        this.fallbackToken = token;
    }

    /** Get current user info using cookie or fallback token */
    async getCurrentUser(): Promise<any> {
        const headers: HeadersInit = {
            "Content-Type": "application/json"
        };

        if (!this.getCookie() && this.fallbackToken) {
            headers["Authorization"] = `Bearer ${this.fallbackToken}`;
        }

        const res = await fetch(`${this.apiBase}/v2/accounts/info`, {
            method: "GET",
            credentials: "include",
            headers
        });

        if (!res.ok) return null;
        return await res.json();
    }

    /** Clear cookie (if accessible) and fallback */
    clearAuth() {
        if (typeof document !== "undefined") {
            document.cookie = `${this.cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
        this.fallbackToken = null;
    }
}
