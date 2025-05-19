import { User } from "../entities/user";

export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginPhonePayload {
    phoneNumber: string;
}

export interface LoginPhoneResponse {
    code: string;
}

export interface LoginCodePayload {
    code: string;
}

export interface LoginResponse {
    tokenType: string;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: User;
}
