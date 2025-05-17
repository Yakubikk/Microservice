import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/session";
import { $Enums } from '@prisma/client';
import Role = $Enums.Role;

const protectedRoutes: { [key: string]: Role[] } = {
    "/": [Role.USER, Role.MODERATOR, Role.ADMIN],
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

    if (isPublicRoute && session?.userId) {
        return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    if (isProtectedRoute && session?.userId) {
        const matchedRoute = Object.keys(protectedRoutes)
            .filter(route => path === route || path.startsWith(`${route}/`))
            .sort((a, b) => b.length - a.length)[0];

        if (matchedRoute) {
            const requiredRoles = protectedRoutes[matchedRoute];
            if (session.userRole && !requiredRoles.includes(session.userRole)) {
                const response = NextResponse.redirect(new URL("/unauthorized", req.nextUrl));
                response.cookies.set("unauthorized_redirect", "true", {
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
    matcher: ["/", "/login", "/register", "/admin/:path*", "/moderator/:path*", "/unauthorized"],
};
