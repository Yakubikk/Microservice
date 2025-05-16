"use client";

import React, { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {login} from "@/lib/actions/auth.actions";

const LoginForm: React.FC = () => {
    const [state, loginAction] = useActionState(login, null);

    return (
        <form action={loginAction} className="flex max-w-[300px] flex-col gap-2">
            <div className="flex flex-col gap-2">
                <input
                    id="email"
                    name="email"
                    placeholder="Email"
                    type="email"
                    required
                />
            </div>
            {state?.errors?.email && (
                <p className="text-red-500">{state.errors.email}</p>
            )}

            <div className="flex flex-col gap-2">
                <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Пароль"
                    required
                />
            </div>
            {state?.errors?.password && (
                <p className="text-red-500">{state.errors.password}</p>
            )}

            <div className="flex gap-2">
                <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                />
                <label htmlFor="rememberMe">Запомнить меня</label>
            </div>
            <SubmitButton />
        </form>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            disabled={pending}
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
            {pending ? "Вход..." : "Войти"}
        </button>
    );
}

export default LoginForm;
