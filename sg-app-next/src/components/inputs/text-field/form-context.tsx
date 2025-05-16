"use client";

import React, { createContext } from "react";

export type FormErrors = {
    [key: string]: string[] | undefined;
};

export type FormState = {
    errors?: FormErrors;
} | null;

interface FormContextType {
    state: FormState;
}

export const FormContext = createContext<FormContextType | null>(null);

export const FormProvider: React.FC<{
    state: FormState;
    children: React.ReactNode
}> = ({ state, children }) => {
    return (
        <FormContext.Provider value={{ state }}>
            {children}
        </FormContext.Provider>
    );
};
