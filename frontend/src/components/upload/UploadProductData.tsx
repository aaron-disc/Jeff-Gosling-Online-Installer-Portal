import {
  Upload,
  Loader2,
  Trash2,
  FilePlus,
  Info,
  CircleX,
  Check,
} from "lucide-react";
import { useState, useRef } from "react";
import { apiFetch } from "../../utils/api";

interface ProductInterface {
  id: string;
  label: string;
  endpoint: string;
}
interface UploadProductDataProps {
  product: ProductInterface;
}

export default function UploadProductData({ product }: UploadProductDataProps) {
  const [message, setMessage] = useState({
    text: "No file uploaded.",
    type: "none",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (selected: File | undefined) => {
    setMessage({
      text: "No file uploaded.",
      type: "none",
    });

    if (!selected) {
      setFile(null);
      setMessage({
        text: "Please select a file",
        type: "error",
      });
      return;
    }

    if (!selected.name.toLowerCase().endsWith(".csv")) {
      setFile(null);
      setMessage({
        text: "Please select a CSV file.",
        type: "error",
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (selected.size > 10485760) {
      setFile(null);
      setMessage({
        text: "File is too large. Maximum is 10 MB",
        type: "error",
      });
    }

    setFile(selected);
    setMessage({
      text: "File ready for upload.",
      type: "none",
    });
  };

  console.log(message)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFile(e.target.files?.[0]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  const handleUpload = async () => {
    setMessage({
      text: "File Uploading...",
      type: "none",
    });
    setIsUploading(true);

    if (!file) {
      console.log({ type: "error", message: "Please choose a file first." });
      // handle errors properly u div
      setIsUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await apiFetch(product.endpoint, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong during upload.");
      }

      setMessage({
        text: "File uploaded successfully.",
        type: "success",
      });
      setFile(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "error i wrote";
      setMessage({
        text: message,
        type: "error",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClearFile = () => {
    setMessage({
      text: "No file selected",
      type: "none",
    });
    setFile(null);
  };

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <section
      key={product.id}
      aria-labelledby={`upload-target-${product.id}`}
      className="font-poppins bg-white rounded-xl border border-gray-200 p-6 w-full"
    >
      <button className="flex items-center justify-between gap-3 text-left w-full focus:outline-offset-4">
        <div className="min-w-0">
          <h2
            id={`upload-target-${product.id}`}
            className="text-xl font-semibold text-[#1d1d1b]"
          >
            {product.label}
          </h2>
        </div>
      </button>

      <div className="mt-3">
        <input
          id="file-input"
          type="file"
          ref={fileInputRef}
          accept=".csv,text/csv"
          onChange={(e) => handleFileChange(e)}
          className="hidden"
        />

        <div className="flex flex-col gap-3">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
            onDrop={handleDrop}
            className={`min-h-48.5 flex flex-col items-center justify-center rounded-xl border-2 border-dashed bg-white px-4 py-6 text-sm ${
              isDragging || file ? "border-gray-400" : "border-gray-300"
            }`}
          >
            {file ? (
              <div className="flex flex-col items-center gap-2 px-3 py-2.5 text-base">
                <span className="truncate text-gray-700" title={file.name}>
                  {file.name}
                </span>
                <div className="">
                  <span className="ml-auto text-gray-500">
                    {formatFileSize(file.size)}
                  </span>
                  <button
                    type="button"
                    onClick={handleClearFile}
                    disabled={isUploading}
                    aria-label={`Remove ${file.name}`}
                    className="transition-transform translate-y-0.5 ml-4 shrink-0 cursor-pointer text-gray-500 hover:text-gray-900 outline-black outline-offset-4 focus:outline-2 rounded disabled:cursor-not-allowed"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <FilePlus size={40} strokeWidth={1.5} />
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-8 mb-3">
                  <span className="text-gray-600">Drag and drop or</span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full sm:w-auto border border-[#d1d5dc] rounded px-8 py-2.5 min-w-37 text-sm font-medium text-gray-700 flex items-center justify-center cursor-pointer hover:bg-[#f3f4f6] focus:bg-[#f3f4f6]"
                  >
                    Choose file
                  </button>
                </div>
                <span className="text-gray-600 text-xs">CSV (max. 10 MB)</span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="w-full bg-[#006B2D] hover:bg-[#005824] text-white text-[15px] font-medium py-2.5 px-8 rounded transition-colors flex items-center justify-center gap-2 font-poppins cursor-pointer disabled:hover:cursor-not-allowed"
          >
            {isUploading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Upload size={16} />
            )}
            {isUploading ? "Uploading..." : "Upload"}
          </button>
          <div className="bg-[#f3f4f6] border border-[#d1d5dc] py-2.25 px-2 rounded text-[15px] flex items-center">
            <span>
              {message.type === "none" ? (
                <Info size={18} />
              ) : message.type === "success" ? (
                <Check size={18} color="#13A538" />
              ) : (
                message.type === "error" && (
                  <CircleX size={18} color="#e60a0a" />
                )
              )}
            </span>
            <p
              className={`ml-4 ${message.type === "error" ? "text-[#e60a0a]" : message.type === "success" && "text-[#13A538]"} `}
            >
              {message.text}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
