export interface User {
    id: string; // UUID
    email: string;
    username: string;
    password?: string;
    refresh_token?: string;
    created_at: Date;
}

export interface CreateUserDTO {
    email: string;
    username: string;
    password: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface LoginResponse {
    user: Omit<User, 'password' | 'refresh_token'>;
    accessToken: string;
    refreshToken: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface RefreshTokenResponse {
    accessToken: string;
}