import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { Car } from "lucide-react";
import { PRODUCTS } from "../../data/products";

export default function ProductSelect() {
  const navigate = useNavigate();
  const { setSelectedProduct } = useAppContext();

  const handleSelect = (product) => {
    setSelectedProduct(product);
    navigate("/vehicles");
  };

  return (
    <div>
      <h1 className="text-xl font-medium text-gray-900 mb-2">Select product</h1>
      <p className="text-sm text-gray-500 mb-6">
        Welcome to the Jeff Gosling online installation portal. Here we provide
        key information and fitting instructions for our products. This portal
        is regularly updated but as vehicles are changing daily and we are
        continuously adding designs, please check anything vital with us
        directly. If you cannot find the information you require, or if you
        would like to check any details, please contact us on 0161 430 1470.
      </p>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
        {PRODUCTS.map((p, i) => (
          <button
            key={i}
            className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-start gap-2 hover:shadow-sm transition-shadow text-left cursor-pointer"
            onClick={() => handleSelect(p)}
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
