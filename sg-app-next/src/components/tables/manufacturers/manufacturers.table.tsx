"use client";

import {getManufacturers} from "@/lib/actions";
import {Manufacturer} from "@prisma/client";
import React, {useEffect, useState} from "react";
import UpdateButton from "./buttons/update.manufacturer.button";
import DeleteButton from "./buttons/delete.manufacturer.button";
import CreateButton from "./buttons/create.manufacturer.button";
import {LoadingWithProgress} from "@/components/loading";
import {getManufacturersPermissionStatus} from "./check-status";

interface ManufacturerWithPermissions extends Manufacturer {
    canUpdate: boolean;
    canDelete: boolean;
}

const ManufacturersTable: React.FC = () => {
    const [manufacturers, setManufacturers] = useState<
        ManufacturerWithPermissions[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshTable = async () => {
        try {
            setLoading(true);
            const result = await getManufacturers();

            if ("errors" in result) {
                setError(result.errors.general);
            } else {
                return await getManufacturersPermissionStatus(
                    result
                );
            }
        } catch (err) {
            setError("Ошибка при загрузке производителей");
            console.error(err);
        }
    };

    const handleRefresh = async () => {
        setLoading(true);
        try {
            const manufacturers = await refreshTable();
            if (manufacturers) {
                setManufacturers(manufacturers);
            }
        } catch (error) {
            setError("Ошибка при обновлении таблицы");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshTable()
            .then(manufacturers => {
                console.log(manufacturers);
                if (manufacturers) {
                    setManufacturers(manufacturers);
                }
            })
            .catch((error) => {
                setError("Ошибка при загрузке производителей");
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            }
        )

        return () => {
            setManufacturers([]);
            setLoading(false);
            setError(null);
        };
    }, []);

    if (loading) {
        return <LoadingWithProgress message="Загрузка производителей..."/>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (manufacturers.length === 0) {
        return (
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold">
                        Таблица производителей
                    </h1>
                    <CreateButton onSuccess={refreshTable}/>
                </div>
                <div>Нет данных о производителях</div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">Таблица производителей</h1>
                <CreateButton onSuccess={async () => await handleRefresh()}/>
            </div>
            <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                <tr className="bg-gray-100">
                    <th className="border border-gray-200 p-2">ID</th>
                    <th className="border border-gray-200 p-2">Название</th>
                    <th className="border border-gray-200 p-2">Создан</th>
                    <th className="border border-gray-200 p-2">Обновлён</th>
                    <th className="border border-gray-200 p-2">
                        Создатель
                    </th>
                    <th className="border border-gray-200 p-2">Действия</th>
                </tr>
                </thead>
                <tbody>
                {manufacturers.map((manufacturer) => (
                    <tr key={manufacturer.id} className="hover:bg-gray-50">
                        <td className="border border-gray-200 p-2">
                            {manufacturer.id}
                        </td>
                        <td className="border border-gray-200 p-2">
                            {manufacturer.name}
                        </td>
                        <td className="border border-gray-200 p-2">
                            {new Date(
                                manufacturer.createdAt
                            ).toLocaleDateString()}
                        </td>
                        <td className="border border-gray-200 p-2">
                            {new Date(
                                manufacturer.updatedAt
                            ).toLocaleDateString()}
                        </td>
                        <td className="border border-gray-200 p-2">
                            {manufacturer.creatorId}
                        </td>
                        <td className="border border-gray-200 p-2 w-[1%] whitespace-nowrap">
                            <div className="flex gap-2 items-center">
                                {manufacturer.canUpdate && (
                                    <UpdateButton
                                        manufacturerId={manufacturer.id}
                                        onSuccess={async () => await handleRefresh()}
                                    />
                                )}
                                {manufacturer.canDelete && (
                                    <DeleteButton
                                        manufacturerId={manufacturer.id}
                                        onSuccess={async () => await handleRefresh()}
                                    />
                                )}
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export {ManufacturersTable};
export default ManufacturersTable;
