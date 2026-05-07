import { ChevronLeft } from "lucide-react";

export function BackButton({ onClick }) {
  return (
    <button
      className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4 cursor-pointer"
      onClick={onClick}
    >
      <ChevronLeft size={20}/> Back
    </button>
  );
}