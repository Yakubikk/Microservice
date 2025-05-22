import axios, {type AxiosInstance} from 'axios';
import type {AuthResponse, LoginRequest, User} from '@/types';

// Создаем экземпляр axios с базовым URL
const API_URL = import.meta.env.VITE_API_URL || 'http://vagon.sgtrans.by:5000';

const apiClient: AxiosInstance = axios.create({
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

// Функции для работы с куками
export const setCookie = (name: string, value: string, days?: number): void => {
    const expires = days
        ? `; expires=${new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()}`
        : '';
    const sameSite = '; SameSite=Lax';
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${name}=${value || ''}${expires}${sameSite}${secure}; path=/`;
};

export const getCookie = (name: string): string | null => {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};

const removeCookie = (name: string): void => {
    document.cookie = name + '=; Max-Age=-99999999; path=/';
};

export const register = async (credentials: LoginRequest): Promise<string> => {
    try {
        const response = await apiClient.post<string>('api/user', credentials);
        return response.data;
    } catch (error) {
        console.error('Registration failed:', error);
        throw error;
    }
}

// API функция для входа в аккаунт
export const login = async (credentials: LoginRequest): Promise<boolean> => {
    try {
        const response = await apiClient.post<AuthResponse>('/login', credentials);

        // Сохраняем токены в куки
        const tokenExpiry = new Date(Date.now() + response.data.expiresIn * 1000);
        const expiresInDays = response.data.expiresIn / (24 * 60 * 60); // Переводим секунды в дни

        setCookie('accessToken', response.data.accessToken, expiresInDays);
        setCookie('refreshToken', response.data.refreshToken, 30); // Refresh token храним дольше
        setCookie('tokenExpires', tokenExpiry.getTime().toString(), expiresInDays);

        return true;
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
};

// API функция для выхода из аккаунта
export const logout = (): void => {
    removeCookie('accessToken');
    removeCookie('refreshToken');
    removeCookie('tokenExpires');
};

// API функция для обновления токена
export const refreshAccessToken = async (): Promise<AuthResponse> => {
    try {
        const refreshToken = getCookie('refreshToken');
        if (!refreshToken) {
            throw new Error('Refresh token not found');
        }

        const response = await apiClient.post<AuthResponse>('/refresh', {refreshToken});

        // Обновляем токены в куках
        const expiresInDays = response.data.expiresIn / (24 * 60 * 60); // Переводим секунды в дни

        setCookie('accessToken', response.data.accessToken, expiresInDays);
        setCookie('refreshToken', response.data.refreshToken, 30); // Refresh token храним дольше
        setCookie('tokenExpires', (Date.now() + response.data.expiresIn * 1000).toString(), expiresInDays);

        return response.data;
    } catch (error) {
        console.error('Token refresh failed:', error);
        throw error;
    }
};

// Функция для проверки, не истек ли токен
export const isTokenExpired = (): boolean => {
    const expiresStr = getCookie('tokenExpires');
    if (!expiresStr) return true;

    const expires = parseInt(expiresStr, 10);
    return Date.now() > expires;
};

export const getMe = async (): Promise<User | undefined> => {
    try {
        const response = await apiClient.get<User>('api/user/me');
        return response.data;
    } catch (error) {
        console.error('GetMe failed:', error);
        throw error;
    }
}
