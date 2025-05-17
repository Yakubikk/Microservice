"use server";

import { manufacturerPermissions } from "@/lib/permissions";
import { Manufacturer } from "@prisma/client";

interface ManufacturerWithPermissions extends Manufacturer {
    canUpdate: boolean;
    canDelete: boolean;
}

export const getManufacturersPermissionStatus = async (
    result: {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        creatorId: string;
    }[]
): Promise<ManufacturerWithPermissions[]> => {
    const manufacturers = await Promise.all(
        result.map(async (manufacturer) => {
            const [updatePermission, deletePermission] = await Promise.all([
                manufacturerPermissions.canUpdate(manufacturer.id),
                manufacturerPermissions.canDelete(manufacturer.id),
            ]);

            return {
                ...manufacturer,
                canUpdate: updatePermission.allowed,
                canDelete: deletePermission.allowed,
            };
        })
    );

    return manufacturers;
};
