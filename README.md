<!-- @format -->

@sytacle/auth

Secure popup-based authentication for apps published through the Sytacle App Store.

---

🔑 Getting Started

To use this SDK, your app must be published via the Sytacle App Store.

Get your clientId from your app console:  
https://store.sytacle.com/console/apps/{appId}/oauth

---

🚀 Usage

```ts
import { loginWithPopup, getCurrentUser } from "@sytacle/auth";

// Trigger login flow
const result = await loginWithPopup({
    clientId: "xzy123",
    scopes: ["profile", "email"]
});

// Access token and user info
const token = result.accessToken;
const user = result.user;

// Fetch current session user
const currentUser = await getCurrentUser();

console.log(currentUser.name); // e.g. "Jane Doe"
console.log(currentUser.avatar); // URL to avatar image
console.log(currentUser.username); // e.g. "janedoe"
console.log(currentUser.email); // e.g. "jane@example.com"
console.log(currentUser.role.type); // e.g. "admin"
console.log(currentUser.role.access); // e.g. ["view", "read"]
```

---

📦 CDN Delivery

You can also load the SDK directly in the browser via CDN:

```html
<script type="module">
    import { loginWithPopup } from "https://cdn.jsdelivr.net/npm/@sytacle/auth@1.0.1/dist/v1/auth.min.js";

    loginWithPopup({ clientId: "xzy123" }).then(result => {
        console.log(result.user);
    });
</script>
```
