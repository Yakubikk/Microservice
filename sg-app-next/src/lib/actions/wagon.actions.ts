"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { wagonPermissions } from "@/lib/permissions";
import { getSession } from "@/lib/session";
import { uuidSchema } from "@/types";

// Схема для создания вагона
const createWagonSchema = z.object({
    name: z.string().min(1, { message: "Название обязательно" }).trim(),
    manufacturerId: uuidSchema,
});

// Схема для обновления вагона
const updateWagonSchema = createWagonSchema.extend({
    id: uuidSchema,
});

export async function createWagon(prevState: unknown, formData: FormData, token?: string) {
    try {
        const result = createWagonSchema.safeParse(Object.fromEntries(formData));
        if (!result.success) {
            return { errors: result.error.flatten().fieldErrors };
        }

        const { name, manufacturerId } = result.data;

        // Проверяем существование производителя
        const manufacturer = await prisma.manufacturer.findUnique({
            where: { id: manufacturerId },
        });

        if (!manufacturer) {
            return { errors: { manufacturerId: ["Производитель не найден"] } };
        }

        const session = await getSession(token);
        if (!session) {
            throw new Error("Не авторизован");
        }

        // Создаем вагон
        await prisma.wagon.create({
            data: {
                name,
                creatorId: session.userId,
                manufacturerId,
            },
        });

        return { success: true };
    } catch (error) {
        console.error("Ошибка при создании вагона:", error);
        return {
            errors: { general: [error instanceof Error ? error.message : "Не удалось создать вагон"] },
        };
    }
}

export async function updateWagon(prevState: unknown, formData: FormData) {
    try {
        const result = updateWagonSchema.safeParse(Object.fromEntries(formData));
        if (!result.success) {
            return { errors: result.error.flatten().fieldErrors };
        }

        const { id, name, manufacturerId } = result.data;

        // Проверяем права с учетом владения
        const permission = await wagonPermissions.canUpdate(id);
        if (!permission.allowed) {
            return { errors: { general: [permission.reason] } };
        }

        // Проверяем существование вагона
        const existingWagon = await prisma.wagon.findUnique({
            where: { id },
        });

        if (!existingWagon) {
            return { errors: { general: ["Вагон не найден"] } };
        }

        // Проверяем существование производителя
        const manufacturer = await prisma.manufacturer.findUnique({
            where: { id: manufacturerId },
        });

        if (!manufacturer) {
            return { errors: { manufacturerId: ["Производитель не найден"] } };
        }

        // Обновляем вагон
        await prisma.wagon.update({
            where: { id },
            data: {
                name,
                updatedAt: new Date(),
                manufacturerId
            },
        });

        return { success: true };
    } catch (error) {
        console.error("Ошибка при обновлении вагона:", error);
        return {
            errors: { general: [error instanceof Error ? error.message : "Не удалось обновить вагон"] },
        };
    }
}

export async function deleteWagon(id: string) {
    try {
        // Проверяем права с учетом владения
        const permission = await wagonPermissions.canDelete(id);
        if (!permission.allowed) {
            return { errors: { general: [permission.reason] } };
        }

        // Проверяем существование вагона
        const existingWagon = await prisma.wagon.findUnique({
            where: { id },
        });

        if (!existingWagon) {
            return { errors: { general: ["Вагон не найден"] } };
        }

        // Удаляем вагон
        await prisma.wagon.delete({ where: { id } });

        return { success: true };
    } catch (error) {
        console.error("Ошибка при удалении вагона:", error);
        return {
            errors: { general: [error instanceof Error ? error.message : "Не удалось удалить вагон"] },
        };
    }
}

export async function getWagons() {
    try {
        // Проверяем права на чтение
        const permission = await wagonPermissions.canRead();
        if (!permission.allowed) {
            throw new Error(permission.reason);
        }

        return await prisma.wagon.findMany({
            include: { manufacturer: true },
            orderBy: { createdAt: "desc" },
        });
    } catch (error) {
        console.error("Ошибка при получении списка вагонов:", error);
        return {
            errors: { general: [error instanceof Error ? error.message : "Не удалось получить список вагонов"] },
        };
    }
}

export async function getWagonById(id: string) {
    try {
        // Проверяем права на чтение с учетом владения
        const permission = await wagonPermissions.canRead(id);
        if (!permission.allowed) {
            throw new Error(permission.reason);
        }

        return await prisma.wagon.findUnique({
            where: { id },
            include: { manufacturer: true },
        });
    } catch (error) {
        console.error("Ошибка при получении вагона:", error);
        return {
            errors: { general: [error instanceof Error ? error.message : "Не удалось получить вагон"] },
        };
    }
}

export async function getWagonsByName(name: string) {
    try {
        // Проверяем права на чтение
        const permission = await wagonPermissions.canRead();
        if (!permission.allowed) {
            throw new Error(permission.reason);
        }

        return await prisma.wagon.findMany({
            where: { name },
            include: { manufacturer: true },
        });
    } catch (error) {
        console.error("Ошибка при получении вагона по имени:", error);
        return {
            errors: { general: [error instanceof Error ? error.message : "Не удалось получить вагон"] },
        };
    }
}

export async function getWagonsByManufacturerId(manufacturerId: string) {
    try {
        // Проверяем права на чтение
        const permission = await wagonPermissions.canRead();
        if (!permission.allowed) {
            throw new Error(permission.reason);
        }

        return await prisma.wagon.findMany({
            where: { manufacturerId },
            include: { manufacturer: true },
        });
    } catch (error) {
        console.error("Ошибка при получении вагонов по ID производителя:", error);
        return {
            errors: { general: [error instanceof Error ? error.message : "Не удалось получить вагоны"] },
        };
    }
}

export async function getWagonsByCreatorId(creatorId: string) {
    try {
        // Проверяем права на чтение
        const permission = await wagonPermissions.canRead();
        if (!permission.allowed) {
            throw new Error(permission.reason);
        }

        return await prisma.wagon.findMany({
            where: { creatorId },
            include: { manufacturer: true },
        });
    } catch (error) {
        console.error("Ошибка при получении вагонов по ID создателя:", error);
        return {
            errors: { general: [error instanceof Error ? error.message : "Не удалось получить вагоны"] },
        };
    }
}

export async function getWagonsByCreatorIdAndName(creatorId: string, name: string) {
    try {
        // Проверяем права на чтение
        const permission = await wagonPermissions.canRead();
        if (!permission.allowed) {
            throw new Error(permission.reason);
        }

        return await prisma.wagon.findMany({
            where: { creatorId, name },
            include: { manufacturer: true },
        });
    } catch (error) {
        console.error("Ошибка при получении вагонов по ID создателя и имени:", error);
        return {
            errors: { general: [error instanceof Error ? error.message : "Не удалось получить вагоны"] },
        };
    }
}
