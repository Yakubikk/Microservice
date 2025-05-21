import React from "react";
import {type FieldError, type RegisterOptions, useFormContext} from "react-hook-form";
import clsx from "clsx";
import {CalendarIcon} from "lucide-react";

type DatePickerProps = {
    name: string;
    label?: string;
    placeholder?: string;
    className?: string;
    labelClassName?: string;
    inputClassName?: string;
    errorClassName?: string;
    validation?: RegisterOptions;
    locale?: string; // Добавляем поддержку локализации
    dateFormat?: Intl.DateTimeFormatOptions; // Настройки формата даты
    showIcon?: boolean; // Показывать ли иконку календаря
    iconClassName?: string; // Классы для иконки
} & React.InputHTMLAttributes<HTMLInputElement>;

const DatePicker: React.FC<DatePickerProps> = (
    {
        name,
        label,
        placeholder = "",
        className = "",
        labelClassName = "",
        inputClassName = "",
        errorClassName = "",
        validation,
        locale = "ru-RU", // Локаль по умолчанию
        dateFormat = { // Формат по умолчанию
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
        formState: {errors},
        watch,
    } = useFormContext();

    const error = errors[name] as FieldError | undefined;
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);
    const value = watch(name);

    // Форматирование даты для отображения
    const formatDisplayDate = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat(locale, dateFormat).format(date);
    };

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
                        hasValue || isFocused
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

            <div className="relative">
                {/* Скрытый input для хранения значения в формате YYYY-MM-DD */}
                <input
                    id={name}
                    type="date"
                    className="absolute opacity-0 w-1 h-1"
                    {...registerProps}
                    {...rest}
                    onFocus={() => setIsFocused(true)}
                    onBlur={onBlur}
                    onChange={onChange}
                />

                {/* Кастомное отображение даты */}
                <div
                    className={clsx(
                        "w-full bg-transparent py-2 pr-8 focus:outline-none focus:ring-0 cursor-pointer",
                        "flex items-center",
                        inputClassName
                    )}
                    onClick={() => document.getElementById(name)?.focus()}
                >
                    {value ? formatDisplayDate(value) : label ? "" : placeholder}
                </div>

                {showIcon && (
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <CalendarIcon className={iconClassName}/>
                    </div>
                )}

                <div
                    className={clsx(
                        "absolute bottom-0 h-0.5 opacity-25 w-full",
                        error ? "bg-red-600" : "bg-black"
                    )}
                />
                <div
                    className={clsx(
                        "absolute bottom-0 h-0.5 transition-all duration-300",
                        isFocused ? "w-full bg-indigo-500 left-0" : "w-0 bg-gray-300 left-1/2",
                        error ? "bg-red-500" : "bg-indigo-500"
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

export {DatePicker};
export default DatePicker;
