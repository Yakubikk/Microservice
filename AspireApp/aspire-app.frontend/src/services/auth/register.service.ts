import { RegisterPayload } from "@/types/auth";
import { ApiService } from "@/services/api";

export const register = async (formData: RegisterPayload): Promise<string> => {
    try {
        const response = await ApiService.postRegister(formData);
        if (!response) {
            throw new Error("Register failed");
        }

        const { message } = response;

        return message;
    } catch (error) {
        console.error("Register error:", error);
        throw new Error("Register failed");
    }
};
