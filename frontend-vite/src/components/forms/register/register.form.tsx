import {showToast, TextField} from "@/components";
import React from "react";
import {FormProvider, type SubmitHandler, useForm} from "react-hook-form";
import {useAuthStore} from "@/store/authStore.ts";

type FormValues = {
    userName: string;
    email: string;
    password: string;
};

export const RegisterForm: React.FC = () => {
    const form = useForm<FormValues>();
    const {register} = useAuthStore();

    const {handleSubmit} = form;

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            await register(data);
            showToast.success("Registration successful");
        } catch (error) {
            console.error("Registration error:", error);
            showToast.error("Registration failed. Please try again.");
        }
    };

    return (
        <FormProvider {...form}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="max-w-md mx-auto p-4 -mt-6"
            >
                <TextField
                    name="userName"
                    placeholder="Username"
                    validation={{
                        required: "Username is required",
                        minLength: {
                            value: 3,
                            message: "Username must be at least 3 characters",
                        },
                    }}
                />

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
