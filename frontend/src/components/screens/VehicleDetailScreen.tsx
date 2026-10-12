import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useVehicles } from "../../context/VehiclesContext";
import { BackButton } from "../shared/BackButton";
import VehicleDetail from "../vehicles/VehicleDetail";
import { downloadPdf } from "../../utils/downloadPdf";

export default function VehicleDetailScreen() {
  const navigate = useNavigate();
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const { vehicles, isLoadingVehicles, vehiclesError } = useVehicles();
  const vehicle = vehicles.find((v) => v.id === Number(vehicleId));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoadingVehicles) {
    return (
      <div>
        <BackButton onClick={() => navigate("/vehicles")} style="mb-2" />
        <p className="text-sm text-gray-400">Loading vehicle...</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div>
        <BackButton onClick={() => navigate("/vehicles")} style="mb-2" />
        <p className="text-sm text-gray-400">
          {vehiclesError ?? "Vehicle not found."}
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
