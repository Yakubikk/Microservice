import React, { useState } from 'react';
import { Button } from '@/components/inputs/button';
import { showToast } from '@/components/data-display/toast';

interface ExportButtonProps {
  onExport: () => Promise<void>;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  onExport,
  disabled = false,
  className = '',
  children = 'Экспорт в CSV',
  variant = 'outline',
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport();
      showToast.success('Файл успешно экспортирован');
    } catch (error) {
      console.error('Export error:', error);
      showToast.error('Не удалось экспортировать данные');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant={variant}
      onClick={handleExport}
      disabled={isExporting || disabled}
      className={className}
    >
      {isExporting ? 'Экспорт...' : children}
    </Button>
  );
};
