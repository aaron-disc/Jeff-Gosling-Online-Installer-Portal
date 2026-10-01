import { X } from "lucide-react";
import { FormEvent, useState } from "react";

interface ChangeUserPasswordPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangeUserPasswordPopup({
  isOpen,
  onClose,
}: ChangeUserPasswordPopupProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      /* async fn change password.hi  */

      setIsSubmitting(false);
    } catch (err) {
      setIsSubmitting(false);
      setError(
        err instanceof Error
          ? err.message
          : "Error changing user password. Please try again.",
      );
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 font-poppins"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-medium text-gray-900">Change Password</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={(e) => handleSubmit(e)} noValidate>
          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="current-password"
              >
                Current Password
              </label>
              <input
                id="current-password"
                type="password"
                className="w-full border border-[#d1d5dc] rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006B2D]"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="new-password"
              >
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                className="w-full border border-[#d1d5dc] rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006B2D]"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="confirm-password"
              >
                Confirm Password
              </label>
              <input
                id="confirm-confirm"
                type="password"
                className="w-full border border-[#d1d5dc] rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006B2D]"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              className="flex-1 outline outline-[#d1d5dc] text-gray-700 py-2.5 rounded text-sm font-medium hover:bg-[#f3f4f6] cursor-pointer disabled:cursor-not-allowed focus:bg-[#f3f4f6]"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#006B2D] text-white py-2.5 rounded text-sm font-medium hover:bg-[#005824] cursor-pointer disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Changing..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
