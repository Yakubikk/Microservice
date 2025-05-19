import { getManufacturerById } from "@/lib/actions";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        // Получаем токен из заголовков
        const token = request.headers
            .get("Authorization")
            ?.replace("Bearer ", "");

        // Получаем ID из параметров URL
        const id = "";

        // Проверяем валидность ID
        if (!id) {
            return NextResponse.json(
                { success: false, error: "Manufacturer ID is required" },
                { status: 400 }
            );
        }

        // Получаем данные производителя
        const manufacturer = await getManufacturerById(id, token);

        // Обрабатываем возможные ошибки
        if (manufacturer && "errors" in manufacturer) {
            return NextResponse.json(
                { success: false, errors: manufacturer.errors },
                { status: 400 }
            );
        }

        // Устанавливаем CORS headers
        const response = NextResponse.json(
            { success: true, data: manufacturer },
            { status: 200 }
        );

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
    } catch (error) {
        console.error("Error fetching manufacturer:", error);
        const response = NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );

        response.headers.set("Access-Control-Allow-Origin", "*");
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
