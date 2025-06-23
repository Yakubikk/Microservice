/**
 * Утилиты для работы с CSV файлами
 */

export interface CsvValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  rowCount: number;
  columnCount: number;
}

export interface CsvValidationOptions {
  requiredColumns?: string[];
  maxRows?: number;
  maxFileSize?: number; // в байтах
  allowedExtensions?: string[];
}

/**
 * Валидация CSV файла
 */
export const validateCsvFile = async (
  file: File,
  options: CsvValidationOptions = {}
): Promise<CsvValidationResult> => {
  const result: CsvValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    rowCount: 0,
    columnCount: 0,
  };

  const {
    requiredColumns = [],
    maxRows = 10000,
    maxFileSize = 50 * 1024 * 1024, // 50MB
    allowedExtensions = ['.csv'],
  } = options;

  // Проверка расширения файла
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  if (!allowedExtensions.includes(fileExtension)) {
    result.errors.push(`Неподдерживаемый формат файла: ${fileExtension}. Поддерживаются: ${allowedExtensions.join(', ')}`);
    result.isValid = false;
  }

  // Проверка размера файла
  if (file.size > maxFileSize) {
    result.errors.push(`Файл слишком большой: ${(file.size / 1024 / 1024).toFixed(2)}MB. Максимальный размер: ${(maxFileSize / 1024 / 1024).toFixed(2)}MB`);
    result.isValid = false;
  }

  // Если есть критические ошибки, возвращаем результат
  if (!result.isValid) {
    return result;
  }

  try {
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim() !== '');
    
    result.rowCount = lines.length - 1; // Вычитаем заголовок
    
    if (lines.length === 0) {
      result.errors.push('Файл пустой');
      result.isValid = false;
      return result;
    }

    // Проверка количества строк
    if (result.rowCount > maxRows) {
      result.errors.push(`Слишком много строк: ${result.rowCount}. Максимум: ${maxRows}`);
      result.isValid = false;
    }

    // Анализ заголовков
    const headers = lines[0].split(';').map(h => h.trim().replace(/^"/, '').replace(/"$/, ''));
    result.columnCount = headers.length;

    // Проверка обязательных колонок
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    if (missingColumns.length > 0) {
      result.errors.push(`Отсутствуют обязательные колонки: ${missingColumns.join(', ')}`);
      result.isValid = false;
    }

    // Проверка консистентности количества колонок
    for (let i = 1; i < Math.min(lines.length, 100); i++) { // Проверяем первые 100 строк
      const columns = lines[i].split(';');
      if (columns.length !== headers.length) {
        result.warnings.push(`Строка ${i + 1}: неверное количество колонок (${columns.length} вместо ${headers.length})`);
      }
    }

    // Предупреждения
    if (result.rowCount === 0) {
      result.warnings.push('Файл содержит только заголовки, нет данных для импорта');
    }

    if (result.rowCount > 1000) {
      result.warnings.push(`Большое количество строк (${result.rowCount}). Импорт может занять некоторое время`);
    }

  } catch (error) {
    result.errors.push(`Ошибка чтения файла: ${error}`);
    result.isValid = false;
  }

  return result;
};

/**
 * Получение информации о CSV файле
 */
export const getCsvFileInfo = async (file: File): Promise<{
  name: string;
  size: string;
  type: string;
  lastModified: string;
}> => {
  return {
    name: file.name,
    size: formatFileSize(file.size),
    type: file.type || 'text/csv',
    lastModified: new Date(file.lastModified).toLocaleString('ru-RU'),
  };
};

/**
 * Форматирование размера файла
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Предварительный просмотр CSV файла (первые N строк)
 */
export const previewCsvFile = async (file: File, maxRows: number = 5): Promise<{
  headers: string[];
  rows: string[][];
  totalRows: number;
}> => {
  const text = await file.text();
  const lines = text.split('\n').filter(line => line.trim() !== '');
  
  if (lines.length === 0) {
    return { headers: [], rows: [], totalRows: 0 };
  }

  const headers = lines[0].split(';').map(h => h.trim().replace(/^"/, '').replace(/"$/, ''));
  const rows = lines.slice(1, maxRows + 1).map(line => 
    line.split(';').map(cell => cell.trim().replace(/^"/, '').replace(/"$/, ''))
  );

  return {
    headers,
    rows,
    totalRows: lines.length - 1,
  };
};
