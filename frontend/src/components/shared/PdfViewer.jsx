import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { VEHICLES } from "../../data/vehicles";
import { BackButton } from "./BackButton";
import { downloadPdf } from "../../utils/downloadPdf";

export default function PdfViewer() {
  const navigate = useNavigate();
  const { vehicleId } = useParams();
  const { user } = useAuth();

  const vehicle = VEHICLES.find((v) => v.id === Number(vehicleId));

  if (!user) {
    navigate("/login", { replace: true });
    return null;
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-400">Vehicle not found.</p>
      </div>
    );
  }

  if (!vehicle.bootHoistPdf) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="flex items-center gap-3 px-5 py-3 bg-white border-b border-gray-200">
          <BackButton onClick={() => navigate(`/vehicles/${vehicle.id}`)} />
          <span className="font-medium text-gray-900">
            {vehicle.manufacturer} {vehicle.model} {vehicle.hoistVehicleVariant} - Installation Guide
          </span>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
          No installation guide available for this vehicle.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex items-center gap-3 px-5 py-3 bg-white border-b border-gray-200">
        <BackButton onClick={() => navigate(`/vehicles/${vehicle.id}`)} />
        <span className="font-medium text-gray-900">
          {vehicle.manufacturer} {vehicle.model} {vehicle.hoistVehicleVariant} -
          Installation Guide
        </span>
        <button
          className="ml-auto py-1.5 w-fit px-10 max-h-11.25 bg-[#006B2D] hover:bg-[#005824] text-white shadow-[0px_2px_4px_rgba(0,0,0,0.25)] rounded transition-colors cursor-pointer font-poppins text-[18px]"
          onClick={() => downloadPdf(vehicle)}
        >
          Download PDF
        </button>
      </div>
      <iframe
        src={vehicle.bootHoistPdf}
        className="flex-1 border-none w-full"
        style={{ minHeight: "calc(100vh - 64px)" }}
        title="Installation Guide"
      />
    </div>
  );
}

/* hover:bg-[#F1C800] focus:bg-[#F1C800] text-[#F1C800] hover:text-[#006B2D] focus:text-[#006B2B] */