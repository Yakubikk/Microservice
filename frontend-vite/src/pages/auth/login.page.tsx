import {LoginBlock} from "@/components";
import {useAuthStore} from "@/store/authStore.ts";
import {Navigate} from "react-router-dom";

const LoginPage = () => {
    const { isAuthenticated } = useAuthStore();

    // Проверяем, авторизован ли пользователь
    if (isAuthenticated) {
        // Если пользователь авторизован, перенаправляем его на главную страницу
        return <Navigate to="/" replace />;
    }

    return (
        <div className="w-full h-screen flex items-center justify-center">
            <LoginBlock />
        </div>
    );
}

export { LoginPage };
export default LoginPage;
