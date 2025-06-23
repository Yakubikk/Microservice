# CSV Функциональность

## Описание

Данная функциональность предоставляет возможности для импорта и экспорта данных в формате CSV через фронтенд приложения.

## Компоненты

### 1. FileUpload
Базовый компонент для загрузки файлов.

**Пропсы:**
- `onFileSelect`: Функция, вызываемая при выборе файла
- `onUpload`: Функция для загрузки файла на сервер
- `accept`: Допустимые типы файлов (по умолчанию '.csv')
- `disabled`: Отключение компонента
- `uploadText`: Текст кнопки загрузки
- `selectText`: Текст кнопки выбора файла

### 2. ExportButton
Кнопка для экспорта данных в CSV.

**Пропсы:**
- `onExport`: Функция для экспорта данных
- `disabled`: Отключение кнопки
- `variant`: Вариант стиля кнопки
- `children`: Содержимое кнопки (текст)

### 3. AdvancedFileUpload
Расширенный компонент для загрузки файлов с валидацией и предпросмотром.

**Пропсы:**
- `onFileSelect`: Функция, вызываемая при выборе файла
- `onUpload`: Функция для загрузки файла на сервер
- `validationOptions`: Опции валидации файла
- `showPreview`: Показывать ли предпросмотр данных
- `accept`: Допустимые типы файлов
- `disabled`: Отключение компонента

### 4. CsvOperations
Комбинированный компонент для импорта и экспорта CSV.

**Пропсы:**
- `onImport`: Функция импорта данных
- `onExport`: Функция экспорта данных
- `title`: Заголовок блока
- `importText`: Текст для импорта
- `exportText`: Текст для экспорта

### 5. CsvBatchOperations
Компонент для массовых операций с CSV файлами.

**Пропсы:**
- `operations`: Массив операций с описанием

## API Функции

### Экспорт данных
- `exportWagonTypes()`: Экспорт типов вагонов
- `exportManufacturers()`: Экспорт производителей
- `exportCisternModels()`: Экспорт моделей цистерн
- `exportRegistrars()`: Экспорт регистраторов
- `exportRailwayCisterns()`: Экспорт железнодорожных цистерн

### Импорт данных
- `importWagonTypes(file)`: Импорт типов вагонов
- `importManufacturers(file)`: Импорт производителей
- `importCisternModels(file)`: Импорт моделей цистерн
- `importRegistrars(file)`: Импорт регистраторов
- `importRailwayCisterns(file)`: Импорт железнодорожных цистерн

## Утилиты

### CSV Валидация
- `validateCsvFile(file, options)`: Валидация CSV файла
- `getCsvFileInfo(file)`: Получение информации о файле
- `previewCsvFile(file, maxRows)`: Предпросмотр содержимого файла

### Опции валидации
```typescript
interface CsvValidationOptions {
  requiredColumns?: string[];
  maxRows?: number;
  maxFileSize?: number;
  allowedExtensions?: string[];
}
```

## Использование

### Базовый импорт/экспорт
```tsx
import { CsvOperations } from '@/components/data-display/csv-operations';
import { exportWagonTypes, importWagonTypes } from '@/api';

<CsvOperations
  onImport={importWagonTypes}
  onExport={exportWagonTypes}
  title="Типы вагонов"
/>
```

### Расширенная загрузка с валидацией
```tsx
import { AdvancedFileUpload } from '@/components/inputs/advanced-file-upload';

const validationOptions = {
  requiredColumns: ['Name'],
  maxRows: 1000,
  maxFileSize: 10 * 1024 * 1024,
};

<AdvancedFileUpload
  onFileSelect={(file) => console.log('Selected:', file.name)}
  onUpload={importWagonTypes}
  validationOptions={validationOptions}
  showPreview={true}
/>
```

## Требования к CSV файлам

### Формат
- Разделитель: точка с запятой (;)
- Кодировка: UTF-8
- Первая строка: заголовки колонок
- Кавычки: поддерживаются для значений с разделителями

### Обязательные колонки

#### Типы вагонов
- `Name` - Название типа вагона

#### Железнодорожные цистерны
- `number` - Номер цистерны
- `manufacturerId` - ID производителя
- `buildDate` - Дата изготовления

#### Производители
- `Name` - Название производителя

#### Модели цистерн
- `Name` - Название модели
- `TypeId` - ID типа цистерны

#### Регистраторы
- `Name` - Название регистратора

## Страницы

### AdminPage
Страница администратора с возможностями массового импорта/экспорта всех типов данных.

### CsvTestPage
Демонстрационная страница для тестирования всех компонентов CSV функциональности.

### RailwayCisternPage
Страница управления цистернами с интегрированными возможностями CSV.

## Обработка ошибок

Все операции включают обработку ошибок с отображением toast уведомлений:
- Успешные операции: зеленые уведомления
- Ошибки: красные уведомления
- Предупреждения: желтые уведомления

## Ограничения

- Максимальный размер файла: зависит от типа данных (10-50MB)
- Максимальное количество строк: 1000-10000 в зависимости от типа
- Поддерживаемые форматы: только CSV
- Обязательная аутентификация для всех операций
