import { NextRequest, NextResponse } from 'next/server';
import { Role } from '@/types/entities';
import axios from "axios";

// Конфигурация маршрутов и ролей
const routeConfig = {
    '/': [Role.User, Role.Moderator, Role.Admin],
    '/moderator': [Role.Admin, Role.Moderator],
    '/admin': [Role.Admin],
};

// Маршруты, доступные без авторизации
const publicRoutes = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/_next',
    '/api',
    '/unauthorized',
    '/favicon.ico'
];

// Проверяем, является ли маршрут публичным
const isPublicRoute = (path: string) => {
    return publicRoutes.some(route => path.startsWith(route));
};

// Проверяем, нужно ли проверять роли для этого маршрута
const requiresRoleCheck = (path: string) => {
    return Object.keys(routeConfig).some(route => path.startsWith(route));
};

// Проверяем доступ пользователя к маршруту
const hasRouteAccess = (path: string, userRoles: Role[]): boolean => {
    for (const [route, allowedRoles] of Object.entries(routeConfig)) {
        if (path.startsWith(route)) {
            return userRoles.some(role => allowedRoles.includes(role));
        }
    }
    return true;
};

// Получаем информацию о пользователе и его ролях с помощью API
const getUserRolesFromToken = async (token: string): Promise<Role[]> => {
    try {
        const response = await axios.get(`${process.env.API_URL}/api/user/me/roles`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status !== 200) {
            console.error('Token validation failed:', response);
            return [];
        }

        const data = response.data;

        console.log(data);

        if (data.roles && Array.isArray(data.roles)) {
            return data.roles.map((role: string) => {
                switch (role) {
                    case 'Admin':
                        return Role.Admin;
                    case 'Moderator':
                        return Role.Moderator;
                    default:
                        return Role.User;
                }
            });
        }

        return [];
    } catch (error) {
        console.error('Error validating token:', error);
        return [];
    }
};

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const accessToken = request.cookies.get('accessToken')?.value;

    console.log("accessToken", accessToken);

    // 1. Сначала проверяем публичные маршруты
    if (isPublicRoute(path)) {
        // Если пользователь авторизован и пытается зайти на страницу входа/регистрации
        if (accessToken && (path.startsWith('/login') || path.startsWith('/register'))) {
            return NextResponse.redirect(new URL('/', request.url));
        }
        return NextResponse.next();
    }

    // 2. Если маршрут не публичный и нет токена - перенаправляем на логин
    if (!accessToken) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 3. Проверяем роли только для защищенных маршрутов
    if (requiresRoleCheck(path)) {
        const roles = await getUserRolesFromToken(accessToken);

        if (!hasRouteAccess(path, roles)) {
            return NextResponse.redirect(new URL('/unauthorized', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};