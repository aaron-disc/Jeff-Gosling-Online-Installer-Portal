import { ChevronLeft } from "lucide-react";

export function BackButton({ onClick, style }) {
  console.log(style)

  return (
    <button
      className={`flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors pr-2 cursor-pointer ${style}`}
      onClick={onClick}
    >
      <ChevronLeft size={20}/> Back
    </button>
  );
}