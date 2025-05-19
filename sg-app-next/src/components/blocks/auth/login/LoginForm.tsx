"use client";

import React, { useActionState, useEffect } from "react";
import { login } from "@/lib/actions/auth.actions";
import { FormProvider, SubmitButton, TextField } from "@/components";
import toast from "react-hot-toast";

const LoginForm: React.FC = () => {
    const [state, loginAction] = useActionState(login, null);

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
                autoComplete="on"
                action={loginAction}
                className="flex max-w-[600px] flex-col gap-2"
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

                <div className="flex gap-2">
                    <input id="rememberMe" name="rememberMe" type="checkbox" />
                    <label htmlFor="rememberMe">Запомнить меня</label>
                </div>

                <SubmitButton pendingText="Вход...">Войти</SubmitButton>
            </form>
        </FormProvider>
    );
};

export { LoginForm };
export default LoginForm;
