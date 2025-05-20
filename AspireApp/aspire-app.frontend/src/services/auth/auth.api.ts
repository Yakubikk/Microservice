import api from "@/services/api";
import type {
    RegisterPayload,
    RegisterResponse,
    LoginPayload,
    LoginResponse,
    LoginPhonePayload,
    LoginPhoneResponse,
    LoginCodePayload,
} from "@/types/auth";
import { getResponseData } from "@/services/utils/api.utils";

const AuthApiService = {
    register: async (
        formData: RegisterPayload
    ): Promise<RegisterResponse | undefined> => {
        return getResponseData<RegisterResponse>(
            await api.post("api/user", formData)
        );
    },
    login: async (
        formData: LoginPayload
    ): Promise<LoginResponse | undefined> => {
        return getResponseData<LoginResponse>(
            await api.post("/login", formData)
        );
    },
    phoneLogin: async (
        formData: LoginPhonePayload
    ): Promise<LoginPhoneResponse | undefined> => {
        return getResponseData<LoginPhoneResponse>(
            await api.post("/api/login-phone", formData)
        );
    },
    codeLogin: async (
        formData: LoginCodePayload
    ): Promise<LoginResponse | undefined> => {
        return getResponseData<LoginResponse>(
            await api.post("/api/login-code", formData)
        );
    },
    logout: async (): Promise<void> => {
        return getResponseData<void>(await api.post("/api/logout"));
    },
    refreshToken: async (): Promise<LoginResponse | undefined> => {
        return getResponseData<LoginResponse>(
            await api.post("/refresh")
        );
    },
    forgotPassword: async (formData: {
        email: string;
    }): Promise<{ message: string } | undefined> => {
        return getResponseData<{ message: string }>(
            await api.post("/forgot-password", formData)
        );
    },
    resetPassword: async (formData: {
        code: string;
    }): Promise<{ message: string } | undefined> => {
        return getResponseData<{ message: string }>(
            await api.post("/reset-password", formData)
        );
    },
    changePassword: async (formData: {
        oldPassword: string;
        newPassword: string;
    }): Promise<{ message: string } | undefined> => {
        return getResponseData<{ message: string }>(
            await api.post("/change-password", formData)
        );
    },
};

export { AuthApiService };
export default AuthApiService;
