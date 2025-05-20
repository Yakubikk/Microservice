import { type AxiosError, type AxiosResponse } from "axios";

export function getResponseData<T>(
    response: AxiosError | AxiosResponse
): T | undefined {
    return (response as AxiosResponse<T>)?.data;
}
