"use server";

import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { $Enums } from "@prisma/client";
import Role = $Enums.Role;

type SessionPayload = {
    userId: string;
    userRole: string;
    expiresAt: Date;
    rememberMe?: string;
};

const secretKey = process.env.SESSION_SECRET;
if (!secretKey || secretKey.length < 32) {
    throw new Error(
        "Необходимо задать переменную среды SESSION_SECRET длиной не менее 32 символов"
    );
}

const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(
    userId: string,
    userRole: Role,
    rememberMe?: string,
    ext: boolean = false
) {
    const expiresAt = rememberMe
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        : new Date(Date.now() + 24 * 60 * 60 * 1000);

    const session = await encrypt({ userId, userRole, expiresAt, rememberMe });

    if (!ext) {
        (await cookies()).set("session", session, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === "production",
            expires: expiresAt,
            sameSite: "lax",
            path: "/",
        });
    } else {
        return { session, expiresAt };
    }
}

export async function getSession(token?: string) {
    let cookie;
    if (!token) {
        cookie = (await cookies()).get("session")?.value;
    } else {
        cookie = token;
    }

    if (!cookie) {
        return null;
    }

    try {
        const decryptedSession = await decrypt(cookie);

        if (
            !decryptedSession ||
            typeof decryptedSession !== "object" ||
            !("userId" in decryptedSession) ||
            !("userRole" in decryptedSession) ||
            !("expiresAt" in decryptedSession)
        ) {
            await deleteSession();
            return null;
        }

        // Приведение типа для expiresAt
        const expiresAt = new Date(
            decryptedSession.expiresAt as string | number | Date
        );
        if (expiresAt < new Date()) {
            await deleteSession();
            return null;
        }

        return {
            userId: decryptedSession.userId as string,
            userRole: decryptedSession.userRole as Role,
        };
    } catch (error) {
        console.error(
            "Session decryption failed:",
            error instanceof Error ? error.message : "Unknown error"
        );
        await deleteSession();
        return null;
    }
}

export async function deleteSession() {
    (await cookies()).delete("session");
}

async function encrypt(payload: SessionPayload): Promise<string> {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(payload.rememberMe ? "30d" : "1d")
        .sign(encodedKey);
}

async function decrypt(session: string) {
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ["HS256"],
        });
        return payload;
    } catch (error) {
        console.error("Failed to verify session:", error);
        return null;
    }
}
