import { X } from "lucide-react";
import type { User } from "../screens/HandleUsersScreen";

interface DeleteUserPopupProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onDeleteUser: ({ id }: { id: number }) => Promise<void>;
}

export default function DeleteUserPopup({
  isOpen,
  onClose,
  user,
  onDeleteUser,
}: DeleteUserPopupProps) {
  if (!isOpen || !user) return null;

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
          <h2 className="text-lg font-medium text-gray-900">Delete user</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-sm text-gray-700">
          Are you sure you want to delete{" "}
          <span className="font-medium text-gray-900">{user.email}</span>? This
          action cannot be undone.
        </p>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            className="flex-1 outline outline-gray-300 text-gray-700 py-2.5 rounded text-sm font-medium hover:bg-[#f3f4f6] cursor-pointer disabled:cursor-not-allowed focus:bg-[#f3f4f6]"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-[#006B2D] text-white py-2.5 rounded text-sm font-medium hover:bg-[#005824] cursor-pointer disabled:cursor-not-allowed"
            onClick={() => onDeleteUser({ id: user.id })}
          >
            Delete User
          </button>
        </div>
      </div>
    </div>
  );
}
