import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useVehicles } from "../../context/VehiclesContext";
import { BackButton } from "./BackButton";
import { downloadPdf } from "../../utils/downloadPdf";
import { getBootHoistPdfPath } from "../../utils/pdfUrl";
import { apiFetch } from "../../utils/api";

export default function PdfViewer() {
  const navigate = useNavigate();
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const { user } = useAuth();
  const { vehicles, isLoadingVehicles } = useVehicles();
  const [pdfResult, setPdfResult] = useState<{
    path: string;
    url: string;
  } | null>(null);
  const [failedPath, setFailedPath] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  const vehicle = vehicles.find((v) => v.id === Number(vehicleId));
  const pdfPath = vehicle ? getBootHoistPdfPath(vehicle) : null;

  useEffect(() => {
    if (!pdfPath) return;

    let cancelled = false;
    let objectUrl: string | null = null;

    apiFetch(pdfPath)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load PDF");
        return response.blob();
      })
      .then((blob) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setPdfResult({ path: pdfPath, url: objectUrl });
      })
      .catch(() => {
        if (!cancelled) setFailedPath(pdfPath);
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [pdfPath]);

  if (!user) {
    return null;
  }

  if (isLoadingVehicles) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-400">Loading installation guide...</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-400">Vehicle not found.</p>
      </div>
    );
  }

  const pdfUrl = pdfResult?.path === pdfPath ? pdfResult.url : null;
  const hasError = !pdfPath || failedPath === pdfPath;

  if (hasError) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="flex items-center gap-3 px-5 py-3 bg-white border-b border-gray-200">
          <BackButton onClick={() => navigate(`/vehicles/${vehicle.id}`)} />
          <span className="font-medium text-gray-900">
            {vehicle.manufacturer} {vehicle.model} {vehicle.hoistVehicleVariant}{" "}
            - Installation Guide
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
      <div className="flex gap-3 px-5 py-3 bg-white border-b border-gray-200">
        <BackButton onClick={() => navigate(`/vehicles/${vehicle.id}`)} />
        <div className="flex max-[500px]:flex-col grow items-center justify-between gap-2">
          <span className="font-medium text-gray-900 max-[500px]:text-center">
            {vehicle.manufacturer} {vehicle.model} {vehicle.hoistVehicleVariant}{" "}
            - Installation Guide
          </span>
          <button
            className="min-[500px]:ml-auto py-1.5 w-fit px-10 max-h-11.25 bg-[#006B2D] hover:bg-[#005824] text-white shadow-[0px_2px_4px_rgba(0,0,0,0.25)] rounded transition-colors cursor-pointer font-poppins sm:text-[18px] text-sm text-nowrap"
            onClick={() => downloadPdf(vehicle)}
          >
            Download PDF
          </button>
        </div>
      </div>
      {pdfUrl ? (
        <iframe
          src={pdfUrl}
          className="flex-1 border-none w-full"
          style={{ minHeight: "calc(100vh - 64px)" }}
          title="Installation Guide"
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
          Loading installation guide...
        </div>
      )}
    </div>
  );
}
