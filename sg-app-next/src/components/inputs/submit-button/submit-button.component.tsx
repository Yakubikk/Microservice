"use client";

import React, {useContext} from "react";
import { useFormStatus } from "react-dom";
import {FormContext} from "@/components";
import {cn} from "@/lib/utils";

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    pendingText?: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ children, pendingText, disabled, ...props }) => {
    const { pending } = useFormStatus();
    const formContext = useContext(FormContext);

    if (!formContext) {
        throw new Error("SubmitButton необходимо использовать внутри формы с FormProvider");
    }

    return (
        <button
            disabled={pending || disabled}
            type="submit"
            {...props}
            className={cn(
                'px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:hover:bg-green-500 disabled:opacity-50 cursor-pointer disabled:cursor-default',
                props.className,
            )}
        >
            {pending ? (pendingText || children) : children}
        </button>
    );
};

export { SubmitButton };
export default SubmitButton;
