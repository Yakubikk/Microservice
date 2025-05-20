import api from "@/services/api";
import type {User} from "@/types/entities";
import {getResponseData} from "@/services/utils/api.utils";

const UserApiService = {
    updateUser: async (formData: {
        userName?: string;
        email?: string;
        phoneNumber?: string;
        password?: string;
        newPassword?: string;
    }): Promise<{ message: string } | undefined> => {
        return getResponseData<{ message: string }>(
            await api.put("/api/user", formData)
        );
    },
    updateUserById: async (
        data: { id: string },
        formData: {
            userName?: string;
            email?: string;
            phoneNumber?: string;
            password?: string;
            newPassword?: string;
        }
    ): Promise<{ message: string } | undefined> => {
        return getResponseData<{ message: string }>(
            await api.put(`/api/user/${data.id}`, formData)
        );
    },
    deleteUserById: async (data: { id: string }): Promise<{ message: string } | undefined> => {
        return getResponseData<{ message: string }>(
            await api.delete(`/api/user/${data.id}`)
        );
    },
    getUsers: async (): Promise<{ users: User[] } | undefined> => {
        return getResponseData<{ users: User[] }>(
            await api.get("/api/user")
        );
    },
    getMe: async (): Promise<User | undefined> => {
        return getResponseData<User>(
            await api.get("/api/user/me")
        );
    },
    getUserById: async (data: { id: string }): Promise<{ user: User } | undefined> => {
        return getResponseData<{ user: User }>(
            await api.get(`/api/user/${data.id}`)
        );
    },
};

export {UserApiService};
export default UserApiService;
