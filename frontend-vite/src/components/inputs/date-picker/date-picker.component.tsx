import React from "react";
import { type FieldError, type RegisterOptions, useFormContext } from "react-hook-form";
import clsx from "clsx";
import { CalendarIcon } from "lucide-react";

type DatePickerProps = {
    name: string;
    label?: string;
    placeholder?: string;
    className?: string;
    labelClassName?: string;
    inputClassName?: string;
    errorClassName?: string;
    validation?: RegisterOptions;
    locale?: string;
    dateFormat?: Intl.DateTimeFormatOptions;
    showIcon?: boolean;
    iconClassName?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const DatePicker: React.FC<DatePickerProps> = ({
    name,
    label,
    placeholder = "",
    className = "",
    labelClassName = "",
    inputClassName = "",
    errorClassName = "",
    validation,
    locale = "ru-RU",
    dateFormat = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    },
    showIcon = true,
    iconClassName = "h-5 w-5 text-gray-400",
    ...rest
}) => {
    const {
        register,
        formState: { errors, isSubmitting },
        watch,
    } = useFormContext();

    const error = errors[name] as FieldError | undefined;
    const [isFocused, setIsFocused] = React.useState(false);
    const value = watch(name);
    const [hasValue, setHasValue] = React.useState(!!value);

    // Ref to track if the picker was just closed due to selection
    const isPickerJustClosedRef = React.useRef(false);

    React.useEffect(() => {
        setHasValue(!!value);
    }, [value]);

    const formatDisplayDate = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat(locale, dateFormat).format(date);
    };

    const {
        onChange: rhfOnChange,
        onBlur: rhfOnBlur,
        ref: rhfRef,
        ...registerProps
    } = register(name, {
        ...validation,
        onChange: (e) => {
            setHasValue(!!e.target.value);
            validation?.onChange?.(e);
        },
        onBlur: (e) => {
            // Only set isFocused to false if the picker wasn't just closed
            // and focus is being lost for other reasons.
            // If picker was just closed, the handleFocus logic will manage it.
            // However, the blur() call in our onChange *wants* this to set isFocused to false.
            if (!isPickerJustClosedRef.current) { // This condition might be tricky if blur is not from date selection
                 // setIsFocused(false); // Let's rethink this part, rhfOnBlur should be simpler
            }
            setIsFocused(false); // Let onBlur always try to set focus to false.
                                 // The handleFocus will override if it's an immediate re-focus.
            validation?.onBlur?.(e);
        },
    });

    const handleFocus = () => {
        if (isPickerJustClosedRef.current) {
            // This focus event is likely the browser re-focusing after selection.
            // We've already attempted to blur it, and rhfOnBlur should have set setIsFocused(false).
            // We want that 'false' state to persist visually.
            isPickerJustClosedRef.current = false; // Reset the flag
            // Do NOT call setIsFocused(true) here.
            // Do NOT call showPicker() here.
            return;
        }

        setIsFocused(true);
        const inputElement = document.getElementById(name) as HTMLInputElement;
        if (inputElement) {
            inputElement.showPicker();
        }
    };

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
                            hasValue && !isFocused ? "text-gray-600" : "text-indigo-600"
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
                        (hasValue || isFocused)
                            ? clsx(
                                "-top-5 left-0 text-sm",
                                error && "text-red-500",
                                hasValue && !isFocused ? "text-gray-600" : "text-indigo-600"
                            )
                            : "top-2 left-1",
                        labelClassName
                    )}
                >
                    {placeholder}
                </label>
            )}

            <div>
                <input
                    id={name}
                    type="date"
                    className="absolute opacity-0 w-full h-10 cursor-pointer"
                    disabled={isSubmitting}
                    {...registerProps}
                    ref={rhfRef}
                    onChange={(e) => {
                        rhfOnChange(e);
                        isPickerJustClosedRef.current = true; // Signal that picker just closed due to selection
                        if (e.target instanceof HTMLInputElement) {
                            e.target.blur(); // Attempt to blur, which triggers rhfOnBlur (sets isFocused to false)
                        }
                    }}
                    onBlur={rhfOnBlur} // rhfOnBlur from register now sets isFocused(false)
                    onFocus={handleFocus}
                    {...rest}
                />

                <div
                    className={clsx(
                        "w-full py-2 pr-8 focus:outline-none focus:ring-0",
                        "flex items-center",
                        !value && "text-gray-400",
                        inputClassName
                    )}
                >
                    {value ? formatDisplayDate(value) : (label ? placeholder : "")}
                </div>

                {showIcon && (
                    <div className="absolute right-0 bottom-1/4 cursor-pointer">
                        {/* This div is to prevent the icon from being clickable */}
                        {/* <CalendarIcon className={clsx(iconClassName, "cursor-pointer")} /> */}
                        <CalendarIcon className={clsx(iconClassName, "!cursor-pointer")} />
                    </div>
                )}

                <div
                    className={clsx(
                        "absolute h-0.5 bottom-0 opacity-25 w-full",
                        error ? "bg-red-600" : "bg-black",
                    )}
                />
                <div
                    className={clsx(
                        "absolute h-0.5 bottom-0 transition-all duration-300",
                        isFocused ? "w-full bg-indigo-500 left-0" : "w-0 bg-gray-300 left-1/2",
                        error ? (isFocused ? "bg-red-500" : "bg-red-600") : "bg-indigo-500",
                    )}
                />
            </div>

            {error && (
                <p className={clsx("mt-1 text-sm text-red-500", errorClassName)}>
                    {error.message}
                </p>
            )}
        </div>
    );
};

export { DatePicker };
export default DatePicker;
