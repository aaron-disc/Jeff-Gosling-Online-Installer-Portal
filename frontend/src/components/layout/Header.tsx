import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAppContext } from "../../context/AppContext";
import { LogoGreen } from "../../svg/LogoGreen";
import { LogoYellow } from "../../svg/LogoYellow";
import { Profile } from "../../svg/ProfileSVG";

export default function Header() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { setSelectedProduct } = useAppContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    setSelectedProduct(null);
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="w-full">
      <div className="max-w-350 w-full mx-auto px-6">
        <div className="flex items-center gap-4 justify-between">
          <div
            className="group shrink-0 cursor-pointer"
            onClick={() => navigate("/products")}
          >
            <LogoGreen className="block group-hover:hidden" />
            <LogoYellow className="hidden group-hover:block" />
          </div>

          <div>
            <h1 className="text-3xl font-poppins font-semibold">Online Installation Portal</h1>
          </div>

          <div className="flex items-center gap-5 shrink-0">
            <div className="relative" ref={dropdownRef}>
              <button
                className="cursor-pointer block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-3xl"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <Profile />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 font-poppins">
                  <button
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-md"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
