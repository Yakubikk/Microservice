import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import type {LoginRequest, User} from "@/types";
import {getMe, isTokenExpired, login, logout, refreshAccessToken, register} from "@/api";

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    error: string | null;
    register: (credentials: LoginRequest) => Promise<void>;
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (set, _get) => ({
            isAuthenticated: false,
            user: null,
            loading: true,
            error: null,

            register: async (credentials: LoginRequest) => {
                set({loading: true, error: null});
                try {
                    await register(credentials);
                    const user = await getMe();
                    set({isAuthenticated: !!user, user, loading: false});
                } catch (error) {
                    set({
                        error: 'Ошибка регистрации. Проверьте ваши данные.',
                        loading: false
                    });
                    throw error;
                }
            },

            login: async (credentials: LoginRequest) => {
                set({loading: true, error: null});
                try {
                    await login(credentials);
                    const user = await getMe();
                    set({isAuthenticated: !!user, user, loading: false});
                } catch (error) {
                    set({
                        error: 'Ошибка входа. Проверьте ваши данные.',
                        loading: false
                    });
                    throw error;
                }
            },

            logout: () => {
                logout();
                set({isAuthenticated: false, user: null});
            },

            checkAuth: async () => {
                set({loading: true});
                try {
                    const token = localStorage.getItem('accessToken');
                    if (!token) {
                        set({isAuthenticated: false, loading: false});
                        return;
                    }

                    // Если токен истек, пробуем обновить
                    if (isTokenExpired()) {
                        try {
                            await refreshAccessToken();
                            const user = await getMe();
                            set({isAuthenticated: !!user, user, loading: false});
                        } catch (refreshError) {
                            console.error('Ошибка обновления токена:', refreshError);
                            set({isAuthenticated: false, user: null, loading: false});
                        }
                    } else {
                        const user = await getMe();
                        set({isAuthenticated: !!user, user, loading: false});
                    }
                } catch (error) {
                    console.error('Ошибка проверки авторизации:', error);
                    set({isAuthenticated: false, user: null, loading: false});
                }
            }
        }),
        {
            name: 'auth-storage', // имя для localStorage
            // Сохраняем только необходимое состояние
            partialize: (state) => ({
                isAuthenticated: state.isAuthenticated,
                user: state.user
            }),
        }
    )
);

// Инициализация проверки авторизации при загрузке приложения
// Это можно вызвать в точке входа вашего приложения (например, в main.tsx)
export const initializeAuth = async () => {
    await useAuthStore.getState().checkAuth();
};
