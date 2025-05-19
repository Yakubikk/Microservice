import {cookies} from "next/headers";
import {NextRequest, NextResponse} from "next/server";
import {getSession} from "./lib/session";
import {$Enums} from '@prisma/client';
import Role = $Enums.Role;

const protectedRoutes: { [key: string]: Role[] } = {
    "/admin": [Role.ADMIN],
    "/moderator": [Role.MODERATOR, Role.ADMIN],
};

const publicRoutes = ["/login", "/register"];

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isPublicRoute = publicRoutes.includes(path);
    const isProtectedRoute = Object.keys(protectedRoutes).some(route =>
        path === route || path.startsWith(`${route}/`)
    );
    const isApiRoute = path.startsWith('/api/');

    // Устанавливаем CORS headers для всех ответов
    const setCorsHeaders = (response: NextResponse) => {
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        return response;
    };

    // Обработка preflight запросов (OPTIONS)
    if (req.method === 'OPTIONS') {
        const response = new NextResponse(null, {status: 204});
        return setCorsHeaders(response);
    }

    // Для API routes пропускаем авторизацию (если нужно) или добавляем свою логику
    if (isApiRoute) {
        const response = NextResponse.next();
        return setCorsHeaders(response);
    }

    const cookieStore = await cookies();

    if (path === "/unauthorized") {
        const hasTempCookie = cookieStore.get("unauthorized_redirect")?.value === "true";
        if (!hasTempCookie) {
            return NextResponse.redirect(new URL("/", req.nextUrl));
        }

        const response = NextResponse.next();
        response.cookies.delete("unauthorized_redirect");
        return response;
    }

    const session = await getSession();

    if (!session && !isPublicRoute) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    if (isPublicRoute && session) {
        return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    if (isProtectedRoute && session) {
        const matchedRoute = Object.keys(protectedRoutes)
            .filter(route => path === route || path.startsWith(`${route}/`))
            .sort((a, b) => b.length - a.length)[0];

        if (matchedRoute) {
            const requiredRoles = protectedRoutes[matchedRoute];
            if (session.userRole && !requiredRoles.includes(session.userRole)) {
                const response = NextResponse.redirect(new URL("/unauthorized", req.nextUrl));
                response.cookies.set('unauthorized_redirect', "true", {
                    path: "/",
                    maxAge: 5,
                    httpOnly: true,
                    sameSite: "strict",
                });
                return response;
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/login",
        "/register",
        "/admin/:path*",
        "/moderator/:path*",
        "/manufacturers/:path*",
        "/unauthorized",
        "/api/:path*"
    ],
};
