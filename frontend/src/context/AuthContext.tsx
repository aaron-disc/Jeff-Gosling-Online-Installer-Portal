import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface User {
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ user: User | null; error: string | null }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(
    async (email: string, password: string): Promise<{ user: User | null; error: string | null }> => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_IP}${import.meta.env.VITE_PORT}/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, password: password }),
          },
        );

        if (!res.ok) {
          setUser(null);
          if (res.status === 401) {
            return { user: null, error: "Invalid email or password." };
          }
          return { user: null, error: "Unable to sign in. Please try again." };
        }

        const data = await res.json();
        const authedUser: User = {
          email: data.user.email,
          isAdmin: data.user.isAdmin === true,
        };
        setUser(authedUser);
        return { user: authedUser, error: null };
      } catch {
        setUser(null);
        return { user: null, error: "Unable to reach the server. Please try again." };
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(() => {
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