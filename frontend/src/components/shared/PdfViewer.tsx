import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BackButton } from "./BackButton";
import { downloadPdf } from "../../utils/downloadPdf";
import { getBootHoistPdfPath } from "../../utils/pdfUrl";
import { apiFetch } from "../../utils/api";
import { fetchVehicle } from "../../data/vehicles";
import type { Vehicle } from "../../data/types";

export default function PdfViewer() {
  const navigate = useNavigate();
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const { user } = useAuth();
  const [vehicleResult, setVehicleResult] = useState<{
    id: string;
    vehicle: Vehicle | null;
  } | null>(null);
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

  useEffect(() => {
    if (!vehicleId) return;

    let cancelled = false;

    fetchVehicle(vehicleId)
      .then((data) => {
        if (cancelled) return;
        setVehicleResult({ id: vehicleId, vehicle: data });
      })
      .catch(() => {
        if (cancelled) return;
        setVehicleResult({ id: vehicleId, vehicle: null });
      });

    return () => {
      cancelled = true;
    };
  }, [vehicleId]);

  const isCurrent = vehicleResult?.id === vehicleId;
  const isLoadingVehicle = Boolean(vehicleId) && !isCurrent;
  const vehicle = isCurrent ? vehicleResult?.vehicle : null;
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

  if (isLoadingVehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#ebedea]">
        <p className="text-sm text-gray-400">Loading installation guide...</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex flex-col gap-6 items-center justify-center bg-[#ebedea]">
        <BackButton onClick={() => navigate("/vehicles")}/>
        <p className="text-base text-gray-400">Vehicle not found.</p>
      </div>
    );
  }

  const pdfUrl = pdfResult?.path === pdfPath ? pdfResult.url : null;
  const hasError = !pdfPath || failedPath === pdfPath;

  if (hasError) {
    return (
      <div className="min-h-screen flex flex-col bg-[#ebedea]">
        <div className="flex items-center gap-3 px-5 py-3 bg-white border-b border-gray-200">
          <BackButton onClick={() => navigate(`/vehicles/${vehicle.id}`)} />
          <span className="font-medium text-gray-900">
            {vehicle.manufacturer} {vehicle.model} {vehicle.hoistVehicleVariant}{" "}
            - Installation Guide
          </span>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-500 text-base">
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
