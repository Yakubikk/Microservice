// Интерфейс для данных аутентификации
import type {User} from "./entities.types.ts";

export interface LoginRequest {
    email: string;
    password: string;
}

// Интерфейс для ответа сервера при успешной аутентификации
export interface AuthResponse {
    tokenType: string;
    accessToken: string;
    expiresIn: number;
    refreshToken: string;
}

// Типы ролей пользователей


// Интерфейс для контекста аутентификации
export interface AuthContextType {
    user: User | null;
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => void;
    loading: boolean;
    error: string | null;
}

