export type RegisterFormErrors = {
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
};

export type RegisterFormState = {
    errors?: RegisterFormErrors;
} | null;