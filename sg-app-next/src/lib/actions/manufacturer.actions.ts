"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { manufacturerPermissions } from "@/lib/permissions";
import { getSession } from "@/lib/session";
import { uuidSchema } from "@/types";

// Схема для создания производителя
const createManufacturerSchema = z.object({
    name: z.string().min(1, { message: "Название обязательно" }).trim(),
});

// Схема для обновления производителя
const updateManufacturerSchema = createManufacturerSchema.extend({
    id: uuidSchema,
});

export async function createManufacturer(
    prevState: unknown,
    formData: FormData
) {
    try {
        const result = createManufacturerSchema.safeParse(
            Object.fromEntries(formData)
        );
        if (!result.success) {
            return { errors: result.error.flatten().fieldErrors };
        }

        const { name } = result.data;

        // Создаем производителя
        await prisma.manufacturer.create({
            data: {
                name,
                creatorId: (await getSession())?.userId ?? "",
            },
        });

        return { success: true };
    } catch (error) {
        console.error("Ошибка при создании производителя:", error);
        return {
            errors: {
                general: [
                    error instanceof Error
                        ? error.message
                        : "Не удалось создать производителя",
                ],
            },
        };
    }
}

export async function updateManufacturer(
    prevState: unknown,
    formData: FormData,
    token?: string
) {
    try {
        const result = updateManufacturerSchema.safeParse(
            Object.fromEntries(formData)
        );
        if (!result.success) {
            return { errors: result.error.flatten().fieldErrors };
        }

        const { id, name } = result.data;

        // Проверяем права с учетом владения
        const permission = await manufacturerPermissions.canUpdate(id, token);
        if (!permission.allowed) {
            throw new Error(permission.reason);
        }

        // Проверяем существование производителя
        const existingManufacturer = await prisma.manufacturer.findUnique({
            where: { id },
        });

        if (!existingManufacturer) {
            return { errors: { general: ["Производитель не найден"] } };
        }

        // Обновляем производителя
        await prisma.manufacturer.update({
            where: { id },
            data: {
                name,
                updatedAt: new Date(),
            },
        });

        return { success: true };
    } catch (error) {
        console.error("Ошибка при обновлении производителя:", error);
        return {
            errors: {
                general: [
                    error instanceof Error
                        ? error.message
                        : "Не удалось обновить производителя",
                ],
            },
        };
    }
}

export async function deleteManufacturer(id: string, token?: string) {
    try {
        // Проверяем права с учетом владения
        const permission = await manufacturerPermissions.canDelete(id, token);
        if (!permission.allowed) {
            throw new Error(permission.reason);
        }

        // Проверяем существование производителя
        const existingManufacturer = await prisma.manufacturer.findUnique({
            where: { id },
        });

        if (!existingManufacturer) {
            return { errors: { general: ["Производитель не найден"] } };
        }

        // Проверяем, нет ли связанных вагонов
        const wagonsCount = await prisma.wagon.count({
            where: { manufacturerId: id },
        });

        if (wagonsCount > 0) {
            return {
                errors: {
                    general: [
                        "Нельзя удалить производителя с привязанными вагонами",
                    ],
                },
            };
        }

        // Удаляем производителя
        await prisma.manufacturer.delete({ where: { id } });

        return { success: true };
    } catch (error) {
        console.error("Ошибка при удалении производителя:", error);
        return {
            errors: {
                general: [
                    error instanceof Error
                        ? error.message
                        : "Не удалось удалить производителя",
                ],
            },
        };
    }
}

export async function getManufacturers(token?: string) {
    try {
        // Проверяем права на чтение
        const permission = await manufacturerPermissions.canRead(
            undefined,
            token
        );
        if (!permission.allowed) {
            throw new Error(permission.reason);
        }

        return await prisma.manufacturer.findMany({
            orderBy: { createdAt: "desc" },
        });
    } catch (error) {
        console.error("Ошибка при получении списка производителей:", error);
        return {
            errors: {
                general: [
                    error instanceof Error
                        ? error.message
                        : "Не удалось получить список производителей",
                ],
            },
        };
    }
}

export async function getManufacturerById(id: string, token?: string) {
    try {
        // Проверяем права на чтение с учетом владения
        const permission = await manufacturerPermissions.canRead(id, token);
        if (!permission.allowed) {
            throw new Error(permission.reason);
        }

        return await prisma.manufacturer.findUnique({
            where: { id },
            include: {
                Wagons: true,
            },
        });
    } catch (error) {
        console.error("Ошибка при получении производителя:", error);
        return {
            errors: {
                general: [
                    error instanceof Error
                        ? error.message
                        : "Не удалось получить производителя",
                ],
            },
        };
    }
}

export async function getManufacturerByName(name: string, token?: string) {
    try {
        // Проверяем права на чтение
        const permission = await manufacturerPermissions.canRead(
            undefined,
            token
        );
        if (!permission.allowed) {
            throw new Error(permission.reason);
        }

        return await prisma.manufacturer.findMany({
            where: { name },
            include: {
                Wagons: true,
            },
        });
    } catch (error) {
        console.error("Ошибка при получении производителя:", error);
        return {
            errors: {
                general: [
                    error instanceof Error
                        ? error.message
                        : "Не удалось получить производителя",
                ],
            },
        };
    }
}

export async function getManufacturerByCreatorId(
    creatorId: string,
    token?: string
) {
    try {
        // Проверяем права на чтение
        const permission = await manufacturerPermissions.canRead(
            undefined,
            token
        );
        if (!permission.allowed) {
            throw new Error(permission.reason);
        }

        return await prisma.manufacturer.findMany({
            where: { creatorId },
            include: {
                Wagons: true,
            },
        });
    } catch (error) {
        console.error("Ошибка при получении производителя:", error);
        return {
            errors: {
                general: [
                    error instanceof Error
                        ? error.message
                        : "Не удалось получить производителя",
                ],
            },
        };
    }
}

export async function getManufacturerByCreatorIdAndName(
    creatorId: string,
    name: string,
    token?: string
) {
    try {
        // Проверяем права на чтение
        const permission = await manufacturerPermissions.canRead(
            undefined,
            token
        );
        if (!permission.allowed) {
            throw new Error(permission.reason);
        }

        return await prisma.manufacturer.findMany({
            where: { creatorId, name },
            include: {
                Wagons: true,
            },
        });
    } catch (error) {
        console.error("Ошибка при получении производителя:", error);
        return {
            errors: {
                general: [
                    error instanceof Error
                        ? error.message
                        : "Не удалось получить производителя",
                ],
            },
        };
    }
}
