import { createContext, useContext, useState, useCallback } from "react";
import { DEMO_USERS } from "../data/users";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = useCallback((email, password) => {
    const found = DEMO_USERS.find(
      (u) => u.email === email && u.password === password,
    );
    if (found) {
      setUser(found);
      return found;
    }
    return null;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
