import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../shared/BackButton";
import { useAppContext } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { formatDate } from "../../utils/formatDate";
import ChangeUserPasswordPopup from "../users/ChangeUserPasswordPopup";

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { setSelectedProduct } = useAppContext();
  const [isChangePaswordOpen, setIsChangePasswordOpen] = useState(false);

  const handleSignOut = () => {
    setSelectedProduct(null);
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div>
      <BackButton onClick={() => navigate(-1)} style="mb-2" />
      <div className="md:flex md:gap-6 md:mb-3">
        <h1 className="text-[40px] font-semibold text-[#1d1d1b] font-poppins">
          Profile
        </h1>
      </div>

      <div className="font-poppins bg-white rounded-xl border border-gray-200 p-6 w-full max-w-xl">
        <h2 className="text-lg font-medium text-gray-900">Account details</h2>

        <dl className="mt-5 space-y-4">
          <div className="flex flex-col gap-1">
            <dt className="text-sm text-gray-600">Email</dt>
            <dd className="text-[15px] font-medium text-gray-900 break-all">
              {user?.email}
            </dd>
          </div>

          <div className="flex flex-col gap-1">
            <dt className="text-sm text-gray-600">Account created</dt>
            <dd className="text-[15px] font-medium text-gray-900">
              {user && formatDate(user.createdAt)}
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <ChangeUserPasswordPopup
            isOpen={isChangePaswordOpen}
            onClose={() => setIsChangePasswordOpen(false)}
          />

          <button
            type="button"
            className="flex-1 outline outline-[#d1d5dc] hover:bg-[#f3f4f6] focus:bg-[#f3f4f6] text-gray-700 text-[15px] font-medium py-2.5 px-4 rounded transition-colors flex items-center justify-center gap-2 cursor-pointer "
            onClick={() => setIsChangePasswordOpen(true)}
          >
            Change Password
          </button>

          <button
            type="button"
            onClick={handleSignOut}
            className="flex-1 bg-[#006B2D] hover:bg-[#005824] text-white text-[15px] font-medium py-2.5 px-4 rounded transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
