"use server";

import { User } from "@/types/entities";
import { LoginPayload } from "@/types/auth";
import { cookies } from "next/headers";
import { AuthApiService } from "@/services/auth";
import UserApiService from "@/services/user/user.api";

export const login = async (formData: LoginPayload): Promise<User> => {
    try {
        console.log(formData);
        const response = await AuthApiService.login(formData);
        if (!response) {
            throw new Error("No response from server");
        }

        const { accessToken, refreshToken, expiresIn } = response;

        const cookieStore = await cookies();

        cookieStore.set("accessToken", accessToken, {
            path: "/",
            maxAge: expiresIn,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        cookieStore.set("refreshToken", refreshToken, {
            path: "/",
            maxAge: formData.rememberMe ? 60 * 60 * 24 * 30 : undefined,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        const user = await UserApiService.getMe();

        if (!user) {
            throw new Error("No user data");
        }

        return user;
    } catch (error) {
        console.error("Login error:", error);
        throw new Error(error instanceof Error ? error.message : "Login failed");
    }
};
