import { Car } from "lucide-react";
import { PRODUCTS } from "../data/products";

export default function ProductSelect({ onSelect }) {
  return (
    <div>
      <h1 className="text-xl font-medium text-gray-900 mb-2">Select product</h1>
      <p className="text-sm text-gray-500 mb-6">
        Choose a product to view fitting instructions for your customer's
        vehicle.
      </p>
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        }}
      >
        {PRODUCTS.map((p) => (
          <button
            className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-start gap-2 hover:shadow-sm transition-shadow text-left cursor-pointer"
            onClick={() => onSelect(p)}
          >
            <div className="w-10 h-10 rounded-lg bg-[#006B2D] flex items-center justify-center text-white">
              <Car />
            </div>
            <span className="font-medium text-gray-900 text-base">
              {p.label}
            </span>
            <span className="text-sm text-gray-500">{p.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
