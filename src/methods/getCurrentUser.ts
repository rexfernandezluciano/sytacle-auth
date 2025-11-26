/** @format */

export async function getCurrentUser(): Promise<any> {
    const res = await fetch("https://api.sytacle.com/v2/accounts/info", {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!res.ok) return null;

    const user = await res.json();
    return user;
}
