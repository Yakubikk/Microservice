import React, { useState, useRef } from 'react';
import { Button } from '@/components/inputs/button';
import { showToast } from '@/components/data-display/toast';
import { 
  validateCsvFile, 
  getCsvFileInfo, 
  previewCsvFile, 
  type CsvValidationOptions,
  type CsvValidationResult
} from '@/lib/csv-utils';

interface AdvancedFileUploadProps {
  onFileSelect: (file: File) => void;
  onUpload: (file: File) => Promise<unknown>;
  validationOptions?: CsvValidationOptions;
  showPreview?: boolean;
  accept?: string;
  disabled?: boolean;
  className?: string;
  uploadText?: string;
  selectText?: string;
}

export const AdvancedFileUpload: React.FC<AdvancedFileUploadProps> = ({
  onFileSelect,
  onUpload,
  validationOptions = {},
  showPreview = true,
  accept = '.csv',
  disabled = false,
  className = '',
  uploadText = 'Загрузить',
  selectText = 'Выбрать файл',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<CsvValidationResult | null>(null);
  const [fileInfo, setFileInfo] = useState<{
    name: string;
    size: string;
    type: string;
    lastModified: string;
  } | null>(null);
  const [preview, setPreview] = useState<{
    headers: string[];
    rows: string[][];
    totalRows: number;
  } | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      resetState();
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);
    setIsValidating(true);

    try {
      // Получаем информацию о файле
      const info = await getCsvFileInfo(file);
      setFileInfo(info);

      // Валидируем файл
      const validation = await validateCsvFile(file, validationOptions);
      setValidationResult(validation);

      // Получаем предпросмотр, если файл валиден и включен предпросмотр
      if (validation.isValid && showPreview) {
        const previewData = await previewCsvFile(file, 5);
        setPreview(previewData);
      }

      // Показываем предупреждения
      if (validation.warnings.length > 0) {
        showToast.info(`Предупреждения: ${validation.warnings.join('; ')}`);
      }

      if (!validation.isValid) {
        showToast.error(`Ошибки валидации: ${validation.errors.join('; ')}`);
      }

    } catch (error) {
      console.error('Validation error:', error);
      showToast.error('Ошибка при проверке файла');
      setValidationResult({ 
        isValid: false, 
        errors: ['Ошибка при проверке файла'],
        warnings: [],
        rowCount: 0,
        columnCount: 0
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showToast.error('Пожалуйста, выберите файл для загрузки');
      return;
    }

    if (validationResult && !validationResult.isValid) {
      showToast.error('Нельзя загрузить файл с ошибками валидации');
      return;
    }

    setIsUploading(true);
    try {
      await onUpload(selectedFile);
      showToast.success('Файл успешно загружен');
      resetState();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      showToast.error('Не удалось загрузить файл');
    } finally {
      setIsUploading(false);
    }
  };

  const resetState = () => {
    setSelectedFile(null);
    setValidationResult(null);
    setFileInfo(null);
    setPreview(null);
  };

  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />
        
        <Button
          variant="outline"
          onClick={handleSelectClick}
          disabled={disabled || isValidating}
          className="min-w-32"
        >
          {isValidating ? 'Проверка...' : selectText}
        </Button>
        
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading || disabled || validationResult?.isValid === false}
          className="min-w-24"
        >
          {isUploading ? 'Загрузка...' : uploadText}
        </Button>
      </div>

      {fileInfo && (
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Информация о файле</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <div><strong>Имя:</strong> {fileInfo.name}</div>
            <div><strong>Размер:</strong> {fileInfo.size}</div>
            <div><strong>Изменен:</strong> {fileInfo.lastModified}</div>
          </div>
        </div>
      )}

      {validationResult && (
        <div className={`p-3 rounded-lg border ${
          validationResult.isValid 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <h4 className={`font-medium mb-2 ${
            validationResult.isValid ? 'text-green-900' : 'text-red-900'
          }`}>
            Результат валидации
          </h4>
          
          <div className={`text-sm ${
            validationResult.isValid ? 'text-green-700' : 'text-red-700'
          }`}>
            <div><strong>Строк данных:</strong> {validationResult.rowCount}</div>
            <div><strong>Колонок:</strong> {validationResult.columnCount}</div>
            
            {validationResult.errors.length > 0 && (
              <div className="mt-2">
                <strong>Ошибки:</strong>
                <ul className="list-disc list-inside mt-1">
                  {validationResult.errors.map((error: string, index: number) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {validationResult.warnings.length > 0 && (
              <div className="mt-2">
                <strong>Предупреждения:</strong>
                <ul className="list-disc list-inside mt-1">
                  {validationResult.warnings.map((warning: string, index: number) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {preview && (
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">
            Предпросмотр данных (первые 5 строк из {preview.totalRows})
          </h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  {preview.headers.map((header: string, index: number) => (
                    <th key={index} className="px-2 py-1 text-left font-medium text-gray-700 border">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.rows.map((row: string[], rowIndex: number) => (
                  <tr key={rowIndex} className="border-b">
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="px-2 py-1 border text-gray-600">
                        {cell.length > 30 ? `${cell.substring(0, 30)}...` : cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
