/** @format */

import { SytacleAuth } from "../provider/SytacleAuth";

export async function loginWithPopup({
    clientId,
    scopes = ["profile"],
    timeout = 60000,
    useChooser = false
}: {
    clientId: string;
    scopes?: string[];
    timeout?: number;
    useChooser?: boolean;
}): Promise<any> {
    const auth = new SytacleAuth({
        id: clientId,
        scopes,
        chooser: useChooser,
        signInFlow: "popup"
    });

    return new Promise((resolve, reject) => {
        const popup = window.open(
            auth.getLoginUrl(),
            "SytacleLogin",
            "width=500,height=600"
        );

        if (!popup) return reject(new Error("Popup blocked or failed to open"));

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
                resolve({
                    user: event.data.user,
                    accessToken: event.data.token
                });
            }
        };

        window.addEventListener("message", listener);
    });
}
