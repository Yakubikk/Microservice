import { NextResponse } from "next/server";
import { getManufacturers } from "@/lib/actions";
import { manufacturerPermissions } from "@/lib/permissions";
import { getSession } from "@/lib/session";

export async function GET() {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json(
                { error: "Не авторизован" },
                { status: 401 }
            );
        }
        const result = await getManufacturers();

        if ("errors" in result) {
            return NextResponse.json(
                { error: result.errors.general[0] },
                { status: 400 }
            );
        }

        // Добавляем проверку прав для каждого производителя
        const manufacturersWithPermissions = await Promise.all(
            result.map(async (manufacturer) => {
                const [updatePermission, deletePermission] = await Promise.all([
                    manufacturerPermissions.canUpdate(manufacturer.id),
                    manufacturerPermissions.canDelete(manufacturer.id),
                ]);

                return {
                    ...manufacturer,
                    createdAt: manufacturer.createdAt.toISOString(),
                    updatedAt: manufacturer.updatedAt.toISOString(),
                    canUpdate: updatePermission.allowed,
                    canDelete: deletePermission.allowed,
                };
            })
        );

        return NextResponse.json({ data: manufacturersWithPermissions });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Ошибка при загрузке производителей" },
            { status: 500 }
        );
    }
}
