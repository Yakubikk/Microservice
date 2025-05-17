"use server";

import { z } from "zod";
import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

// Схема для входа
const loginSchema = z.object({
    email: z
        .string()
        .email({ message: "Неверный адрес электронной почты" })
        .trim(),

    password: z
        .string()
        .min(8, { message: "Пароль должен содержать не менее 8 символов" })
        .trim(),

    rememberMe: z.string().optional(),
});

// Схема для регистрации (расширяет схему входа)
const registerSchema = loginSchema
    .extend({
        confirmPassword: z.string().trim(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Пароли не совпадают",
        path: ["confirmPassword"],
    });

export async function login(
    prevState: unknown,
    formData: FormData,
    ext: boolean = false
) {
    const result = loginSchema.safeParse(Object.fromEntries(formData));
    let token;

    if (!result.success) {
        console.log(result.error);
        return { errors: result.error.flatten().fieldErrors };
    }

    const { email, password, rememberMe } = result.data;

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return {
                errors: {
                    email: ["Неверный адрес электронной почты или пароль"],
                },
            };
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return {
                errors: {
                    email: ["Неверный адрес электронной почты или пароль"],
                },
            };
        }

        token = await createSession(user.id, user.role, rememberMe, ext);
    } catch (error) {
        console.error("Ошибка входа:", error);
    }

    if (!ext) redirect("/");
    else return { token };
}

export async function register(
    prevState: unknown,
    formData: FormData,
    ext: boolean = false
) {
    const result = registerSchema.safeParse(Object.fromEntries(formData));
    let token;

    if (!result.success) {
        return { errors: result.error.flatten().fieldErrors };
    }

    const { email, password } = result.data;

    try {
        // Проверка существующего пользователя
        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            return {
                errors: {
                    email: [
                        "Пользователь с таким адресом электронной почты уже существует",
                    ],
                },
            };
        }

        // Хеширование пароля и создание пользователя
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: { email, password: hashedPassword },
        });

        token = await createSession(newUser.id, newUser.role, undefined, ext);
    } catch (error) {
        console.error("Ошибка регистрации:", error);
    }

    if (!ext) redirect("/");
    else return { token };
}

export async function logout() {
    await deleteSession();
    redirect("/login");
}
