const API_BASE = `${import.meta.env.VITE_SERVER_IP}${import.meta.env.VITE_PORT}`;

const TOKEN_KEY = "jgAuthToken";

export const UNAUTHORISED_EVENT = "auth:unauthorized";

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

export async function apiFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = getAuthToken();
  const headers = new Headers(options.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && path !== "/login") {
    clearAuthToken();
    window.dispatchEvent(new Event(UNAUTHORISED_EVENT));
  }

  return response;
}
