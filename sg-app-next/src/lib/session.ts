import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET;
if (!secretKey || secretKey.length < 32) {
    throw new Error(
        "SESSION_SECRET environment variable must be set and at least 32 characters long"
    );
}

const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(userId: string, userRole: string, rememberMe?: string) {
    // Если rememberMe true - сессия на 30 дней, иначе - на 1 день
    const expiresAt = rememberMe
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 дней
        : new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 день

    const session = await encrypt({ userId, userRole, expiresAt, rememberMe });

    (await cookies()).set("session", session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: "lax",
        path: "/",
    });
}

export async function deleteSession() {
    (await cookies()).delete("session");
}

type SessionPayload = {
    userId: string;
    userRole: string;
    expiresAt: Date;
    rememberMe?: string;
};

export async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(payload.rememberMe ? "30d" : "1d") // 30 дней или 1 день
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ["HS256"],
        });
        return payload;
    } catch {
        console.log("Failed to verify session");
    }
}
