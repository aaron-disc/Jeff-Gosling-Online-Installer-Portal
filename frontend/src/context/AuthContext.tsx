import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  apiFetch,
  clearAuthToken,
  getAuthToken,
  setAuthToken,
  refreshAuthToken,
  UNAUTHORISED_EVENT,
  type RefreshResult,
} from "../utils/api";
import { logoutSession } from "../utils/session";

interface User {
  email: string;
  isAdmin: boolean;
  createdAt: string;
  id: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isInitialising: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ user: User | null; error: string | null }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const USER_KEY = "jgAuthUser";

function loadStoredUser(): User | null {
  const stored = localStorage.getItem(USER_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as User;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

function clearStoredUser(): void {
  localStorage.removeItem(USER_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => loadStoredUser());
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialising, setIsInitialising] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const initialise = async () => {
      if (!getAuthToken() && !loadStoredUser()) {
        setIsInitialising(false);
        return;
      }

      let refreshed: RefreshResult | null;
      try {
        refreshed = await refreshAuthToken();
      } catch {
        refreshed = null;
      }

      if (cancelled) return;

      if (refreshed) {
        localStorage.setItem(USER_KEY, JSON.stringify(refreshed.user));
        setUser(refreshed.user);
      }

      setIsInitialising(false);
    };

    void initialise();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      clearAuthToken();
      clearStoredUser();
      setUser(null);
    };
    window.addEventListener(UNAUTHORISED_EVENT, handleUnauthorized);
    return () =>
      window.removeEventListener(UNAUTHORISED_EVENT, handleUnauthorized);
  }, []);

  const login = useCallback(
    async (
      email: string,
      password: string,
    ): Promise<{ user: User | null; error: string | null }> => {
      setIsLoading(true);
      try {
        const res = await apiFetch("/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email, password: password }),
        });

        if (!res.ok) {
          setUser(null);
          clearAuthToken();
          clearStoredUser();
          if (res.status === 401) {
            return { user: null, error: "Invalid email or password." };
          }
          return { user: null, error: "Unable to sign in. Please try again." };
        }

        const data = await res.json();
        const authedUser: User = {
          email: data.user.email,
          isAdmin: data.user.isAdmin === true,
          createdAt: data.user.createdAt,
          id: data.user.id,
        };
        setAuthToken(data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(authedUser));
        setUser(authedUser);
        return { user: authedUser, error: null };
      } catch {
        setUser(null);
        return {
          user: null,
          error: "Unable to reach the server. Please try again.",
        };
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(() => {
    void logoutSession();
    clearAuthToken();
    clearStoredUser();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isInitialising, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
