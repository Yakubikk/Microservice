export interface LoginPayload {
    email: string;
    password: string;
    rememberMe: boolean;
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
}
