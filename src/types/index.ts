/** @format */

export interface UserRole {
    type: string;
    access: string[];
}

export interface User {
    id: string;
    name: string;
    username: string;
    email?: string;
    avatar?: string;
    role?: UserRole;
}

export interface LoginResult {
    user: User;
    accessToken: string;
}

export interface LoginOptions {
    clientId: string;
    scopes?: string[];
    timeout?: number;
}

export interface GetCurrentUserOptions {
    accessToken?: string;
}
