export interface Department {
    id: string;
    name: string;
    description: string;
}

export type UserRole = 'User' | 'Admin' | 'Guest' | 'Moderator';

export interface User {
    id: string;
    userName: string;
    email: string;
    phoneNumber?: string;
    createdAt: string;
    updatedAt: string;
    avatarUrl: string;
    roles: UserRole[];
}

export interface RegisterPayload {
    email: string;
    password: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginPhonePayload {
    phone: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export interface LoginPhoneResponse {
    code: string;
}

export interface LoginCodePayload {
    code: string;
    phone: string;
}

export interface LoginCodeResponse {
    id: string;
}

