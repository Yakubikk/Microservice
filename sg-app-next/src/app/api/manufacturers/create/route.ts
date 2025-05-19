import { createManufacturer } from "@/lib/actions";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const token = request.headers
            .get("Authorization")
            ?.replace("Bearer ", "");
        const formData = await request.formData();
        const result = await createManufacturer(null, formData, token);

        if (result?.errors) {
            if (
                "general" in result.errors &&
                result.errors.general === "Не авторизован"
            ) {
                return NextResponse.json(
                    { success: false, errors: result.errors },
                    { status: 401 }
                );
            }
            return NextResponse.json(
                { success: false, errors: result.errors },
                { status: 400 }
            );
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
