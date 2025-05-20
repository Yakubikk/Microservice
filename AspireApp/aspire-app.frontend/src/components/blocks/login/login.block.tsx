import { LoginForm } from "@/components";
import React from "react";

const LoginBlock: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-gray-100">
            <h2>Login</h2>
            <LoginForm />
        </div>
    );
};

export { LoginBlock };
export default LoginBlock;
