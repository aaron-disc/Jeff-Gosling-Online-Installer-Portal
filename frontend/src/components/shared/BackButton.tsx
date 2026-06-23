import { ChevronLeft } from "lucide-react";

interface BackButtonProps {
  onClick: () => void;
  style?: string;
}

export function BackButton({ onClick, style }: BackButtonProps) {
  return (
    <button
      className={`flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors pr-2 cursor-pointer ${style}`}
      onClick={onClick}
    >
      <ChevronLeft size={20}/> Back
    </button>
  );
}
