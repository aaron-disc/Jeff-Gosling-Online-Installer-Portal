import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAppContext } from "../../context/AppContext";
import { LogoGreen } from "../../svg/LogoGreen";
import { LogoYellow } from "../../svg/LogoYellow";
import { Profile } from "../../svg/ProfileSVG";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { setSelectedProduct } = useAppContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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
        <div className="grid lg:grid-cols-3 grid-cols-2 items-center">
          <button
            aria-label="Logo button to home"
            role="button"
            className="group cursor-pointer w-60"
            disabled={location.pathname === "/products"}
            onClick={() => navigate("/products")}
          >
            <LogoGreen className="block group-hover:hidden" />
            <LogoYellow className="hidden group-hover:block" />
          </button>
          <div className="max-lg:hidden place-self-center">
            <h1 className="text-3xl font-poppins font-semibold text-center">
              Online Installation Portal
            </h1>
          </div>
          <div className="flex items-center gap-5 justify-self-end">
            <div className="relative" ref={dropdownRef}>
              <button
                aria-label="Profile Dropdown"
                role="button"
                className="cursor-pointer block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-3xl"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <Profile />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 font-poppins">
                  {user?.isAdmin && location.pathname !== "/upload-data" && (
                    <button
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-md"
                      disabled={location.pathname === "/upload-data"}
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate("/upload-data");
                      }}
                    >
                      Upload Data
                    </button>
                  )}
                  {user?.isAdmin && location.pathname !== "/handle-users" && (
                    <button
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-md"
                      disabled={location.pathname === "/handle-users"}
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate("/handle-users");
                      }}
                    >
                      Handle Users
                    </button>
                  )}
                  {user?.isAdmin && location.pathname !== "/logs" && (
                    <button
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-md"
                      disabled={location.pathname === "/logs"}
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate("/logs");
                      }}
                    >
                      Activity Log
                    </button>
                  )}
                  {user?.isAdmin && location.pathname !== "/sessions" && (
                    <button
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-md"
                      disabled={location.pathname === "/sessions"}
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate("/sessions");
                      }}
                    >
                      User Sessions
                    </button>
                  )}
                  {location.pathname !== "/profile" && (
                    <button
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-md"
                      disabled={location.pathname === "/profile"}
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate("/profile");
                      }}
                    >
                      Profile
                    </button>
                  )}
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
