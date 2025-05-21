import React from 'react';
import {Navigate, Outlet} from 'react-router-dom';
import {useAuthStore} from '@/store/authStore';
import type {UserRole} from "@/types";

interface ProtectedRouteProps {
    allowedRoles: UserRole[];
}

const RouteProtected: React.FC<ProtectedRouteProps> = ({allowedRoles}) => {
    const {user, loading} = useAuthStore();

    // Проверяем состояние загрузки
    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (!user) {
        // Если пользователь не авторизован, перенаправляем на главную страницу
        return <Navigate to="/guest" replace/>;
    }

    // Проверяем авторизован ли пользователь и имеет ли нужную роль
    const hasRequiredRole = user.roles.some(item => allowedRoles.includes(item));

    if (!hasRequiredRole) {
        // Если у пользователя нет нужной роли, показываем страницу с ошибкой доступа
        return <Navigate to="/forbidden" replace/>;
    }

    // Если всё в порядке, рендерим дочерние компоненты маршрута
    return <Outlet/>;
};

export { RouteProtected };
export default RouteProtected;
