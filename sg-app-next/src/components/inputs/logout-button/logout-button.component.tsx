'use client';

import React from "react";
import {logout} from "@/lib/actions/auth.actions";

const LogoutButton: React.FC = () => {
    const handleLogout = async () => {
        await logout();
    };

    return (
        <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
        >
            Выйти
        </button>
    );
}

export { LogoutButton };
export default LogoutButton;
