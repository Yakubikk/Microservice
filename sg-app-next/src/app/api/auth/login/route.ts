import { login } from "@/lib/actions";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const result = await login(null, formData, true);

        const response = result?.errors
            ? NextResponse.json(
                  { success: false, errors: result.errors },
                  { status: 400 }
              )
            : NextResponse.json(result.token, { status: 200 });

        response.headers.set(
            "Access-Control-Allow-Origin",
            "http://127.0.0.1:5500"
        );
        response.headers.set(
            "Access-Control-Allow-Methods",
            "GET, POST, PUT, DELETE, OPTIONS"
        );
        response.headers.set(
            "Access-Control-Allow-Headers",
            "Content-Type, Authorization"
        );

        return response;
    } catch (error) {
        const response = NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Неизвестная ошибка",
            },
            { status: 500 }
        );

        response.headers.set(
            "Access-Control-Allow-Origin",
            "http://127.0.0.1:5500"
        );
        return response;
    }
}

export async function OPTIONS() {
    const response = new NextResponse(null, { status: 204 });

    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );

    return response;
}
