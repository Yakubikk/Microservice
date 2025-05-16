"use client";

import React, { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { register } from "@/lib/actions/auth.actions";

const RegisterForm: React.FC = () => {
    const [state, registerAction] = useActionState(register, null);

    return (
        <form action={registerAction} className="flex max-w-[300px] flex-col gap-2">
            <div className="flex flex-col gap-2">
                <input
                    id="email"
                    name="email"
                    placeholder="Email"
                    type="email"
                    required
                    className="p-2 border rounded"
                />
            </div>
            {state?.errors?.email && (
                <p className="text-red-500 text-sm">{state.errors.email.join(", ")}</p>
            )}

            <div className="flex flex-col gap-2">
                <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    minLength={8}
                    className="p-2 border rounded"
                />
            </div>
            {state?.errors?.password && (
                <p className="text-red-500 text-sm">{state.errors.password.join(", ")}</p>
            )}

            <div className="flex flex-col gap-2">
                <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    required
                    className="p-2 border rounded"
                />
            </div>
            {state?.errors?.confirmPassword && (
                <p className="text-red-500 text-sm">{state.errors.confirmPassword[1]}</p>
            )}

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
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
            {pending ? "Creating account..." : "Register"}
        </button>
    );
}

export default RegisterForm;
