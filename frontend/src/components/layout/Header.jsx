import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAppContext } from "../../context/AppContext";
import { LogoGreen } from "../../svg/LogoGreen";
import { LogoYellow } from "../../svg/LogoYellow";
import { Profile1 } from "../../svg/ProfileSVG";

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { setSelectedProduct } = useAppContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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
        <div className="flex items-center pt-2.5 gap-16">
          <div className="group cursor-pointer shrink-0" onClick={() => navigate("/products")}>
            <LogoGreen className="block group-hover:hidden" />
            <LogoYellow className="hidden group-hover:block" />
          </div>

          <div className="flex-1 flex items-center gap-3 min-w-0">
            <input
              type="text"
              placeholder="Find"
              className="box-border w-full min-w-0 max-w-200 max-h-11.25 px-5 py-3 bg-white border border-[#7A7A7A] rounded shadow-[0px_2px_4px_rgba(0,0,0,0.25)] focus:shadow-none focus:border-black focus:outline-none focus:ring-1"
            />

            <button className="py-1.5 w-fit px-10 min-h-11.25 bg-[#006B2D] hover:bg-[#F1C800] focus:bg-[#F1C800] text-[#F1C800] hover:text-[#006B2D] focus:text-[#006B2B] shadow-[0px_2px_4px_rgba(0,0,0,0.25)] rounded transition-colors cursor-pointer font-poppins text-[20px] whitespace-nowrap">
              Search
            </button>
          </div>

          <div className="flex items-center gap-5 shrink-0">
            <span className="text-xl hover:text-[#006B2D] cursor-default font-poppins hidden sm:inline">
              {user?.name}
            </span>
            <div className="relative" ref={dropdownRef}>
              <button
                className="cursor-pointer block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-3xl"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <Profile1 />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <button
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                    Settings
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                    Theme
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
