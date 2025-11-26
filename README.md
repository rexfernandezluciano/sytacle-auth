<!-- @format -->

# @sytacle/auth

Secure popup-based authentication for apps published through the Sytacle App Store.

[![npm version](https://img.shields.io/npm/v/@sytacle/auth.svg)](https://www.npmjs.com/package/@sytacle/auth)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- Two login methods: Account Chooser & Direct Authorization
- Automatic token management with sessionStorage
- Token expiration handling
- Server-side token revocation
- Full TypeScript support
- Zero runtime dependencies
- CDN-ready browser bundle

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

## Quick Start

```ts
import { loginWithPopup, getCurrentUser, logout } from "@sytacle/auth";

// 1. Login (opens Account Chooser popup)
const result = await loginWithPopup({
    clientId: "your-client-id",
    scopes: ["profile", "email"]
});

console.log("Welcome,", result.user.name);

// 2. Get current user (token is automatically used)
const user = await getCurrentUser();

// 3. Logout
await logout();
```

---

## Login Methods

The SDK provides two login methods:

| Method | Flow | Description |
|--------|------|-------------|
| `loginWithPopup` | Account Chooser | Default - lets users pick from saved accounts |
| `loginWithAuthorization` | Direct Authorization | Skips account selection, goes straight to login |

### Account Chooser (Recommended)

```ts
import { loginWithPopup } from "@sytacle/auth";

const result = await loginWithPopup({
    clientId: "xzy123",
    scopes: ["profile", "email"]
});

// Token is automatically stored for subsequent API calls
console.log(result.user.name);
console.log(result.accessToken);
```

### Direct Authorization

```ts
import { loginWithAuthorization } from "@sytacle/auth";

const result = await loginWithAuthorization({
    clientId: "xzy123",
    scopes: ["profile", "email"]
});

console.log(result.user);
```

---

## Getting User Information

```ts
import { getCurrentUser } from "@sytacle/auth";

// Uses stored token automatically
const user = await getCurrentUser();

if (user) {
    console.log(user.name);      // "Jane Doe"
    console.log(user.username);  // "janedoe"
    console.log(user.email);     // "jane@example.com"
    console.log(user.avatar);    // URL to avatar image
    console.log(user.role?.type);   // "admin"
    console.log(user.role?.access); // ["view", "read"]
}

// Or pass token explicitly
const user = await getCurrentUser({
    accessToken: "your-access-token"
});
```

---

## Token Management

```ts
import { TokenManager } from "@sytacle/auth";

// Check authentication state
if (TokenManager.isAuthenticated()) {
    console.log("User is logged in");
}

// Get the current access token
const token = TokenManager.getToken();

// Clear the token manually
TokenManager.clearToken();
```

---

## Logout

```ts
import { logout } from "@sytacle/auth";

// Clear local tokens only
await logout();

// Clear local tokens AND revoke on server
await logout({ revokeToken: true });
```

---

## API Reference

### loginWithPopup(options)

Opens a popup window with Account Chooser for user authentication.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| clientId | string | required | Your app's OAuth client ID |
| scopes | string[] | ["profile"] | Requested permission scopes |
| timeout | number | 60000 | Timeout in milliseconds |

Returns: `Promise<LoginResult>`

### loginWithAuthorization(options)

Opens a popup window with direct Authorization page.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| clientId | string | required | Your app's OAuth client ID |
| scopes | string[] | ["profile"] | Requested permission scopes |
| timeout | number | 60000 | Timeout in milliseconds |

Returns: `Promise<LoginResult>`

### getCurrentUser(options?)

Fetches the currently authenticated user's information using Bearer token.

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

### TokenManager

Singleton for managing access tokens.

| Method | Returns | Description |
|--------|---------|-------------|
| `getToken()` | `string \| null` | Get the current access token |
| `setToken(token, expiresIn?)` | `void` | Store an access token |
| `clearToken()` | `void` | Clear the stored token |
| `isAuthenticated()` | `boolean` | Check if user has a valid token |

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

interface GetCurrentUserOptions {
    accessToken?: string;
}
```

---

## CDN Usage

Load the SDK directly in the browser:

```html
<script type="module">
    import { 
        loginWithPopup, 
        loginWithAuthorization,
        getCurrentUser, 
        logout,
        TokenManager
    } from "https://cdn.jsdelivr.net/npm/@sytacle/auth@latest/dist/v1/auth.min.js";

    // Account Chooser (recommended)
    document.getElementById('loginBtn').onclick = async () => {
        const result = await loginWithPopup({ clientId: "xzy123" });
        console.log("Logged in as:", result.user.name);
    };

    // Check auth state on page load
    if (TokenManager.isAuthenticated()) {
        const user = await getCurrentUser();
        console.log("Welcome back,", user.name);
    }
</script>
```

---

## Security

- **Session Storage**: Tokens are stored in sessionStorage and cleared when the browser tab closes
- **Auto-cleanup**: Tokens are automatically cleared on 401 responses
- **CSRF Protection**: State parameter included in OAuth flow
- **Server Revocation**: Use `logout({ revokeToken: true })` to invalidate tokens on the server
- **HTTPS Required**: Always use HTTPS in production

---

## Testing

Run the test suite:

```bash
npm run test        # Run all tests
npm run test:unit   # Run SytacleAuth tests only
npm run test:token  # Run TokenManager tests only
```

Open `test/index.html` in a browser for interactive testing.

---

## License

MIT
