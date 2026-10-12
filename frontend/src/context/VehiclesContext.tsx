import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Vehicle } from "../data/types";
import { fetchVehicles } from "../data/vehicles";
import { useAuth } from "./AuthContext";

interface VehiclesContextType {
  vehicles: Vehicle[];
  isLoadingVehicles: boolean;
  vehiclesError: string | null;
}

const VehiclesContext = createContext<VehiclesContextType | null>(null);

export function VehiclesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [data, setData] = useState<{
    userId: number;
    vehicles: Vehicle[];
  } | null>(null);
  const [failedUserId, setFailedUserId] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    fetchVehicles()
      .then((vehicles) => {
        if (cancelled) return;
        setData({ userId: user.id, vehicles });
        setFailedUserId(null);
      })
      .catch(() => {
        if (cancelled) return;
        setFailedUserId(user.id);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const isCurrent = user != null && data?.userId === user.id;
  const vehicles = isCurrent && data ? data.vehicles : [];
  const vehiclesError =
    user != null && failedUserId === user.id
      ? "Unable to load vehicles. Please try again."
      : null;
  const isLoadingVehicles =
    user != null && !isCurrent && vehiclesError === null;

  return (
    <VehiclesContext.Provider
      value={{ vehicles, isLoadingVehicles, vehiclesError }}
    >
      {children}
    </VehiclesContext.Provider>
  );
}

export function useVehicles(): VehiclesContextType {
  const ctx = useContext(VehiclesContext);
  if (!ctx) throw new Error("useVehicles must be used within VehiclesProvider");
  return ctx;
}
