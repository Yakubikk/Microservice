import { login } from "@/lib/actions";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const result = await login(null, formData, true);

        if (result?.errors) {
            return NextResponse.json(
                { success: false, errors: result.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(result.token, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Неизвестная ошибка",
            },
            { status: 500 }
        );
    }
}
