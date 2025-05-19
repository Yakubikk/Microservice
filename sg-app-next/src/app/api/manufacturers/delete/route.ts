import { deleteManufacturer } from "@/lib/actions";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const token = request.headers
            .get("Authorization")
            ?.replace("Bearer ", "");

        if (!id) {
            return NextResponse.json(
                { success: false, reason: "ID is required" },
                { status: 400 }
            );
        }

        const result = await deleteManufacturer(id, token);

        if (!result.success) {
            if (result.reason === "Не авторизован") {
                return NextResponse.json(result, { status: 401 });
            }
            return NextResponse.json(result, { status: 400 });
        }

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                reason:
                    error instanceof Error
                        ? error.message
                        : "Неизвестная ошибка",
            },
            { status: 500 }
        );
    }
}
