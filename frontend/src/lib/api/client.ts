/**
 * API client for the Laravel backend.
 *
 * Configure the base URL with VITE_API_BASE_URL (e.g. http://localhost:8000).
 * All requests target the v1 namespace: `${BASE}/api/v1/...`
 *
 * Auth: Laravel Sanctum personal access tokens with scopes per guard.
 * The token is persisted in localStorage under `internly.token` and sent as
 * `Authorization: Bearer <token>`.
 */

export type Role = "student" | "company" | "admin";

const RAW_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://127.0.0.1:8000";
export const API_BASE = RAW_BASE.replace(/\/+$/, "");
export const API_PREFIX = `${API_BASE}/api/v1`;

const TOKEN_KEY = "internly.token";
const ROLE_KEY = "internly.role";

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
  },
  getRole: (): Role | null => (localStorage.getItem(ROLE_KEY) as Role | null),
  setRole: (r: Role) => localStorage.setItem(ROLE_KEY, r),
};

export class ApiError extends Error {
  status: number;
  data: unknown;
  errors?: Record<string, string[]>;
  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.status = status;
    this.data = data;
    if (data && typeof data === "object" && "errors" in (data as Record<string, unknown>)) {
      this.errors = (data as { errors?: Record<string, string[]> }).errors;
    }
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  formData?: FormData;
  signal?: AbortSignal;
  headers?: Record<string, string>;
};

function buildUrl(path: string, query?: RequestOptions["query"]) {
  const url = new URL(`${API_PREFIX}${path.startsWith("/") ? path : `/${path}`}`);
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
    });
  }
  return url.toString();
}

export async function apiRequest<T = unknown>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, query, formData, signal, headers = {} } = opts;
  const token = tokenStore.get();

  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...headers,
  };
  if (token) finalHeaders.Authorization = `Bearer ${token}`;

  let payload: BodyInit | undefined;
  if (formData) {
    payload = formData;
  } else if (body !== undefined) {
    finalHeaders["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  let res: Response;
  try {
    res = await fetch(buildUrl(path, query), {
      method,
      headers: finalHeaders,
      body: payload,
      signal,
      credentials: "include",
    });
  } catch (err) {
    throw new ApiError(
      `Network error contacting API at ${API_PREFIX}. Check VITE_API_BASE_URL and CORS.`,
      0,
      { cause: String(err) },
    );
  }

  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && "message" in (data as Record<string, unknown>)
        ? String((data as { message?: unknown }).message ?? "")
        : "") || `Request failed with status ${res.status}`;

    if (res.status === 401) {
      tokenStore.clear();
    }
    throw new ApiError(message, res.status, data);
  }

  // Laravel API Resources commonly wrap payloads in { data: ... }
  return (data && typeof data === "object" && "data" in (data as Record<string, unknown>)
    ? (data as { data: T }).data
    : (data as T));
}

export const api = {
  get: <T>(path: string, query?: RequestOptions["query"]) => apiRequest<T>(path, { method: "GET", query }),
  post: <T>(path: string, body?: unknown) => apiRequest<T>(path, { method: "POST", body }),
  put: <T>(path: string, body?: unknown) => apiRequest<T>(path, { method: "PUT", body }),
  patch: <T>(path: string, body?: unknown) => apiRequest<T>(path, { method: "PATCH", body }),
  del: <T>(path: string) => apiRequest<T>(path, { method: "DELETE" }),
  upload: <T>(path: string, formData: FormData, method: "POST" | "PUT" | "PATCH" = "POST") =>
    apiRequest<T>(path, { method, formData }),
};
