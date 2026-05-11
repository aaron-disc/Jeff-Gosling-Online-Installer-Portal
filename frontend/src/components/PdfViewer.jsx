import { ChevronLeft } from "lucide-react";

import { BackButton } from "./BackButon";

export default function PdfViewer({ vehicle, onBack }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex items-center gap-3 px-5 py-3 bg-white border-b border-gray-200">
        <BackButton onClick={onBack} />
        <span className="font-medium text-gray-900">
          {vehicle.make} {vehicle.model} &mdash; Installation Guide
        </span>
        <button
          className="ml-auto py-[6px] px-[25px] w-fit px-10 max-h-[45px] bg-[#006B2D] hover:bg-[#F1C800] focus:bg-[#F1C800] text-[#F1C800] hover:text-[#006B2D] focus:text-[#006B2B] shadow-[0px_2px_4px_rgba(0,0,0,0.25)] rounded transition-colors cursor-pointer font-[Poppins] text-[18px]"
          onClick={async () => {
            const response = await fetch(vehicle.bootHoistPdf);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${vehicle.make}_${vehicle.model}_Installation_Guide.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }}
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

