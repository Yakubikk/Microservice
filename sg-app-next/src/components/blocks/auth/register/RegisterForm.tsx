"use client";

import React, { useActionState, useEffect } from "react";
import { register } from "@/lib/actions/auth.actions";
import { FormProvider, SubmitButton, TextField } from "@/components";
import toast from "react-hot-toast";

const RegisterForm: React.FC = () => {
    const [state, registerAction] = useActionState(register, null);

    useEffect(() => {
        if (state?.errors) {
            const errorMessage =
                state.errors.email?.[0] || state.errors.password?.[0];
            if (errorMessage) {
                toast.error(errorMessage, {
                    style: {
                        minWidth: 'max-content',
                    },
                });
            }
        }
    }, [state?.errors]);

    return (
        <FormProvider state={state}>
            <form
                autoComplete="off"
                action={registerAction}
                className="flex max-w-[600px] flex-col gap-4"
            >
                <TextField
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                />

                <TextField
                    name="password"
                    type="password"
                    placeholder="Пароль"
                    required
                />

                <TextField
                    name="confirmPassword"
                    type="password"
                    placeholder="Подтвердите пароль"
                    required
                />

                <SubmitButton pendingText="Регистрация...">
                    Зарегистрироваться
                </SubmitButton>
            </form>
        </FormProvider>
    );
};

export { RegisterForm };
export default RegisterForm;
