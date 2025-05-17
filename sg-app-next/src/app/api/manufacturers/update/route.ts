import { updateManufacturer } from "@/lib/actions";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
    try {
        const formData = await request.formData();
        const token = request.headers
            .get("Authorization")
            ?.replace("Bearer ", "");
        const result = await updateManufacturer(null, formData, token);

        if (result?.errors) {
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
                error:
                    error instanceof Error
                        ? error.message
                        : "Неизвестная ошибка",
            },
            { status: 500 }
        );
    }
}
