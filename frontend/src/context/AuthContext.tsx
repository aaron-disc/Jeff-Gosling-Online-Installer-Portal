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
  setAuthToken,
  UNAUTHORIZED_EVENT,
} from "../utils/api";

interface User {
  email: string;
  isAdmin: boolean;
  createdAt: string;
  id: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() =>
    localStorage.getItem("jgAuthToken") ? loadStoredUser() : null,
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleUnauthorized = () => setUser(null);
    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    return () =>
      window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
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
          localStorage.removeItem(USER_KEY);
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
    clearAuthToken();
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
