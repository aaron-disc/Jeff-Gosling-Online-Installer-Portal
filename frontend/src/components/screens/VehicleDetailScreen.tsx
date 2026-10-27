import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BackButton } from "../shared/BackButton";
import VehicleDetail from "../vehicles/VehicleDetail";
import { downloadPdf } from "../../utils/downloadPdf";
import { fetchVehicle } from "../../data/vehicles";
import type { Vehicle } from "../../data/types";

interface VehicleResult {
  id: string;
  vehicle: Vehicle | null;
  error: string | null;
}

export default function VehicleDetailScreen() {
  const navigate = useNavigate();
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const [result, setResult] = useState<VehicleResult | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!vehicleId) return;

    let cancelled = false;

    fetchVehicle(vehicleId)
      .then((data) => {
        if (cancelled) return;
        setResult({ id: vehicleId, vehicle: data, error: null });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setResult({
          id: vehicleId,
          vehicle: null,
          error: err instanceof Error ? err.message : "Something went wrong.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [vehicleId]);

  const isCurrent = result?.id === vehicleId;
  const isLoading = Boolean(vehicleId) && !isCurrent;
  const error = !vehicleId
    ? "Vehicle not found."
    : isCurrent
      ? result?.error
      : null;
  const vehicle = isCurrent ? result?.vehicle : null;

  if (isLoading) {
    return (
      <div>
        <BackButton onClick={() => navigate("/vehicles")} style="mb-4" />
        <p className="text-base text-[#575756] text-center mt-20">Loading vehicle...</p>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div>
        <BackButton onClick={() => navigate("/vehicles")} style="mb-4" />
        <p className="text-base text-[#575756] text-center mt-20">
          {error ?? "Vehicle not found."}
        </p>
      </div>
    );
  }

  return (
    <div>
      <BackButton onClick={() => navigate("/vehicles")} style="mb-4" />
      <VehicleDetail
        vehicle={vehicle}
        onViewPdf={() => navigate(`/vehicles/${vehicle.id}/pdf`)}
        onDownloadPdf={() => downloadPdf(vehicle)}
      />
    </div>
  );
}
