export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export interface RequestConfig {
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
}

export interface ApiError extends Error {
  status?: number;
  data?: unknown;
}

async function handleResponse<T>(
  response: Response
): Promise<T | undefined> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error: ApiError = new Error(
      errorData.message || errorData.error || `HTTP Error: ${response.status}`
    );
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  if (response.status === 204) {
    return undefined;
  }

  return response.json();
}

export async function get<T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<T | undefined> {
  const response = await fetch(`/api${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...config.headers,
    },
    credentials: config.credentials ?? "include",
  });
  return handleResponse<T>(response);
}

export async function post<T>(
  endpoint: string,
  body?: unknown,
  config: RequestConfig = {}
): Promise<T | undefined> {
  const isFormData = body instanceof FormData;

  const response = await fetch(`/api${endpoint}`, {
    method: "POST",
    headers: isFormData
      ? config.headers
      : {
          "Content-Type": "application/json",
          ...config.headers,
        },
    body: isFormData ? body : JSON.stringify(body),
    credentials: config.credentials ?? "include",
  });
  return handleResponse<T>(response);
}

export async function put<T>(
  endpoint: string,
  body?: unknown,
  config: RequestConfig = {}
): Promise<T | undefined> {
  const response = await fetch(`/api${endpoint}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...config.headers,
    },
    body: JSON.stringify(body),
    credentials: config.credentials ?? "include",
  });
  return handleResponse<T>(response);
}

export async function patch<T>(
  endpoint: string,
  body?: unknown,
  config: RequestConfig = {}
): Promise<T | undefined> {
  const isFormData = body instanceof FormData;

  const response = await fetch(`/api${endpoint}`, {
    method: "PATCH",
    headers: isFormData
      ? config.headers
      : {
          "Content-Type": "application/json",
          ...config.headers,
        },
    body: isFormData ? body : JSON.stringify(body),
    credentials: config.credentials ?? "include",
  });
  return handleResponse<T>(response);
}

export async function del<T>(
  endpoint: string,
  body?: unknown,
  config: RequestConfig = {}
): Promise<T | undefined> {
  const response = await fetch(`/api${endpoint}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...config.headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: config.credentials ?? "include",
  });
  return handleResponse<T>(response);
}

export const httpClient = {
  get,
  post,
  put,
  patch,
  delete: del,
};
