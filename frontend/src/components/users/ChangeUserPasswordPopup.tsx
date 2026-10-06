import { X } from "lucide-react";
import { useState } from "react";

interface ChangeUserPasswordPopupProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number | undefined;
}

export default function ChangeUserPasswordPopup({
  isOpen,
  onClose,
  userId,
}: ChangeUserPasswordPopupProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setIsSubmitting(false);
  };

  const handleClose = () => {
    if (isSubmitting) return;

    resetForm();
    onClose();
  };

  const validate = () => {
    const MIN_PASSWORD_LENGTH = 8;
    const MAX_PASSWORD_LENGTH = 128;

    if (!userId) {
      return "Unable to determine the current user. Please sign in again.";
    }

    if (!currentPassword) {
      return "Current password is required.";
    }

    if (currentPassword.length > MAX_PASSWORD_LENGTH) {
      return "Current password is too long.";
    }

    if (!newPassword) {
      return "New password is required.";
    }

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      return `New password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }

    if (newPassword.length > MAX_PASSWORD_LENGTH) {
      return `New password must be at most ${MAX_PASSWORD_LENGTH} characters.`;
    }

    if (newPassword !== confirmPassword) {
      return "New and confirmation passwords do not match.";
    }

     if (newPassword === currentPassword) {
      return "New password must be different from the current password.";
    } 

    return "";
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_IP}${import.meta.env.VITE_PORT}/change-password`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmPassword,
            id: userId,
          }),
        },
      );

      let data: { error?: string; message?: string } = {};

      try {
        data = await response.json();
      } catch {
        throw new Error("Error changing user password. Please try again.");
      }

      if (!response.ok) {
        throw new Error(
          data.error ?? "Error changing user password. Please try again.",
        );
      }

      // handle confirmation
      resetForm();
      onClose();
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
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-medium text-gray-900">Change Password</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={(e) => handleSubmit(e)} noValidate id="change-password">
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
                autoComplete="current-password"
                required
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
                autoComplete="new-password"
                required
                minLength={8}
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
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="w-full border border-[#d1d5dc] rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006B2D]"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              className="flex-1 outline outline-[#d1d5dc] text-gray-700 py-2.5 rounded text-sm font-medium hover:bg-[#f3f4f6] cursor-pointer disabled:cursor-not-allowed focus:bg-[#f3f4f6]"
              onClick={handleClose}
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
