import { useNavigate } from "react-router-dom";
import { BackButton } from "../shared/BackButton";

import UploadProductData from "../upload/UploadProductData";

export default function UploadDataScreen() {
  const navigate = useNavigate();

  const PRODUCTS = [
    {
      id: "boot_hoist",
      label: "Boot Hoist",
      endpoint: "/api/upload-hoists",
    },
    {
      id: "hand_controls",
      label: "Hand Controls",
      endpoint: "",
    },
    {
      id: "hinged_accelerator_pedal",
      label: "Hinged Accelerator Pedal",
      endpoint: "",
    },
    {
      id: "steering_aids",
      label: "Steering Aids",
      endpoint: "",
    },
  ];

  return (
    <div>
      <BackButton onClick={() => navigate(-1)} style="mb-2" />
      <div className="md:flex md:gap-6 md:mb-3">
        <h1 className="text-[40px] font-semibold text-[#1d1d1b] font-poppins">
          Upload Data
        </h1>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Upload the CSV data for each product below. Each upload replaces the
        data currently held for that product.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full items-start">
        {PRODUCTS.map((product) => {
          return <UploadProductData key={product.id} product={product} />;
        })}
      </div>
    </div>
  );
}
