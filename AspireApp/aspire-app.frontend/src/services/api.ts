"use server";

import axios, { type AxiosRequestConfig } from "axios";

const api = axios.create({
    baseURL: process.env.API_URL,
    headers: {
        "Accept-Language": "ru",
    },
} as AxiosRequestConfig);

// Add request interceptor to set auth header per request
api.interceptors.request.use(async (config) => {
    const { cookies } = await import("next/headers");
    const token = (await cookies()).get("accessToken")?.value;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;