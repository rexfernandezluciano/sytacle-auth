<!-- @format -->

# Changelog

All notable changes to this project will be documented in this file.

## [1.0.5] - 2025-12-04
### Fixed
- Bug fixes
- Improved authentication

## [1.0.4] - 2025-12-04
### Fixed
- Bug fixes

## [1.0.3] - 2025-11-26

### Added
- **Two login methods**: Split authentication into separate functions
  - `loginWithPopup()` - Opens Account Chooser (default, recommended)
  - `loginWithAuthorization()` - Opens direct Authorization page
- **TokenManager**: Secure token storage system
  - Automatic token storage in sessionStorage
  - Token expiration handling with auto-cleanup
  - `isAuthenticated()` method to check auth state
  - Tokens auto-clear on 401 responses
- **Bearer token support**: `getCurrentUser()` now uses Authorization header
  - Accepts optional `accessToken` parameter
  - Falls back to stored token from TokenManager
- **Logout function**: Proper session cleanup
  - `logout()` clears local tokens
  - `logout({ revokeToken: true })` also revokes on server
- **TypeScript types**: Full type definitions exported
  - `User`, `UserRole`, `LoginResult`, `LoginOptions`, `GetCurrentUserOptions`
- **Test suite**: Unit tests for SDK components
  - 12 tests for SytacleAuth
  - 8 tests for TokenManager
  - Interactive browser test page (`test/index.html`)
- **Popup improvements**
  - Popup close detection
  - Error event handling
  - Scrollbars and resizable window

### Changed
- `loginWithPopup()` now defaults to Account Chooser flow
- Removed `useChooser` option (use separate functions instead)
- Internal variable naming consistency (`#chooser` instead of `#useChooser`)

### Security
- Tokens stored in sessionStorage (cleared on tab close)
- Automatic token cleanup on 401 responses
- CSRF protection via state parameter
- Server-side token revocation support

## [1.0.2] - 2025-11-26

### Fixed
- Bug fixes
- Code optimization

## [1.0.1] - 2025-10-06

### Fixed
- Bug fixes

## [1.0.0] - 2025-10-04

### Added
- Initial release
- Popup-based OAuth authentication
- Support for multiple scopes
- CDN-ready browser bundle
- TypeScript support
