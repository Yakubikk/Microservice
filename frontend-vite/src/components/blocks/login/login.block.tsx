import { LoginForm } from "@/components";
import React from "react";

const LoginBlock: React.FC = () => {
    return (
        <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-md">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Вход в систему</h2>
                <p className="text-gray-600 mt-2">Введите ваши учетные данные</p>
            </div>
            <LoginForm />
        </div>
    );
};

export { LoginBlock };
export default LoginBlock;