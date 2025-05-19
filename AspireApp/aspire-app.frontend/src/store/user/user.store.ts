import { User } from "@/types/entities";
import { create } from "zustand";

interface UserStore {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (user: User) => void;
    logout: () => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    updateUser: (updatedUser: Partial<User>) => void;
}

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    login: (user) =>
        set({
            user,
            isAuthenticated: true,
            error: null,
        }),

    logout: () =>
        set({
            user: null,
            isAuthenticated: false,
        }),

    setLoading: (isLoading) => set({ isLoading }),

    setError: (error) => set({ error }),

    updateUser: (updatedUser) =>
        set((state) => ({
            user: state.user ? { ...state.user, ...updatedUser } : null,
        })),
}));
