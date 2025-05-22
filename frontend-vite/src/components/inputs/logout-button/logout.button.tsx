import { useAuthStore } from "@/store/authStore";
import type React from "react";
import { Button } from "../button";

const LogoutButton: React.FC = () => {
    const { logout } = useAuthStore();

    const handleLogout = () => {
        logout();
    };

    return (
        <Button
            variant="destructive"
            onClick={handleLogout}
            rightIcon={
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v2a1 1 0 11-2 0V4a1 1 0 011-1zm5.293 4.293a1 1 0 00-1.414-1.414L10.586 8H3a1 1 0 100 2h7.586l3.293-3.293zM5.293 15.707a1 1 0 001.414-1.414L9.414 12H17a1 1 0 100-2H9.414l-3.121-3.121a1 1 0 00-1.414 1.414L7.586 10H3a3 3 0 000 6h7.586l-2.293-2.293z"
                        clipRule="evenodd"
                    />
                </svg>
            }
        >
            <span className="text-sm font-medium">Выйти</span>
        </Button>
    );
}

export { LogoutButton };
export default LogoutButton;
