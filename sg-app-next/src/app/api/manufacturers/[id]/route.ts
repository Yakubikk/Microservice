import { getManufacturerById } from "@/lib/actions";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const token = request.headers
            .get("Authorization")
            ?.replace("Bearer ", "");
        const manufacturer = await getManufacturerById(params.id, token);

        if (manufacturer && "errors" in manufacturer) {
            return NextResponse.json(
                { success: false, errors: manufacturer.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: true, data: manufacturer },
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
