"use client";

import { showToast, TextField } from "@/components";
import { login as postLogin } from "@/services/auth";
import { useUserStore } from "@/store/user/user.store";
import React from "react";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";

type FormValues = {
    email: string;
    password: string;
    rememberMe: boolean;
};

const LoginForm: React.FC = () => {
    const form = useForm<FormValues>();
    const { login } = useUserStore();

    const { handleSubmit } = form;

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            const response = await postLogin(data);

            if (!response) {
                throw new Error("Login failed");
            }

            login(response);

            showToast.success("Login successful");
        } catch (error) {
            console.error("Login error:", error);
            showToast.error("Login failed. Please try again.");
        }
    };

    return (
        <FormProvider {...form}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="max-w-md mx-auto p-4 -mt-6"
            >
                <TextField
                    name="email"
                    placeholder="Email"
                    type="email"
                    validation={{
                        required: "Email is required",
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                        },
                    }}
                />

                <TextField
                    name="password"
                    placeholder="Password"
                    type="password"
                    validation={{
                        required: "Password is required",
                        minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                        },
                    }}
                />

                <input
                    type="checkbox"
                    className="mt-4"
                    {...form.register("rememberMe")}
                    id="rememberMe"
                />

                <button
                    type="submit"
                    className="w-full mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Submit
                </button>
            </form>
        </FormProvider>
    );
};

export { LoginForm };
export default LoginForm;
