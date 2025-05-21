import React from "react";
import {type FieldError, type RegisterOptions, useFormContext } from "react-hook-form";
import clsx from "clsx";

type TextFieldProps = {
    name: string;
    label?: string;
    type?: "text" | "email" | "password" | "number" | "tel" | "url";
    placeholder?: string;
    className?: string;
    labelClassName?: string;
    inputClassName?: string;
    errorClassName?: string;
    validation?: RegisterOptions;
} & React.InputHTMLAttributes<HTMLInputElement>;

const TextField: React.FC<TextFieldProps> = ({
    name,
    label,
    type = "text",
    placeholder = "",
    className = "",
    labelClassName = "",
    inputClassName = "",
    errorClassName = "",
    validation,
    ...rest
}) => {
    const {
        register,
        formState: { errors, isSubmitting },
    } = useFormContext();

    const error = errors[name] as FieldError | undefined;
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);

    const { onChange, onBlur, ...registerProps } = register(name, {
        ...validation,
        onChange: (e) => {
            setHasValue(!!e.target.value);
            validation?.onChange?.(e);
        },
        onBlur: (e) => {
            setIsFocused(false);
            validation?.onBlur?.(e);
        },
    });

    return (
        <div
            className={clsx(
                "relative",
                !label && placeholder ? "mt-6" : "mt-1",
                !error ? "mb-8" : "mb-6",
                className
            )}
        >
            {label && (
                <label
                    htmlFor={name}
                    className={clsx(
                        "block text-sm text-gray-600 transition-colors duration-200",
                        (hasValue || isFocused) &&
                            clsx(
                                error && "text-red-500",
                                hasValue && !isFocused
                                    ? "text-gray-600"
                                    : "text-indigo-600"
                            ),
                        labelClassName
                    )}
                >
                    {label}
                </label>
            )}

            {!label && placeholder && (
                <label
                    htmlFor={name}
                    className={clsx(
                        "absolute text-gray-500 transition-all duration-200 pointer-events-none",
                        hasValue || isFocused
                            ? clsx(
                                  "-top-5 left-0 text-sm",
                                  error && "text-red-500",
                                  hasValue && !isFocused
                                      ? "text-gray-600"
                                      : "text-indigo-600"
                              )
                            : "top-2 left-1",
                        labelClassName
                    )}
                >
                    {placeholder}
                </label>
            )}

            <div className="relative">
                <input
                    id={name}
                    type={type}
                    placeholder={label ? placeholder : ""}
                    disabled={isSubmitting}
                    className={clsx(
                        "w-full bg-transparent py-2 px-0 focus:outline-none focus:ring-0",
                        inputClassName
                    )}
                    onFocus={() => setIsFocused(true)}
                    onChange={onChange}
                    onBlur={onBlur}
                    {...registerProps}
                    {...rest}
                />
                <div
                    className={clsx(
                        "absolute bottom-0 h-0.5 opacity-25 w-full",
                        error ? "bg-red-600" : "bg-black",
                    )}
                />
                <div
                    className={clsx(
                        "absolute bottom-0 h-0.5 transition-all duration-300",
                        isFocused
                            ? "w-full bg-indigo-500 left-0"
                            : "w-0 bg-gray-300 left-1/2",
                        error ? "bg-red-500" : "bg-indigo-500"
                    )}
                />
            </div>

            {error && (
                <p
                    className={clsx(
                        "mt-1 text-sm text-red-500",
                        errorClassName
                    )}
                >
                    {error.message}
                </p>
            )}
        </div>
    );
};

export { TextField };
export default TextField;
