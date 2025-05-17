import { getManufacturers } from "@/lib/actions";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const token = request.headers
            .get("Authorization")
            ?.replace("Bearer ", "");
        const manufacturers = await getManufacturers(token);

        if ("errors" in manufacturers) {
            return NextResponse.json(
                { success: false, errors: manufacturers.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: true, data: manufacturers },
            { status: 200 }
        );
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
