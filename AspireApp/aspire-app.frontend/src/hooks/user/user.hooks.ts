import { useUserStore } from "@/store/user/user.store";
import { Role } from "@/types/entities";

// Проверяет, есть ли у пользователя определенная роль
export const useHasRole = (role: Role) => {
    const { user } = useUserStore();
    return user?.roles.includes(role) ?? false;
};

// Проверяет, аутентифицирован ли пользователь
export const useAuth = () => useUserStore((state) => state.isAuthenticated);

// Получает текущего пользователя
export const useCurrentUser = () => useUserStore((state) => state.user);
