# @sytacle/auth

## Overview
This is a TypeScript SDK/library for secure popup-based authentication for apps published through the Sytacle App Store. It's not a web application - it's a library package that gets built and can be published to npm or used via CDN.

**Current State**: Successfully imported and configured for the Replit environment. The build system is working correctly.

## Project Architecture

### Project Type
- **Type**: TypeScript Library/SDK (not a web application)
- **Build System**: Webpack + TypeScript
- **Output**: Multiple distribution formats (ESM, CJS, types)

### Directory Structure
- `src/` - TypeScript source files
  - `auth/` - Cookie-based authentication manager
  - `methods/` - Public API methods (loginWithPopup, getCurrentUser, logout)
  - `provider/` - Core authentication provider
  - `index.ts` - Main entry point
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
- Cookie-based session management
- Support for multiple scopes (profile, email, etc.)
- CDN-ready browser bundle
- TypeScript support with full type definitions

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
- **2025-11-26**: Initial Replit setup
  - Installed npm dependencies
  - Verified build process works correctly
  - Set up build workflow for Replit environment
  - Created project documentation

## Notes
- This project has no frontend/backend - it's a library that other projects consume
- The built files in `dist/` are used by consumers of this package
- Main use case: Apps published to Sytacle App Store that need authentication
