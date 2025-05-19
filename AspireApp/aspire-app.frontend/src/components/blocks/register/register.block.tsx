import { LoginForm } from "@/components";
import React from "react";

export const RegisterBlock: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-gray-100">
            <h2>Register</h2>
            <LoginForm />
        </div>
    );
};

export default RegisterBlock;
