import axios, {
    type AxiosError,
    type AxiosRequestConfig,
    type AxiosResponse,
} from "axios";
import type {
    RegisterPayload,
    RegisterResponse,
    LoginPayload,
    LoginResponse,
    LoginPhonePayload,
    LoginPhoneResponse,
    LoginCodePayload,
} from "@/types/auth";
import type { User } from "@/types/entities";

const api = axios.create({
    baseURL: process.env.API_URL,
    headers: {
        "Accept-Language": "ru",
    },
} as AxiosRequestConfig);

const getResponseData = <T>(
    response: AxiosError | AxiosResponse
): T | undefined => {
    return (response as AxiosResponse<T>)?.data;
};

const ApiService = {
    postRegister: async (
        formData: RegisterPayload
    ): Promise<RegisterResponse | undefined> => {
        return getResponseData<RegisterResponse>(
            await api.post("/api/register", formData)
        );
    },
    postLogin: async (
        formData: LoginPayload
    ): Promise<LoginResponse | undefined> => {
        return getResponseData<LoginResponse>(
            await api.post("/api/login", formData)
        );
    },
    postPhoneLogin: async (
        formData: LoginPhonePayload
    ): Promise<LoginPhoneResponse | undefined> => {
        console.log(formData);
        return getResponseData<LoginPhoneResponse>(
            await api.post("/api/login-phone", formData)
        );
    },
    postCodeLogin: async (
        formData: LoginCodePayload
    ): Promise<LoginResponse | undefined> => {
        return getResponseData<LoginResponse>(
            await api.post("/api/login-code", formData)
        );
    },
    postLogout: async (): Promise<void> => {
        return getResponseData<void>(await api.post("/api/logout"));
    },
    postRefreshToken: async (): Promise<LoginResponse | undefined> => {
        return getResponseData<LoginResponse>(
            await api.post("/api/refresh-token")
        );
    },
    postForgotPassword: async (formData: {
        email: string;
    }): Promise<{ message: string } | undefined> => {
        return getResponseData<{ message: string }>(
            await api.post("/api/forgot-password", formData)
        );
    },
    postResetPassword: async (formData: {
        code: string;
    }): Promise<{ message: string } | undefined> => {
        return getResponseData<{ message: string }>(
            await api.post("/api/reset-password", formData)
        );
    },
    postChangePassword: async (formData: {
        oldPassword: string;
        newPassword: string;
    }): Promise<{ message: string } | undefined> => {
        return getResponseData<{ message: string }>(
            await api.post("/api/change-password", formData)
        );
    },
    postUpdateUser: async (formData: {
        userName?: string;
        email?: string;
        phoneNumber?: string;
        password?: string;
        newPassword?: string;
    }): Promise<{ message: string } | undefined> => {
        return getResponseData<{ message: string }>(
            await api.post("/api/update-user", formData)
        );
    },
    postUpdateUserById: async (
        data: {
            id: string;
        },
        formData: {
            userName?: string;
            email?: string;
            phoneNumber?: string;
            password?: string;
            newPassword?: string;
        }
    ): Promise<{ message: string } | undefined> => {
        return getResponseData<{ message: string }>(
            await api.post(`/api/update-user/${data.id}`, formData)
        );
    },
    postDeleteUser: async (data: {
        id: string;
    }): Promise<{ message: string } | undefined> => {
        return getResponseData<{ message: string }>(
            await api.post(`/api/delete-user/${data.id}`)
        );
    },
    postDeleteUserById: async (data: {
        id: string;
    }): Promise<{ message: string } | undefined> => {
        return getResponseData<{ message: string }>(
            await api.post(`/api/delete-user/${data.id}`)
        );
    },
    postGetUsers: async (): Promise<{ users: User[] } | undefined> => {
        return getResponseData<{ users: User[] }>(
            await api.post("/api/get-users")
        );
    },
    postGetUserById: async (data: {
        id: string;
    }): Promise<{ user: User } | undefined> => {
        return getResponseData<{ user: User }>(
            await api.post(`/api/get-user/${data.id}`)
        );
    },
};

export { ApiService };
export default ApiService;
