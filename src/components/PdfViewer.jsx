import { ChevronLeft } from "lucide-react";

export default function PdfViewer({ vehicle, onBack }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex items-center gap-3 px-5 py-3 bg-white border-b border-gray-200">
        <button
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
          onClick={onBack}
        >
          <ChevronLeft size={20}/> Back
        </button>
        <span className="font-medium text-gray-900">
          {vehicle.make} {vehicle.model} &mdash; Installation Guide
        </span>
        <button
          className="ml-auto bg-[#006B2D] hover:bg-[#005824] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
          onClick={() => window.open(vehicle.bootHoistPdf, "_blank")}
        >
          Download PDF
        </button>
      </div>
      <iframe
        src={vehicle.bootHoistPdf}
        className="flex-1 border-none w-full"
        style={{ minHeight: "calc(100vh - 56px)" }}
        title="Installation Guide"
      />
    </div>
  );
}