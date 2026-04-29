import { useState, useRef, useEffect } from "react";
import { LogoGreen } from "../svg/LogoGreen";
import { LogoYellow } from "../svg/LogoYellow";
import {
  Profile1,
  Profile2,
  Profile3,
  Profile4,
  Profile5,
  Profile6,
  Profile7,
  Profile8,
  Profile9,
  Profile10,
  Profile11,
  Profile12,
} from "../svg/ProfileSVG";

export function TestHeader({ user, onSignOut }) {
  const [hover, setHover] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const profileFrames = [
    <Profile1 />,
    <Profile2 />,
    <Profile3 />,
    <Profile4 />,
    <Profile5 />,
    <Profile6 />,
    <Profile7 />,
    <Profile8 />,
    <Profile9 />,
    <Profile10 />,
    <Profile11 />,
    <Profile12 />,
  ];

  useEffect(() => {
    if (!playing) return;

    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % profileFrames.length);
    }, 100);

    return () => clearInterval(interval);
  }, [playing]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-between px-[min(5vw,5rem)] gap-[min(5vw,5rem)] pt-5">
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {hover ? <LogoYellow /> : <LogoGreen />}
      </div>

      <div className="grow flex items-center gap-[min(2vw,1rem)] px-20">
        <input
          type="text"
          placeholder="Find"
          className="box-border w-full px-5 py-3 bg-white border border-[#7A7A7A] rounded focus:border-black focus:outline-none focus:ring-1"
        />

        <button className="w-fit px-10 bg-[#006B2D] hover:bg-[#F1C800] text-[#F1C800] hover:text-[#006B2D] font-medium py-2.5 rounded text-lg transition-colors cursor-pointer font-[Poppins] text-4xl">
          Search
        </button>
      </div>

      <div className="flex items-center gap-[min(3vw,2rem)]">
        <h1 className="text-2xl hover:text-[#006B2D] cursor-default">
          {user.name}
        </h1>
        <div className="relative" ref={dropdownRef}>
          <div
            className="cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            onMouseEnter={() => setPlaying(true)}
            onMouseLeave={() => setPlaying(false)}
          >
            {profileFrames[index]}
          </div>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <button
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                onClick={onSignOut}
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
  );
}
