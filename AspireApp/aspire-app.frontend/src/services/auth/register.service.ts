"use server";

import {RegisterPayload} from "@/types/auth";
import {AuthApiService} from "@/services/auth";

export const register = async (formData: RegisterPayload): Promise<string> => {
    try {
        const response = await AuthApiService.register(formData);
        if (!response) {
            throw new Error("Register failed");
        }

        const {message} = response;

        return message;
    } catch (error) {
        console.error("Register error:", error);
        throw new Error("Register failed");
    }
};
