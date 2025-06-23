import React from 'react';
import { CsvOperations } from '@/components/data-display/csv-operations';
import { CsvBatchOperations } from '@/components/data-display/csv-batch-operations';
import {
  exportWagonTypes,
  importWagonTypes,
  exportManufacturers,
  importManufacturers,
  exportCisternModels,
  importCisternModels,
  exportRegistrars,
  importRegistrars,
  exportRailwayCisterns,
  importRailwayCisterns,
} from '@/api';

const AdminPage: React.FC = () => {
    const csvOperations = [
        {
            id: 'wagon-types',
            title: 'Типы вагонов',
            onImport: importWagonTypes,
            onExport: exportWagonTypes,
        },
        {
            id: 'manufacturers',
            title: 'Производители',
            onImport: importManufacturers,
            onExport: exportManufacturers,
        },
        {
            id: 'cistern-models',
            title: 'Модели цистерн',
            onImport: importCisternModels,
            onExport: exportCisternModels,
        },
        {
            id: 'registrars',
            title: 'Регистраторы',
            onImport: importRegistrars,
            onExport: exportRegistrars,
        },
        {
            id: 'railway-cisterns',
            title: 'Железнодорожные цистерны',
            onImport: importRailwayCisterns,
            onExport: exportRailwayCisterns,
        },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Страница администратора</h1>
            <p className="text-gray-600 mb-8">Управление данными системы через импорт и экспорт CSV файлов.</p>
            
            {/* Массовые операции */}
            <div className="mb-12">
                <CsvBatchOperations operations={csvOperations} />
            </div>
            
            {/* Индивидуальные операции */}
            <div className="border-t pt-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Индивидуальные операции</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Типы вагонов */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <CsvOperations
                            onImport={importWagonTypes}
                            onExport={exportWagonTypes}
                            title="Типы вагонов"
                            importText="Импорт типов"
                            exportText="Экспорт типов"
                        />
                    </div>

                    {/* Производители */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <CsvOperations
                            onImport={importManufacturers}
                            onExport={exportManufacturers}
                            title="Производители"
                            importText="Импорт производителей"
                            exportText="Экспорт производителей"
                        />
                    </div>

                    {/* Модели цистерн */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <CsvOperations
                            onImport={importCisternModels}
                            onExport={exportCisternModels}
                            title="Модели цистерн"
                            importText="Импорт моделей"
                            exportText="Экспорт моделей"
                        />
                    </div>

                    {/* Регистраторы */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <CsvOperations
                            onImport={importRegistrars}
                            onExport={exportRegistrars}
                            title="Регистраторы"
                            importText="Импорт регистраторов"
                            exportText="Экспорт регистраторов"
                        />
                    </div>

                    {/* Железнодорожные цистерны */}
                    <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
                        <CsvOperations
                            onImport={importRailwayCisterns}
                            onExport={exportRailwayCisterns}
                            title="Железнодорожные цистерны"
                            importText="Импорт цистерн"
                            exportText="Экспорт цистерн"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export { AdminPage };
export default AdminPage;
