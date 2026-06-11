import { useNavigate, useParams } from "react-router-dom";
import { VEHICLES } from "../../data/vehicles";
import { BackButton } from "../shared/BackButton";
import VehicleDetail from "../vehicles/VehicleDetail";
import { downloadPdf } from "../../utils/downloadPdf";

export default function VehicleDetailScreen() {
  const navigate = useNavigate();
  const { vehicleId } = useParams();
  const vehicle = VEHICLES.find((v) => v.id === Number(vehicleId));

  if (!vehicle) {
    return (
      <div>
        <BackButton onClick={() => navigate("/vehicles")} style="mb-4" />
        <p className="text-sm text-gray-400">Vehicle not found.</p>
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
