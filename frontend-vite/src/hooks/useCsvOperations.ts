import { useState } from 'react';
import { showToast } from '@/components/data-display/toast';

interface UseCsvOperationsOptions {
  onSuccess?: (message: string) => void;
  onError?: (error: string) => void;
}

export const useCsvOperations = (options: UseCsvOperationsOptions = {}) => {
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleImport = async (importFn: (file: File) => Promise<unknown>, file: File) => {
    setIsImporting(true);
    try {
      await importFn(file);
      const successMessage = 'Файл успешно импортирован';
      options.onSuccess?.(successMessage);
      showToast.success(successMessage);
    } catch (error) {
      const errorMessage = 'Не удалось импортировать файл';
      options.onError?.(errorMessage);
      showToast.error(errorMessage);
      throw error;
    } finally {
      setIsImporting(false);
    }
  };

  const handleExport = async (exportFn: () => Promise<void>) => {
    setIsExporting(true);
    try {
      await exportFn();
      const successMessage = 'Файл успешно экспортирован';
      options.onSuccess?.(successMessage);
      showToast.success(successMessage);
    } catch (error) {
      const errorMessage = 'Не удалось экспортировать данные';
      options.onError?.(errorMessage);
      showToast.error(errorMessage);
      throw error;
    } finally {
      setIsExporting(false);
    }
  };

  return {
    isImporting,
    isExporting,
    handleImport,
    handleExport,
  };
};
