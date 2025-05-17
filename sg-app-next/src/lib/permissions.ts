import {getSession} from "./session";
import prisma from "@/lib/prisma";
import {$Enums} from '@prisma/client';
import Role = $Enums.Role;

// 1. Типы для системы прав
type Resource = keyof typeof PermissionConfig;
type Action<T extends Resource> = keyof typeof PermissionConfig[T];
type PermissionResult = { allowed: true } | { allowed: false; reason: string };
type ResourceOwnerCheck = (resourceId: string, userId: string) => Promise<boolean>;

// 2. Настройки прав доступа
const PermissionConfig = {
    wagon: {
        read: [Role.ADMIN, Role.MODERATOR, Role.USER],
        update: [Role.ADMIN],
        delete: [Role.ADMIN],
        manage: [Role.ADMIN],
    },
    manufacturer: {
        read: [Role.ADMIN, Role.MODERATOR, Role.USER],
        update: [Role.ADMIN],
        delete: [Role.ADMIN],
    },
    user: {
        read: [Role.ADMIN, Role.MODERATOR, Role.USER],
        update: [Role.ADMIN, Role.MODERATOR],
        delete: [Role.ADMIN, Role.MODERATOR],
    },
} as const;

// 3. Проверка владения ресурсами
const resourceOwners: Partial<Record<Resource, ResourceOwnerCheck>> = {
    wagon: async (wagonId, userId) => {
        const wagon = await prisma.wagon.findUnique({
            where: { id: wagonId },
            select: { creatorId: true },
        });
        return wagon?.creatorId === userId;
    },
    manufacturer: async (manufacturerId, userId) => {
        const manufacturer = await prisma.manufacturer.findUnique({
            where: { id: manufacturerId },
            select: { creatorId: true },
        });
        return manufacturer?.creatorId === userId;
    },
};

// 4. Основные функции для работы с правами
let sessionCache: { userId: string; userRole: Role } | null | undefined;

async function getCurrentSession() {
    if (sessionCache === undefined) {
        sessionCache = await getSession();
    }
    return sessionCache;
}

function clearSessionCache() {
    sessionCache = undefined;
}

async function checkResourceOwnership(
    resource: Resource,
    resourceId: string,
    userId: string
): Promise<boolean> {
    const checkOwner = resourceOwners[resource];
    return checkOwner ? await checkOwner(resourceId, userId) : false;
}

/**
 * Проверяет разрешение на действие с ресурсом
 * @returns Результат проверки с указанием причины отказа (если есть)
 */
export async function checkPermission<T extends Resource>(
    resource: T,
    action: Action<T>,
    resourceId?: string
): Promise<PermissionResult> {
    try {
        const session = await getCurrentSession();

        if (!session) {
            return { allowed: false, reason: "Ошибка: Пользователь не авторизован" };
        }

        // Владелец ресурса получает полный доступ
        if (resourceId && resource !== "user") {
            const isOwner = await checkResourceOwnership(
                resource,
                resourceId,
                session.userId
            );
            if (isOwner) {
                return { allowed: true };
            }
        }

        const allowedRoles = PermissionConfig[resource][action] as Role[];

        if (!allowedRoles.includes(session.userRole)) {
            return {
                allowed: false,
                reason: `Отказано: Роль ${session.userRole} не имеет прав на ${String(action)} для ${resource}`,
            };
        }

        return { allowed: true };
    } catch (error) {
        clearSessionCache();
        return {
            allowed: false,
            reason: error instanceof Error ? error.message : "Неизвестная ошибка при проверке прав",
        };
    }
}

/**
 * Создает объект с методами проверки прав для конкретного ресурса
 */
export function createPermissionChecker<T extends Resource>(resource: T) {
    return {
        check: <A extends Action<T>>(action: A, resourceId?: string) =>
            checkPermission(resource, action, resourceId),
        canRead: (resourceId?: string) => checkPermission(resource, "read", resourceId),
        canUpdate: (resourceId?: string) => checkPermission(resource, "update", resourceId),
        canDelete: (resourceId?: string) => checkPermission(resource, "delete", resourceId),
    };
}

// Готовые проверщики
export const wagonPermissions = createPermissionChecker("wagon");
export const manufacturerPermissions = createPermissionChecker("manufacturer");
export const userPermissions = createPermissionChecker("user");

/**
 * Проверяет права и выбрасывает исключение при отказе
 * @throws {Error} Если доступ запрещен
 */
export async function assertPermission<T extends Resource>(
    resource: T,
    action: Action<T>,
    resourceId?: string
) {
    const result = await checkPermission(resource, action, resourceId);
    if (!result.allowed) throw new Error(result.reason);
}

// 6. Экспорт типов для использования в других файлах
export type {
    Resource as PermissionResource,
    Action as PermissionAction,
    PermissionResult,
};

/**
 * Регистрирует новую проверку владения для типа ресурса
 */
export function registerResourceOwner(
    resource: Resource,
    checkFn: ResourceOwnerCheck
) {
    resourceOwners[resource] = checkFn;
}
