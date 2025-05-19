"use client";

import { TextField } from "@/components";
import React from "react";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";

type FormValues = {
    username: string;
    email: string;
    password: string;
};

export const RegisterForm = () => {
    const form = useForm<FormValues>();

    const { handleSubmit } = form;

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        console.log(data);
    };

    return (
        <FormProvider {...form}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="max-w-md mx-auto p-4 -mt-6"
            >
                <TextField
                    name="username"
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
