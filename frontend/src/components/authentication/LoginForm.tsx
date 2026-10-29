import { LogoGreen } from "../../svg/LogoGreen";

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  error: string;
  isLoading?: boolean;
  onSubmit: () => void;
}

export default function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  error,
  isLoading = false,
  onSubmit,
}: LoginFormProps) {
  return (
    <main className="bg-[#ebedea] rounded-2xl border border-gray-200 shadow-lg p-6 w-full max-w-lg">
      <div className="mx-5 my-10">
        <div className="flex justify-self-center mb-6">
          <LogoGreen />
        </div>
        <div className="flex flex-col gap-3">
          <input
            type="email"
            className="box-border w-full px-5 py-3 bg-white border border-[#7A7A7A] rounded-[8.5px] shadow-[0px_3px_5.5px_rgba(0,0,0,0.25)] focus:shadow-none focus:border-black focus:border focus:outline-none focus:ring-1 text-base"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
            id="hi"
          />
          <input
            type="password"
            className="box-border w-full px-5 py-3 bg-white border border-[#7A7A7A] rounded-[8.5px] shadow-[0px_3px_5.5px_rgba(0,0,0,0.25)] focus:shadow-none focus:border-black focus:border focus:outline-none focus:ring-1  mt-5"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          />
          <div className="flex items-center">
            {error && <p className="text-sm text-red-600 ">{error}</p>}
            <button className="w-auto text-md ml-auto hover:underline hover:text-[#006B2D] cursor-pointer">
              Forgot Password
            </button>
          </div>
          {/* w-full bg-[#006B2D] hover:bg-[#005824] text-white text-[15px] font-medium py-2.5 px-8 rounded transition-colors flex items-center justify-center gap-2 font-poppins cursor-pointer disabled:hover:cursor-not-allowed */}
          <button
            className="w-full py-2.5 my-5 bg-[#006B2D] hover:bg-[#005824] focus:bg-[#005824] text-white shadow-[0px_2px_4px_rgba(0,0,0,0.25)] rounded transition-colors cursor-pointer text-xl font-poppins disabled:opacity-70 disabled:cursor-not-allowed"
            onClick={onSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    </main>
  );
}
