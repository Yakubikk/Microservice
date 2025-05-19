export enum Role {
    User = "User",
    Moderator = "Moderator",
    Admin = "Admin",
}

export interface User {
    id: string;
    userName: string;
    email: string;
    roles: Role[];
    createdAt: string; // или Date, если вы будете преобразовывать строку в Date объект
    updatedAt: string; // или Date, если вы будете преобразовывать строку в Date объект
    // Другие поля из IdentityUser, которые вам нужны
    emailConfirmed?: boolean;
    phoneNumber?: string | null;
    // и т.д.
}
