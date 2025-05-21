import React from "react";
import {LoginForm} from "@/components";

const RegisterBlock: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-gray-100">
            <h2>Register</h2>
            <LoginForm />
        </div>
    );
};

export { RegisterBlock };
export default RegisterBlock;
