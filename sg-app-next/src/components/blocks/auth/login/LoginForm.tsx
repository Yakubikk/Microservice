"use client";

import React, { useActionState } from "react";
import {login} from "@/lib/actions/auth.actions";
import {FormProvider, SubmitButton, TextField} from "@/components";

const LoginForm: React.FC = () => {
    const [state, loginAction] = useActionState(login, null);

    return (
        <FormProvider state={state}>
            <form
                autoComplete='on'
                action={loginAction}
                className="flex max-w-[300px] flex-col gap-2"
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
                    <input
                        id="rememberMe"
                        name="rememberMe"
                        type="checkbox"
                    />
                    <label htmlFor="rememberMe">Запомнить меня</label>
                </div>

                <SubmitButton pendingText='Вход...'>
                    Войти
                </SubmitButton>
            </form>
        </FormProvider>
    );
}

export { LoginForm };
export default LoginForm;
