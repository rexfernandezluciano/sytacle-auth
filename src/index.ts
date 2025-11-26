/** @format */

export { SytacleAuth } from "./provider/SytacleAuth";
export { loginWithPopup } from "./methods/loginWithPopup";
export { loginWithAuthorization } from "./methods/loginWithAuthorization";
export { getCurrentUser } from "./methods/getCurrentUser";
export { logout } from "./methods/logout";
export { TokenManager } from "./auth/TokenManager";

export type {
    User,
    UserRole,
    LoginResult,
    LoginOptions,
    GetCurrentUserOptions
} from "./types";
