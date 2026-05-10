import axios, { AxiosError } from 'axios';
import type { ApiErrorDto, ApiResponse } from '../dtos/api';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8081';

export const http = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function unwrapResponse<T>(response: { data: ApiResponse<T> }): T {
  return response.data.data;
}

export function toApiError(error: unknown): ApiErrorDto {
  if (!axios.isAxiosError(error)) {
    return {
      message: error instanceof Error ? error.message : 'Something went wrong',
    };
  }

  const axiosError = error as AxiosError<ApiResponse<unknown>>;
  const payload = axiosError.response?.data;
  const data = payload?.data;
  const fieldErrors =
    data && typeof data === 'object' && !Array.isArray(data)
      ? (data as Record<string, string>)
      : undefined;

  return {
    status: axiosError.response?.status,
    message: payload?.message ?? axiosError.message,
    fieldErrors,
  };
}
