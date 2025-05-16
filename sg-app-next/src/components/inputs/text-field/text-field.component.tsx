"use client";

import React, { useContext } from "react";
import { useFormStatus } from "react-dom";
import { FormContext } from "@/components";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    name: string;
    label?: string;
}

const TextField: React.FC<TextFieldProps> = ({ name, label, ...props }) => {
    const { pending } = useFormStatus();
    const formContext = useContext(FormContext);

    if (!formContext) {
        throw new Error("TextField необходимо использовать внутри формы с FormProvider");
    }

    const { state } = formContext;
    const errors = state?.errors?.[name];

    return (
        <div className="flex flex-col gap-2">
            {label && (
                <label htmlFor={name} className="text-sm font-medium">
                    {label}
                </label>
            )}
            <input
                id={name}
                name={name}
                disabled={pending}
                {...props}
                className="p-2 border rounded disabled:opacity-50"
            />
            {errors && (
                <p className="text-red-500 text-sm">
                    {Array.isArray(errors) ? errors.join(", ") : errors}
                </p>
            )}
        </div>
    );
};

export { TextField };
export default TextField;
