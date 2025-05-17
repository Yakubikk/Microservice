import {
    getManufacturerByCreatorIdAndName,
    getManufacturerByName,
    getManufacturerByCreatorId,
} from "@/lib/actions";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const name = searchParams.get("name");
        const creatorId = searchParams.get("creatorId");
        const token = request.headers
            .get("Authorization")
            ?.replace("Bearer ", "");

        let result;
        if (name && creatorId) {
            result = await getManufacturerByCreatorIdAndName(
                creatorId,
                name,
                token
            );
        } else if (name) {
            result = await getManufacturerByName(name, token);
        } else if (creatorId) {
            result = await getManufacturerByCreatorId(creatorId, token);
        } else {
            return NextResponse.json(
                { success: false, error: "Параметры поиска обязательны" },
                { status: 400 }
            );
        }

        if ("errors" in result) {
            return NextResponse.json(
                { success: false, errors: result.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: true, data: result },
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
