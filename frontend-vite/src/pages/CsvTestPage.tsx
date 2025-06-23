import React from 'react';
import { CsvOperations } from '@/components/data-display/csv-operations';
import { FileUpload } from '@/components/inputs/file-upload';
import { AdvancedFileUpload } from '@/components/inputs/advanced-file-upload';
import { ExportButton } from '@/components/inputs/export-button';
import {
  exportWagonTypes,
  importWagonTypes,
  exportRailwayCisterns,
  importRailwayCisterns,
} from '@/api';

const CsvTestPage: React.FC = () => {
  const wagonTypesValidationOptions = {
    requiredColumns: ['Name'],
    maxRows: 1000,
    maxFileSize: 10 * 1024 * 1024, // 10MB
  };

  const cisternValidationOptions = {
    requiredColumns: ['number', 'manufacturerId', 'buildDate'],
    maxRows: 5000,
    maxFileSize: 25 * 1024 * 1024, // 25MB
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Тестирование CSV операций</h1>
      
      <div className="space-y-8">
        {/* Расширенная загрузка с валидацией */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Расширенная загрузка с валидацией</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Типы вагонов (с валидацией)</h3>
              <AdvancedFileUpload
                onFileSelect={(file) => console.log('Selected wagon types file:', file.name)}
                onUpload={importWagonTypes}
                validationOptions={wagonTypesValidationOptions}
                selectText="Выбрать CSV типов вагонов"
                uploadText="Загрузить типы"
                showPreview={true}
              />
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Железнодорожные цистерны (с валидацией)</h3>
              <AdvancedFileUpload
                onFileSelect={(file) => console.log('Selected cisterns file:', file.name)}
                onUpload={importRailwayCisterns}
                validationOptions={cisternValidationOptions}
                selectText="Выбрать CSV цистерн"
                uploadText="Загрузить цистерны"
                showPreview={true}
              />
            </div>
          </div>
        </div>

        {/* Простые компоненты */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Простые компоненты</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Базовая загрузка файла</h3>
              <FileUpload
                onFileSelect={(file) => console.log('Selected file:', file.name)}
                onUpload={importWagonTypes}
                selectText="Выбрать CSV"
                uploadText="Загрузить типы вагонов"
              />
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Кнопки экспорта</h3>
              <div className="flex gap-2">
                <ExportButton
                  onExport={exportWagonTypes}
                  variant="outline"
                >
                  Скачать типы вагонов
                </ExportButton>
                
                <ExportButton
                  onExport={exportRailwayCisterns}
                  variant="outline"
                >
                  Скачать цистерны
                </ExportButton>
              </div>
            </div>
          </div>
        </div>

        {/* Комбинированные операции */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Комбинированные операции</h2>
          
          <div className="space-y-6">
            <CsvOperations
              onImport={importWagonTypes}
              onExport={exportWagonTypes}
              title="Типы вагонов"
              importText="Импорт типов"
              exportText="Экспорт типов"
            />
            
            <CsvOperations
              onImport={importRailwayCisterns}
              onExport={exportRailwayCisterns}
              title="Железнодорожные цистерны"
              importText="Импорт цистерн"
              exportText="Экспорт цистерн"
            />
          </div>
        </div>

        {/* Инструкции */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Инструкции по использованию</h2>
          <div className="space-y-4 text-blue-800">
            <div>
              <h3 className="font-medium">Расширенная загрузка:</h3>
              <ul className="list-disc list-inside mt-1 space-y-1 text-sm">
                <li>Автоматическая валидация файлов перед загрузкой</li>
                <li>Предпросмотр данных для проверки корректности</li>
                <li>Детальная информация о файле и ошибках</li>
                <li>Проверка обязательных колонок и структуры данных</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium">Общие правила:</h3>
              <ul className="list-disc list-inside mt-1 space-y-1 text-sm">
                <li>CSV файлы должны использовать точку с запятой (;) как разделитель</li>
                <li>Первая строка должна содержать заголовки колонок</li>
                <li>Кодировка файла должна быть UTF-8</li>
                <li>Максимальный размер файла зависит от типа данных</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium">Требования к колонкам:</h3>
              <ul className="list-disc list-inside mt-1 space-y-1 text-sm">
                <li><strong>Типы вагонов:</strong> Name (обязательно)</li>
                <li><strong>Цистерны:</strong> number, manufacturerId, buildDate (обязательно)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { CsvTestPage };
export default CsvTestPage;
