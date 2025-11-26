<!-- @format -->

@sytacle/auth

Secure popup-based authentication for apps published through the Sytacle App Store.

---

## Getting Started

To use this SDK, your app must be published via the Sytacle App Store.

Get your clientId from your app console:  
https://store.sytacle.com/console/apps/{appId}/oauth

---

## Installation

```bash
npm install @sytacle/auth
```

---

## Usage

### Login Methods

The SDK provides two login methods:

| Method | Description | Use Case |
|--------|-------------|----------|
| `loginWithPopup` | Opens Account Chooser popup | Default - lets users pick from saved accounts |
| `loginWithAuthorization` | Opens direct Authorization popup | Direct login without account selection |

### Account Chooser (Default)

```ts
import { loginWithPopup, getCurrentUser, logout } from "@sytacle/auth";

// Opens Account Chooser - user can select from saved accounts
const result = await loginWithPopup({
    clientId: "xzy123",
    scopes: ["profile", "email"]
});

// Access token is automatically stored for subsequent API calls
const token = result.accessToken;
const user = result.user;

// Fetch current session user (uses stored token automatically)
const currentUser = await getCurrentUser();

console.log(currentUser.name); // e.g. "Jane Doe"
console.log(currentUser.avatar); // URL to avatar image
console.log(currentUser.username); // e.g. "janedoe"
console.log(currentUser.email); // e.g. "jane@example.com"
console.log(currentUser.role.type); // e.g. "admin"
console.log(currentUser.role.access); // e.g. ["view", "read"]

// Logout user
await logout();
```

### Direct Authorization

```ts
import { loginWithAuthorization } from "@sytacle/auth";

// Opens direct Authorization page - skips account selection
const result = await loginWithAuthorization({
    clientId: "xzy123",
    scopes: ["profile", "email"]
});

console.log(result.user);
console.log(result.accessToken);
```

### Using Access Token Explicitly

If you need to pass the token explicitly (e.g., for server-side validation):

```ts
import { getCurrentUser } from "@sytacle/auth";

// Pass token explicitly
const currentUser = await getCurrentUser({
    accessToken: "your-access-token-here"
});
```

### Token Management

```ts
import { TokenManager } from "@sytacle/auth";

// Check if user is authenticated
if (TokenManager.isAuthenticated()) {
    console.log("User is logged in");
}

// Get the current access token
const token = TokenManager.getToken();

// Clear the token (logout)
TokenManager.clearToken();
```

---

## API Reference

### loginWithPopup(options)

Opens a popup window with Account Chooser for user authentication. Users can select from previously saved accounts.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| clientId | string | required | Your app's OAuth client ID |
| scopes | string[] | ["profile"] | Requested permission scopes |
| timeout | number | 60000 | Timeout in milliseconds |

Returns: `Promise<LoginResult>`

### loginWithAuthorization(options)

Opens a popup window with direct Authorization page. Skips the account chooser step.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| clientId | string | required | Your app's OAuth client ID |
| scopes | string[] | ["profile"] | Requested permission scopes |
| timeout | number | 60000 | Timeout in milliseconds |

Returns: `Promise<LoginResult>`

### getCurrentUser(options?)

Fetches the currently authenticated user's information.

| Option | Type | Description |
|--------|------|-------------|
| accessToken | string | Optional. Pass token explicitly instead of using stored token |

Returns: `Promise<User | null>`

### logout(options?)

Logs out the current user and clears stored tokens.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| revokeToken | boolean | false | If true, revokes the token on the server |

Returns: `Promise<void>`

---

## TypeScript Types

```ts
interface User {
    id: string;
    name: string;
    username: string;
    email?: string;
    avatar?: string;
    role?: UserRole;
}

interface UserRole {
    type: string;
    access: string[];
}

interface LoginResult {
    user: User;
    accessToken: string;
}

interface LoginOptions {
    clientId: string;
    scopes?: string[];
    timeout?: number;
}
```

---

## CDN Delivery

You can also load the SDK directly in the browser via CDN:

```html
<script type="module">
    import { 
        loginWithPopup, 
        loginWithAuthorization,
        getCurrentUser, 
        logout 
    } from "https://cdn.jsdelivr.net/npm/@sytacle/auth@latest/dist/v1/auth.min.js";

    // Account Chooser (default)
    loginWithPopup({ clientId: "xzy123" }).then(result => {
        console.log(result.user);
    });

    // Or direct Authorization
    loginWithAuthorization({ clientId: "xzy123" }).then(result => {
        console.log(result.user);
    });
</script>
```

---

## Security Notes

- Access tokens are stored in sessionStorage (cleared when browser tab closes)
- Tokens are automatically cleared on 401 responses
- Use `logout({ revokeToken: true })` to revoke tokens on the server
- Always use HTTPS in production
