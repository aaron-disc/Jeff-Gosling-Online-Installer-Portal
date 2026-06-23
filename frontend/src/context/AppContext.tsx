import { createContext, useContext, useState, type ReactNode } from "react";

interface Product {
  id: string;
  label: string;
  description: string;
}

export type { Product };

interface AppContextType {
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <AppContext.Provider value={{ selectedProduct, setSelectedProduct }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
