export interface RegisterPayload {
    userName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    rememberMe?: boolean;
}

export interface RegisterResponse {
    message: string;
}
