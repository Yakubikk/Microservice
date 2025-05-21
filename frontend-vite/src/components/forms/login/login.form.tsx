import { showToast, TextField } from "@/components";
import React from "react";
import { useForm, type SubmitHandler, FormProvider } from "react-hook-form";
import { useAuthStore } from "@/store/authStore.ts";

type FormValues = {
    email: string;
    password: string;
};

const LoginForm: React.FC = () => {
    const form = useForm<FormValues>();
    const { login } = useAuthStore();

    const { handleSubmit } = form;

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            await login(data);
            showToast.success("Вход выполнен успешно");
        } catch (error) {
            console.error("Ошибка входа:", error);
            showToast.error("Ошибка входа. Проверьте свои учетные данные.");
        }
    };

    return (
        <FormProvider {...form}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full space-y-4"
            >
                <TextField
                    name="email"
                    placeholder="Электронная почта"
                    type="email"
                    validation={{
                        required: "Обязательное поле",
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Некорректный email",
                        },
                    }}
                />

                <TextField
                    name="password"
                    placeholder="Пароль"
                    type="password"
                    validation={{
                        required: "Обязательное поле",
                        minLength: {
                            value: 6,
                            message: "Пароль должен содержать минимум 6 символов",
                        },
                    }}
                />

                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Войти
                </button>
            </form>
        </FormProvider>
    );
};

export { LoginForm };
export default LoginForm;
