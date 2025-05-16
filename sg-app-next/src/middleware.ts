import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/session";
import {$Enums} from "@/generated/prisma";
import Role = $Enums.Role;

// Определяем защищённые роуты и требуемые для них роли
const protectedRoutes: { [key: string]: Role[] } = {
    "/": [Role.USER, Role.MODERATOR, Role.ADMIN],
    "/admin": [Role.ADMIN],
    "/moderator": [Role.MODERATOR, Role.ADMIN],
};

const publicRoutes = ["/login", "/register"];

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isProtectedRoute = Object.keys(protectedRoutes).includes(path);
    const isPublicRoute = publicRoutes.includes(path);

    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);

    // Редирект для публичных роутов, если пользователь уже авторизован
    if (isPublicRoute && session?.userId) {
        return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    // Проверка защищённых роутов
    if (isProtectedRoute) {
        if (!session?.userId) {
            return NextResponse.redirect(new URL("/login", req.nextUrl));
        }

        // Получаем требуемые роли для этого роута
        const requiredRoles = protectedRoutes[path];

        // Проверяем, есть ли у пользователя нужная роль
        if (session.userRole && !requiredRoles.includes(<"USER" | "MODERATOR" | "ADMIN">session.userRole)) {
            // Если нет - редирект на главную или страницу "доступ запрещён"
            return NextResponse.redirect(new URL("/unauthorized", req.nextUrl));
            // Или можно вернуть 403:
            // return new NextResponse("Forbidden", { status: 403 });
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/login", "/register", "/admin", "/moderator"],
};
