import axios from "axios";
import { getCookie } from "./auth.api";

// Создаем экземпляр axios с базовым URL
const API_URL = import.meta.env.VITE_API_URL || "http://vagon.sgtrans.by:5000";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// Перехватчик для добавления токена к запросам
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = getCookie("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Экспорт данных в CSV файл
 * @param endpoint - Эндпоинт для экспорта (например, 'WagonTypes', 'RailwayCisterns')
 * @param filename - Имя файла для скачивания
 * @returns Promise<void>
 */
export const exportToCsv = async (endpoint: string, filename: string): Promise<void> => {
  try {
    const response = await apiClient.get(`api/Export/${endpoint}`, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Создаем blob URL для скачивания файла
    const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    
    // Создаем временную ссылку для скачивания
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    // Очищаем ресурсы
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(`Failed to export ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Импорт данных из CSV файла
 * @param endpoint - Эндпоинт для импорта (например, 'WagonTypes', 'RailwayCisterns')
 * @param file - CSV файл для загрузки
 * @returns Promise<unknown> - Результат импорта
 */
export const importFromCsv = async (endpoint: string, file: File): Promise<unknown> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post(`api/Import/${endpoint}`, formData);
    return response.data;
  } catch (error) {
    console.error(`Failed to import ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Экспорт типов вагонов
 */
export const exportWagonTypes = () => exportToCsv('WagonTypes', 'wagon-types.csv');

/**
 * Импорт типов вагонов
 */
export const importWagonTypes = (file: File) => importFromCsv('WagonTypes', file);

/**
 * Экспорт железнодорожных цистерн
 */
export const exportRailwayCisterns = () => exportToCsv('RailwayCisterns', 'railway-cisterns.csv');

/**
 * Импорт железнодорожных цистерн
 */
export const importRailwayCisterns = (file: File) => importFromCsv('RailwayCisterns', file);

/**
 * Экспорт производителей
 */
export const exportManufacturers = () => exportToCsv('Manufacturers', 'manufacturers.csv');

/**
 * Импорт производителей
 */
export const importManufacturers = (file: File) => importFromCsv('Manufacturers', file);

/**
 * Экспорт моделей цистерн
 */
export const exportCisternModels = () => exportToCsv('CisternModels', 'cistern-models.csv');

/**
 * Импорт моделей цистерн
 */
export const importCisternModels = (file: File) => importFromCsv('CisternModels', file);

/**
 * Экспорт регистраторов
 */
export const exportRegistrars = () => exportToCsv('Registrars', 'registrars.csv');

/**
 * Импорт регистраторов
 */
export const importRegistrars = (file: File) => importFromCsv('Registrars', file);
