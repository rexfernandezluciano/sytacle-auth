/** @format */

export interface TokenData {
    accessToken: string;
    expiresAt?: number;
}

class TokenManagerClass {
    private token: string | null = null;
    private expiresAt: number | null = null;
    private readonly storageKey = "sytacle_access_token";

    setToken(accessToken: string, expiresIn?: number): void {
        this.token = accessToken;
        if (expiresIn) {
            this.expiresAt = Date.now() + expiresIn * 1000;
        }
        this.persistToken();
    }

    getToken(): string | null {
        if (this.token && this.isExpired()) {
            this.clearToken();
            return null;
        }
        if (!this.token) {
            this.loadToken();
        }
        return this.token;
    }

    clearToken(): void {
        this.token = null;
        this.expiresAt = null;
        this.removePersistedToken();
    }

    isAuthenticated(): boolean {
        return this.getToken() !== null;
    }

    private isExpired(): boolean {
        if (!this.expiresAt) return false;
        return Date.now() >= this.expiresAt;
    }

    private persistToken(): void {
        if (typeof sessionStorage === "undefined") return;
        try {
            const data: TokenData = {
                accessToken: this.token!,
                expiresAt: this.expiresAt ?? undefined
            };
            sessionStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch {
            // Silent fail for environments without sessionStorage
        }
    }

    private loadToken(): void {
        if (typeof sessionStorage === "undefined") return;
        try {
            const stored = sessionStorage.getItem(this.storageKey);
            if (stored) {
                const data: TokenData = JSON.parse(stored);
                this.token = data.accessToken;
                this.expiresAt = data.expiresAt ?? null;
                if (this.isExpired()) {
                    this.clearToken();
                }
            }
        } catch {
            // Silent fail for corrupted data
        }
    }

    private removePersistedToken(): void {
        if (typeof sessionStorage === "undefined") return;
        try {
            sessionStorage.removeItem(this.storageKey);
        } catch {
            // Silent fail
        }
    }
}

export const TokenManager = new TokenManagerClass();
