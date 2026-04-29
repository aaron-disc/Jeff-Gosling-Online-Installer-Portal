import { ChevronLeft } from "lucide-react";

import { LogoGreen } from "../../svg/LogoGreen";

export default function RequestAccessForm({
  firstName,
  setFirstName,
  surname,
  setSurname,
  onBack,
}) {
  return (
    <div className="bg-[#E5E9E5] rounded-2xl border border-gray-200 shadow-lg p-6 w-full max-w-lg">
      <div className="mx-5 my-10">
        <div className="flex flex-col items-center mb-6">
          <LogoGreen />
        </div>
        <div className="flex flex-col gap-3">
          <input
            className="box-border w-full px-5 py-3 bg-white border border-[#7A7A7A] shadow-[0px_3px_6px_rgba(0,0,0,0.25)] rounded-[8.5px] focus:shadow-none focus:border-black focus:border-1 focus:outline-none focus:ring-1"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            className="box-border w-full px-5 py-3 bg-white border border-[#7A7A7A] shadow-[0px_3px_6px_rgba(0,0,0,0.25)] rounded-[8.5px] focus:shadow-none focus:border-black focus:border-1 focus:outline-none focus:ring-1 mt-5"
            placeholder="Surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
          />

          <button className="pl-2 cursor-pointer text-md self-end w-auto hover:underline hover:text-[#006B2D] invisible">
            Forgot Password
          </button>
          <button className="w-full bg-[#006B2D] hover:bg-[#F1C800] text-[#F1C800] hover:text-[#006B2D] font-medium py-2.5 rounded text-lg transition-colors cursor-pointer mt-5">
            Request Access
          </button>

          <div className="mt-3 flex justify-center">
            <ChevronLeft strokeWidth={1.25} />
            <button
              className="cursor-pointer text-md text-center hover:underline hover:text-[#006B2D] px-2"
              onClick={onBack}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
