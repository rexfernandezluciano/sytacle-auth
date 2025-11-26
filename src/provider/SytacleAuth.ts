/** @format */

export class SytacleAuth {
    static AUTH_URL = "https://accounts.sytacle.com/authorize";
    static CHOOSER_URL = "https://accounts.sytacle.com/chooser";
    static ORIGIN = "https://accounts.sytacle.com";

    #clientId: string;
    #scopes: string[];
    #redirectUri: string;
    #state: string;
    #useChooser: boolean;
    #signInFlow: string;

    constructor({
        id,
        scopes = ["profile"],
        url = window.location.href,
        chooser = false,
        signInFlow = "popup"
    }: {
        id: string;
        scopes?: string[];
        url?: string;
        chooser?: boolean;
        signInFlow?: string;
    }) {
        this.#clientId = id;
        this.#scopes = scopes;
        this.#redirectUri = url;
        this.#state = crypto.randomUUID();
        this.#useChooser = chooser;
        this.#signInFlow = signInFlow;
    }

    getLoginUrl(): string {
        return this.#useChooser ? this.getChooserUrl() : this.getAuthUrl();
    }

    getAuthUrl(): string {
        const params = new URLSearchParams({
            client_id: this.#clientId,
            response_type: "code",
            scope: this.#scopes.join(" "),
            signin_flow: "authorize",
            redirect_uri: this.#redirectUri,
            state: this.#state
        });
        return `${SytacleAuth.AUTH_URL}?${params.toString()}`;
    }

    getChooserUrl(): string {
        const params = new URLSearchParams({
            id: this.#clientId,
            name: "Sytacle",
            signin_flow: this.#signInFlow,
            redirect_uri: this.#redirectUri,
            state: this.#state
        });
        return `${SytacleAuth.CHOOSER_URL}?${params.toString()}`;
    }

    getOrigin(): string {
        return SytacleAuth.ORIGIN;
    }
}
