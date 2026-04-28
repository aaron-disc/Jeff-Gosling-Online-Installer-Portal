import { Lock } from "lucide-react";

const CarIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M5 17H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-1M5 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM19 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
    <path d="M3 9h18v6H3z" />
  </svg>
);

export default function Header({ user, onSignOut }) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 flex items-center gap-4 h-14">
      <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#006B2D] flex items-center justify-center text-white">
          <Lock size={20} />
        </div>

        <span className="font-medium text-gray-900">JG Systems</span>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <span className="text-sm text-gray-500">{user.name}</span>
<button
      className="text-sm text-gray-500 hover:text-gray-900 transition-colors px-2 py-1 cursor-pointer"
      onClick={onSignOut}
    >
          Sign out
        </button>
      </div>
    </header>
  );
}

export function ProductCard({ product, onSelect }) {
  return (
    <button
      className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-start gap-2 hover:shadow-sm transition-shadow text-left cursor-pointer"
      onClick={() => onSelect(product)}
    >
      <div className="w-10 h-10 rounded-lg bg-[#006B2D] flex items-center justify-center text-white">
        <CarIcon />
      </div>
      <span className="font-medium text-gray-900 text-base">{product.label}</span>
      <span className="text-sm text-gray-500">{product.description}</span>
    </button>
  );
}