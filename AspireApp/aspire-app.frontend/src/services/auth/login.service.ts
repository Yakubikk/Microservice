import { User } from "@/types/entities";
import { LoginPayload } from "@/types/auth";
import { ApiService } from "@/services/api";
import { cookies } from "next/headers";

export const login = async (formData: LoginPayload): Promise<User> => {
    try {
        const response = await ApiService.postLogin(formData);
        if (!response) {
            throw new Error("Login failed");
        }
        const { accessToken, refreshToken, expiresIn, user } = response;

        const cookieStore = await cookies();

        cookieStore.set("accessToken", accessToken, {
            path: "/",
            maxAge: 1 * 60 * 60,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        cookieStore.set("refreshToken", refreshToken, {
            path: "/",
            maxAge: expiresIn,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return user;
    } catch (error) {
        console.error("Login error:", error);
        throw new Error("Login failed");
    }
};
