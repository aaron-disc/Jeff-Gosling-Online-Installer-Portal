import { useState, type FormEvent } from "react";
import { X } from "lucide-react";

export interface NewUser {
  email: string;
  password: string;
  isAdmin: number;
}

interface CreateUserPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (user: NewUser) => void | Promise<void>;
}

const MIN_PASSWORD_LENGTH = 8;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass =
  "w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#006B2D]";
const labelClass = "block text-sm font-medium text-gray-700 mb-1";

export default function CreateUserPopup({
  isOpen,
  onClose,
  onCreate,
}: CreateUserPopupProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(0);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setIsAdmin(0);
    setError("");
    setIsSubmitting(false);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!EMAIL_PATTERN.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await onCreate({ email: email.trim(), password, isAdmin });
      resetForm();
      onClose();
    } catch (err) {
      setIsSubmitting(false);
      setError(
        err instanceof Error
          ? err.message
          : "Error creating a new user. Please try again.",
      );
    }
  };

  if (!isOpen) return null;

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
          <h2 className="text-lg font-medium text-gray-900">Create user</h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 cursor-pointer disabled:cursor-not-allowed"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            <div>
              <label className={labelClass} htmlFor="create-user-email">
                Email
              </label>
              <input
                id="create-user-email"
                type="email"
                className={inputClass}
                placeholder="some placeholder"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="create-user-password">
                Password
              </label>
              <input
                id="create-user-password"
                type="password"
                className={inputClass}
                placeholder="some placeholder"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="create-user-confirm">
                Confirm password
              </label>
              <input
                id="create-user-confirm"
                type="password"
                className={inputClass}
                placeholder="some placeholder"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="create-user-role">
                Role
              </label>
              <select
                id="create-user-role"
                className={inputClass}
                value={isAdmin ? "admin" : "user"}
                onChange={(e) => setIsAdmin(parseInt(e.target.value))}
                disabled={isSubmitting}
              >
                <option value="0">User</option>
                <option value="1">Admin</option>
              </select>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              className="flex-1 outline outline-gray-300 text-gray-700 py-2.5 rounded text-sm font-medium hover:bg-gray-50 cursor-pointer disabled:cursor-not-allowed disabled:hover:text-[#006B2D]"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#006B2D] text-white py-2.5 rounded text-sm font-medium hover:bg-[#005824] cursor-pointer disabled:cursor-not-allowed disabled:hover:bg-[#006B2D]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
