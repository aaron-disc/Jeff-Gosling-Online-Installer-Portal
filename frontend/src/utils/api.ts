const API_BASE = `${import.meta.env.VITE_SERVER_IP}${import.meta.env.VITE_PORT}`;

const TOKEN_KEY = "jgAuthToken";

export const UNAUTHORISED_EVENT = "auth:unauthorized";

export interface AuthUser {
  email: string;
  isAdmin: boolean;
  createdAt: string;
  id: number;
}

export interface RefreshResult {
  token: string;
  user: AuthUser;
}

export function getApiBase(): string {
  return API_BASE;
}

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

const AUTH_PATHS = new Set(["/login", "/refresh", "/logout"]);

let refreshInFlight: Promise<RefreshResult | null> | null = null;

async function requestNewAccessToken(): Promise<RefreshResult | null> {
  const response = await fetch(`${API_BASE}/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (response.status === 401) {
    clearAuthToken();
    window.dispatchEvent(new Event(UNAUTHORISED_EVENT));
    return null;
  }

  if (!response.ok) {
    throw new Error(`Token refresh failed with status ${response.status}.`);
  }

  const data = (await response.json()) as Partial<RefreshResult>;

  if (typeof data.token !== "string" || data.user == null) {
    clearAuthToken();
    window.dispatchEvent(new Event(UNAUTHORISED_EVENT));
    return null;
  }

  setAuthToken(data.token);
  return { token: data.token, user: data.user };
}

export function refreshAuthToken(): Promise<RefreshResult | null> {
  if (!refreshInFlight) {
    refreshInFlight = requestNewAccessToken().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

async function performFetch(
  path: string,
  options: RequestInit,
): Promise<Response> {
  const token = getAuthToken();
  const headers = new Headers(options.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });
}

export async function apiFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const response = await performFetch(path, options);

  if (response.status !== 401 || AUTH_PATHS.has(path)) {
    return response;
  }

  let refreshed: RefreshResult | null;
  try {
    refreshed = await refreshAuthToken();
  } catch {
    return response;
  }

  if (!refreshed) {
    return response;
  }

  return performFetch(path, options);
}
