/** @format */

import { SytacleAuth } from "../provider/SytacleAuth";
import { TokenManager } from "../auth/TokenManager";
import type { LoginResult, LoginOptions } from "../types";

export async function loginWithAuthorization({
    clientId,
    scopes = ["profile"],
    timeout = 60000
}: LoginOptions): Promise<LoginResult> {
    const auth = new SytacleAuth({
        id: clientId,
        scopes,
        chooser: false,
        signInFlow: "popup"
    });

    return new Promise((resolve, reject) => {
        const popup = window.open(
            auth.getLoginUrl(),
            "SytacleLogin",
            "width=500,height=600,scrollbars=yes,resizable=yes"
        );

        if (!popup) {
            return reject(new Error("Popup blocked or failed to open"));
        }

        const timer = setTimeout(() => {
            window.removeEventListener("message", listener);
            popup.close();
            reject(new Error("Login timed out"));
        }, timeout);

        const listener = (event: MessageEvent) => {
            if (event.origin !== auth.getOrigin()) return;

            if (event.data?.type === "sytacle-auth") {
                clearTimeout(timer);
                window.removeEventListener("message", listener);
                popup.close();

                const responseState = event.data.state;
                if (!auth.verifyState(responseState)) {
                    return reject(
                        new Error("State verification failed: possible CSRF attack")
                    );
                }

                const accessToken = event.data.token;
                const user = event.data.user;

                if (accessToken) {
                    TokenManager.setToken(accessToken, event.data.expiresIn);
                }

                resolve({
                    user,
                    accessToken
                });
            }

            if (event.data?.type === "sytacle-auth-error") {
                clearTimeout(timer);
                window.removeEventListener("message", listener);
                popup.close();
                reject(new Error(event.data.error || "Authentication failed"));
            }
        };

        window.addEventListener("message", listener);

        const pollTimer = setInterval(() => {
            if (popup.closed) {
                clearInterval(pollTimer);
                clearTimeout(timer);
                window.removeEventListener("message", listener);
                reject(new Error("Popup was closed before authentication completed"));
            }
        }, 500);
    });
}
