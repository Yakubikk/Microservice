import React from 'react';
import { FileUpload } from '@/components/inputs/file-upload';
import { ExportButton } from '@/components/inputs/export-button';

interface CsvOperationsProps {
  onImport: (file: File) => Promise<unknown>;
  onExport: () => Promise<void>;
  disabled?: boolean;
  className?: string;
  title?: string;
  importText?: string;
  exportText?: string;
}

export const CsvOperations: React.FC<CsvOperationsProps> = ({
  onImport,
  onExport,
  disabled = false,
  className = '',
  title,
  importText = 'Импорт из CSV',
  exportText = 'Экспорт в CSV',
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex-1">
          <FileUpload
            onFileSelect={() => {}} // Пустая функция, так как FileUpload сам управляет состоянием
            onUpload={onImport}
            disabled={disabled}
            selectText="Выбрать CSV файл"
            uploadText={importText}
          />
        </div>
        
        <div className="flex-shrink-0">
          <ExportButton
            onExport={onExport}
            disabled={disabled}
            variant="outline"
          >
            {exportText}
          </ExportButton>
        </div>
      </div>
    </div>
  );
};
