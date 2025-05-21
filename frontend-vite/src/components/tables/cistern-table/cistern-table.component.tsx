import React from "react";
import type { RailwayCistern } from "@/types/cistern.types";

interface CisternTableProps {
    cisterns: RailwayCistern[];
    isLoading?: boolean;
    onEdit: (cistern: RailwayCistern) => void;
    onDelete: (id: string) => void;
    className?: string;
}

const CisternTable: React.FC<CisternTableProps> = ({
    cisterns,
    isLoading,
    onEdit,
    onDelete,
    className = "",
}) => {
    return (
        <div className={`overflow-x-auto ${className}`}>
            <table className="divide-y w-full divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Номер
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Производитель
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Дата постройки
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Вес тары (т)
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Грузоподъемность (т)
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Объем (м³)
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Тип
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Действия
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {cisterns.length > 0 ? (
                        cisterns.map((cistern) => (
                            <tr key={cistern.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {cistern.number}
                                </td>                                
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {cistern.manufacturerName || cistern.manufacturerId}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {new Date(cistern.buildDate).toLocaleDateString('ru-RU')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {cistern.tareWeight}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {cistern.loadCapacity}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {cistern.volume}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {cistern.typeName || cistern.typeId}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => onEdit(cistern)}
                                            className="text-indigo-600 hover:text-indigo-900 p-2 border border-indigo-600 rounded cursor-pointer"
                                        >
                                            Изменить
                                        </button>
                                        <button
                                            onClick={() => onDelete(cistern.id)}
                                            className="text-red-600 hover:text-red-900 p-2 border border-red-600 rounded cursor-pointer"
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                                {isLoading ? 'Загрузка занных...' : 'Нет данных для отображения'}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default CisternTable;
export { CisternTable };
