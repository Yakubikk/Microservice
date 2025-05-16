"use client";

import React, { useActionState } from "react";
import { register } from "@/lib/actions/auth.actions";
import {FormProvider, SubmitButton, TextField} from "@/components";

const RegisterForm: React.FC = () => {
    const [state, registerAction] = useActionState(register, null);

    return (
        <FormProvider state={state}>
            <form
                autoComplete='off'
                action={registerAction}
                className="flex max-w-[300px] flex-col gap-4"
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

                <SubmitButton
                    pendingText='Регистрация...'
                >
                    Зарегистрироваться
                </SubmitButton>
            </form>
        </FormProvider>
    );
};

export { RegisterForm };
export default RegisterForm;
