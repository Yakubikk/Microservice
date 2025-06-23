import React, { useState } from 'react';
import { FileUpload } from '@/components/inputs/file-upload';
import { ExportButton } from '@/components/inputs/export-button';
import { showToast } from '@/components/data-display/toast';

interface CsvBatchOperationsProps {
  operations: Array<{
    id: string;
    title: string;
    onImport: (file: File) => Promise<unknown>;
    onExport: () => Promise<void>;
    disabled?: boolean;
  }>;
  className?: string;
}

export const CsvBatchOperations: React.FC<CsvBatchOperationsProps> = ({
  operations,
  className = '',
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<Record<string, { success: boolean; message: string }>>({});

  const handleBatchExport = async () => {
    setIsProcessing(true);
    setResults({});
    
    const newResults: Record<string, { success: boolean; message: string }> = {};
    
    for (const operation of operations) {
      if (operation.disabled) continue;
      
      try {
        await operation.onExport();
        newResults[operation.id] = {
          success: true,
          message: `${operation.title} успешно экспортирован`,
        };
      } catch (error) {
        newResults[operation.id] = {
          success: false,
          message: `Ошибка экспорта ${operation.title}: ${error}`,
        };
      }
    }
    
    setResults(newResults);
    setIsProcessing(false);
    
    const successCount = Object.values(newResults).filter(r => r.success).length;
    const totalCount = Object.keys(newResults).length;
    
    if (successCount === totalCount) {
      showToast.success(`Все ${totalCount} файлов успешно экспортированы`);
    } else {
      showToast.error(`Экспортировано ${successCount} из ${totalCount} файлов`);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Массовые операции CSV</h2>
        <ExportButton
          onExport={handleBatchExport}
          disabled={isProcessing}
          variant="default"
        >
          {isProcessing ? 'Экспорт всех...' : 'Экспортировать все'}
        </ExportButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {operations.map((operation) => (
          <div key={operation.id} className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-3">{operation.title}</h3>
            
            <div className="space-y-3">
              <FileUpload
                onFileSelect={() => {}}
                onUpload={operation.onImport}
                disabled={operation.disabled || isProcessing}
                selectText="Выбрать файл"
                uploadText="Импорт"
                className="w-full"
              />
              
              <ExportButton
                onExport={operation.onExport}
                disabled={operation.disabled || isProcessing}
                variant="outline"
                className="w-full"
              >
                Экспорт
              </ExportButton>
            </div>

            {results[operation.id] && (
              <div className={`mt-3 p-2 rounded text-sm ${
                results[operation.id].success 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {results[operation.id].message}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
