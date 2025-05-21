import axios from 'axios';
import { useState, useEffect } from 'react';
import type { RailwayCistern, RailwayCisternInput } from '@/types';
import { getCookie } from './auth.api';

// Создаем экземпляр axios с базовым URL
const API_URL = import.meta.env.VITE_API_URL || 'http://vagon.sgtrans.by:5000';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Перехватчик для добавления токена к запросам
apiClient.interceptors.request.use(
    (config) => {
        const accessToken = getCookie('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Преобразование данных для запроса к серверу в соответствии с RailwayCisternRequest DTO
const transformToRequestDTO = (cisternData: Partial<RailwayCistern>): RailwayCisternInput => {
    // Преобразуем данные из формата фронтенда в формат, ожидаемый сервером (RailwayCisternRequest)
    return {
        number: cisternData.number || '',
        manufacturerId: cisternData.manufacturerId || '',
        buildDate: cisternData.buildDate || '',
        tareWeight: cisternData.tareWeight || 0,
        loadCapacity: cisternData.loadCapacity || 0,
        length: cisternData.length || 0,
        axleCount: cisternData.axleCount || 0,
        volume: cisternData.volume || 0,
        fillingVolume: cisternData.fillingVolume,
        initialTareWeight: cisternData.initialTareWeight,
        typeId: cisternData.typeId || '',
        modelId: cisternData.modelId,
        commissioningDate: cisternData.commissioningDate,
        serialNumber: cisternData.serialNumber || '',
        registrationNumber: cisternData.registrationNumber || '',
        registrationDate: cisternData.registrationDate || '',
        registrarId: cisternData.registrarId,
        notes: cisternData.notes,
          // Дополнительные поля для сосуда (Vessel), если они присутствуют
        vesselSerialNumber: cisternData.vessel?.vesselSerialNumber,
        vesselBuildDate: cisternData.vessel?.vesselBuildDate
    };
};

/**
 * Хук для получения списка вагонов-цистерн
 * @returns {Object} - Объект с данными, состоянием загрузки и ошибкой
 */
export const useGetRailwayCisternsQuery = () => {
    const [data, setData] = useState<RailwayCistern[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchCisterns = async () => {
            try {
                setIsLoading(true);
                // Получаем с сервера данные в формате RailwayCisternResponse[]
                const response = await apiClient.get<RailwayCistern[]>('api/railwayCisterns');
                
                // Могли бы обработать данные, если бы формат фронта отличался от формата бэка
                // const processedData = response.data.map(item => ({
                //    ...item,
                //    // Дополнительные трансформации при необходимости
                // }));
                
                setData(response.data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Произошла ошибка при загрузке данных'));
                console.error('Failed to fetch railway cisterns:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCisterns();
    }, []);

    return { data, isLoading, error };
};

/**
 * Получение одной цистерны по ID
 * @param id - ID цистерны
 * @returns {Promise<RailwayCistern>} Данные о цистерне
 */
export const getRailwayCistern = async (id: string): Promise<RailwayCistern> => {
    try {
        const response = await apiClient.get<RailwayCistern>(`api/railwayCisterns/${id}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch railway cistern:', error);
        throw error;
    }
};

/**
 * Создание новой цистерны
 * @param cisternData - Данные для создания цистерны
 * @returns {Promise<RailwayCistern>} - Созданная цистерна
 */
export const createRailwayCistern = async (cisternData: Omit<RailwayCistern, 'id'>): Promise<RailwayCistern> => {
    try {
        const requestData = transformToRequestDTO(cisternData);
        const response = await apiClient.post<RailwayCistern>('api/railwayCisterns', requestData);
        return response.data;
    } catch (error) {
        console.error('Failed to create railway cistern:', error);
        throw error;
    }
};

/**
 * Обновление данных цистерны
 * @param id - ID цистерны
 * @param cisternData - Обновленные данные цистерны
 * @returns {Promise<RailwayCistern>} - Обновленная цистерна
 */
export const updateRailwayCistern = async (
    id: string,
    cisternData: Partial<RailwayCistern>
): Promise<RailwayCistern> => {
    try {
        const requestData = transformToRequestDTO(cisternData);
        const response = await apiClient.put<RailwayCistern>(`api/railwayCisterns/${id}`, requestData);
        return response.data;
    } catch (error) {
        console.error('Failed to update railway cistern:', error);
        throw error;
    }
};

/**
 * Удаление цистерны
 * @param id - ID цистерны для удаления
 * @returns {Promise<void>}
 */
export const deleteRailwayCistern = async (id: string): Promise<void> => {
    try {
        await apiClient.delete(`api/railwayCisterns/${id}`);
    } catch (error) {
        console.error('Failed to delete railway cistern:', error);
        throw error;
    }
};
