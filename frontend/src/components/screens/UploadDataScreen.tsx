import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";
import { BackButton } from "../shared/BackButton";
import { apiFetch } from "../../utils/api";

export default function UploadDataSceen() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];

    if (!selected) {
      setFile(null);
      setError("");
      return;
    }

    if (!selected.name.toLowerCase().endsWith(".csv")) {
      setFile(null);
      setError("Please select a CSV file.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setFile(selected);
    setError("");

    const formData = new FormData();
    formData.append("file", selected);

    console.log(formData);
  };

  const handleUploadFile = async () => {
    if (!file) {
      console.log({ type: "error", message: "Please choose a file first." });
      // handle errors properly u div
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await apiFetch("/api/upload-hoists", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong during upload.");
      }

      setFile(null); // Clear selected file on success
    } catch (err) {
      const message = err instanceof Error ? err.message : "error i wrote";
      console.log({ type: "error", message: message });
    } finally {
      console.log("finished");
    }
  };

  return (
    <div>
      <BackButton onClick={() => navigate(-1)} style="mb-2" />
      <div className="md:flex md:gap-6 md:mb-3">
        <h1 className="text-[40px] font-semibold text-[#1d1d1b] font-poppins">
          Upload Data
        </h1>
      </div>

      <div className="font-poppins bg-white rounded-xl border border-gray-200 p-6 w-full max-w-xl">
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="upload-data-file"
          >
            CSV file
          </label>
          <input
            id="upload-data-file"
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full border border-[#d1d5dc] rounded px-3 py-2.5 text-sm text-gray-700 flex items-center justify-center gap-2 hover:bg-[#f3f4f6] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#006B2D]"
          >
            <Upload size={18} className="text-[#006B2D]" />
            {file ? file.name : "Choose a CSV file"}
          </button>
        </div>

        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

        <button
          type="button"
          disabled={!file}
          className="w-full mt-3 flex-1 bg-[#006B2D] text-white py-2.5 rounded text-sm font-medium hover:bg-[#005824] cursor-pointer disabled:cursor-not-allowed"
          onClick={handleUploadFile}
        >
          Upload
        </button>
      </div>
    </div>
  );
}
