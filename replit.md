# @sytacle/auth

## Overview
This is a TypeScript SDK/library for secure popup-based authentication for apps published through the Sytacle App Store. It's not a web application - it's a library package that gets built and can be published to npm or used via CDN.

**Current State**: Successfully built with improved security and Bearer token support.

## Project Architecture

### Project Type
- **Type**: TypeScript Library/SDK (not a web application)
- **Build System**: Webpack + TypeScript
- **Output**: Multiple distribution formats (ESM, CJS, types)

### Directory Structure
- `src/` - TypeScript source files
  - `auth/` - Authentication managers (TokenManager, CookieAuthManager)
  - `methods/` - Public API methods (loginWithPopup, getCurrentUser, logout)
  - `provider/` - Core authentication provider (SytacleAuth)
  - `types/` - TypeScript interfaces and type definitions
  - `index.ts` - Main entry point with all exports
- `dist/` - Built output (generated, not in git)
  - `dist/v1/auth.min.js` - Minified browser bundle
  - `dist/*.js` - CommonJS modules
  - `dist/*.d.ts` - TypeScript type definitions

### Build Configuration
- **Webpack**: Builds minified browser bundle (`dist/v1/auth.min.js`)
- **TypeScript**: Compiles to CommonJS and generates type definitions
- **Target**: ES6, NodeNext module resolution

### Key Features
- Popup-based OAuth authentication flow
- **Bearer token authentication with TokenManager**
- Automatic token storage in sessionStorage
- Token expiration handling and auto-cleanup
- Support for multiple scopes (profile, email, etc.)
- Server-side token revocation on logout
- CDN-ready browser bundle
- Full TypeScript support with exported types

## API Exports
- `loginWithPopup(options)` - Opens Account Chooser popup (default login method)
- `loginWithAuthorization(options)` - Opens direct Authorization popup
- `getCurrentUser(options?)` - Fetches user info using Bearer token
- `logout(options?)` - Clears tokens locally and optionally on server
- `TokenManager` - Direct access to token storage/retrieval
- `SytacleAuth` - Core auth provider class
- Types: `User`, `UserRole`, `LoginResult`, `LoginOptions`, `GetCurrentUserOptions`

## Scripts
- `npm run build` - Full build (webpack + tsc)
- `npm run dev` - Watch mode for development

## Dependencies
**Dev Dependencies Only**:
- TypeScript 5.2+
- Webpack 5.90+
- ts-loader 9.5+

**No Runtime Dependencies** - This is a zero-dependency library.

## Recent Changes
- **2025-11-26**: Split login methods
  - `loginWithPopup` now defaults to Account Chooser flow
  - Added `loginWithAuthorization` for direct authorization flow
  - Removed `useChooser` option from LoginOptions (use separate functions instead)

- **2025-11-26**: Security & optimization improvements
  - Added TokenManager for secure token storage with sessionStorage
  - Updated getCurrentUser to accept Bearer token via options or TokenManager
  - loginWithPopup now auto-stores access token after successful auth
  - Added proper logout function with optional server-side token revocation
  - Added TypeScript interfaces (User, LoginResult, LoginOptions, etc.)
  - Tokens auto-clear on 401 responses for better security
  - Added popup close detection and error handling
  - Updated README with comprehensive documentation

- **2025-11-26**: Initial Replit setup
  - Installed npm dependencies
  - Verified build process works correctly
  - Set up build workflow for Replit environment
  - Created project documentation

## Notes
- This project has no frontend/backend - it's a library that other projects consume
- The built files in `dist/` are used by consumers of this package
- Main use case: Apps published to Sytacle App Store that need authentication
- Tokens are stored in sessionStorage (cleared when browser tab closes)
