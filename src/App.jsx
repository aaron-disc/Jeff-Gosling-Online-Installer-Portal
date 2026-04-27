import { useState } from "react";

const DEMO_USERS = [
  {
    id: 1,
    email: "admin@accessparts.co.uk",
    password: "admin123",
    name: "Sarah Mitchell",
  },
  {
    id: 2,
    email: "installer@garageone.co.uk",
    password: "install123",
    name: "James Okafor",
  },
  {
    id: 3,
    email: "tech@mobilityfit.co.uk",
    password: "install123",
    name: "Priya Sharma",
  },
];

const PRODUCTS = [
  {
    id: "boot-hoist",
    label: "Boot Hoist",
    description: "Vehicle boot hoist fitting instructions",
  },
];

const VEHICLES = [
  {
    id: 1,
    make: "Volkswagen",
    model: "Golf",
    year: "2022",
    variant: "1.5 TSI Life 5dr",
    engine: "150ps Petrol",
    transmission: "6-Speed Manual",
    bootSpace: "381L",
    hoistType: "Type A",
    bootHoistPdf: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF1.pdf",
    image:
      "https://images.unsplash.com/photo-1619767886550-9c4dbd11c2de?w=400&q=80",
  },
  {
    id: 2,
    make: "Ford",
    model: "Focus",
    year: "2021",
    variant: "1.0 EcoBoost ST-Line 5dr",
    engine: "125ps Petrol",
    transmission: "6-Speed Manual",
    bootSpace: "341L",
    hoistType: "Type B",
    bootHoistPdf: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF1.pdf",
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&q=80",
  },
  {
    id: 3,
    make: "Vauxhall",
    model: "Corsa",
    year: "2023",
    variant: "1.2 Turbo SE Auto",
    engine: "100ps Petrol",
    transmission: "8-Speed Auto",
    bootSpace: "309L",
    hoistType: null,
    bootHoistPdf: null,
    image:
      "https://images.unsplash.com/photo-1609521264573-af2F1a77c35b?w=400&q=80",
  },
  {
    id: 4,
    make: "Toyota",
    model: "Yaris",
    year: "2022",
    variant: "1.5 VVT-i Hybrid Excel",
    engine: "116ps Hybrid",
    transmission: "e-CVT",
    bootSpace: "210L",
    hoistType: "Type C",
    bootHoistPdf: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF1.pdf",
    image:
      "https://images.unsplash.com/photo-1621963979368-0f2f89ee5c52?w=400&q=80",
  },
  {
    id: 5,
    make: "Nissan",
    model: "Qashqai",
    year: "2021",
    variant: "1.3 DIG-T N-Connecta 5dr",
    engine: "140ps Petrol",
    transmission: "6-Speed Manual",
    bootSpace: "504L",
    hoistType: "Type A",
    bootHoistPdf: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF1.pdf",
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=80",
  },
  {
    id: 6,
    make: "Kia",
    model: "Sportage",
    year: "2023",
    variant: "1.6 T-GDi GT-Line 5dr DCT",
    engine: "177ps Petrol",
    transmission: "7-Speed DCT Auto",
    bootSpace: "591L",
    hoistType: "Type B",
    bootHoistPdf: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF1.pdf",
    image:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&q=80",
  },
  {
    id: 7,
    make: "Hyundai",
    model: "Tucson",
    year: "2022",
    variant: "1.6 T-GDi Hybrid Premium Auto",
    engine: "230ps Hybrid",
    transmission: "6-Speed Auto",
    bootSpace: "577L",
    hoistType: null,
    bootHoistPdf: null,
    image:
      "https://images.unsplash.com/photo-1609832955354-8c6ce5b70090?w=400&q=80",
  },
  {
    id: 8,
    make: "BMW",
    model: "3 Series",
    year: "2020",
    variant: "320i M Sport Auto",
    engine: "184ps Petrol",
    transmission: "8-Speed Steptronic",
    bootSpace: "480L",
    hoistType: "Type A",
    bootHoistPdf: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF1.pdf",
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&q=80",
  },
  {
    id: 9,
    make: "Mercedes-Benz",
    model: "A-Class",
    year: "2021",
    variant: "A180 AMG Line Premium Plus",
    engine: "136ps Petrol",
    transmission: "7G-DCT Auto",
    bootSpace: "395L",
    hoistType: "Type B",
    bootHoistPdf: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF1.pdf",
    image:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&q=80",
  },
  {
    id: 10,
    make: "Audi",
    model: "A3",
    year: "2022",
    variant: "35 TFSI S Line 5dr S Tronic",
    engine: "150ps Petrol",
    transmission: "7-Speed S Tronic",
    bootSpace: "380L",
    hoistType: "Type C",
    bootHoistPdf: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF1.pdf",
    image:
      "https://images.unsplash.com/photo-1606220838315-056192d5e927?w=400&q=80",
  },
];

const LockIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const DocIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const ChevronLeft = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const SearchIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const CheckIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CarIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M5 17H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-1M5 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM19 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
    <path d="M3 9h18v6H3z" />
  </svg>
);

export default function App() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicleSearch, setVehicleSearch] = useState("");
  const [pdfView, setPdfView] = useState(null);

  const handleLogin = () => {
    const found = DEMO_USERS.find(
      (u) => u.email === loginEmail && u.password === loginPassword,
    );
    if (found) {
      setUser(found);
      setLoginError("");
      setScreen("product-select");
    } else {
      setLoginError("Invalid email or password.");
    }
  };

  const handleSignOut = () => {
    setUser(null);
    setScreen("login");
    setLoginEmail("");
    setLoginPassword("");
    setSelectedProduct(null);
    setSelectedVehicle(null);
    setVehicleSearch("");
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setSelectedVehicle(null);
    setVehicleSearch("");
    setScreen("vehicle-search");
  };

  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setScreen("vehicle-detail");
  };

  const handleBack = () => {
    if (screen === "vehicle-detail") {
      setSelectedVehicle(null);
      setScreen("vehicle-search");
    } else if (screen === "vehicle-search") {
      setSelectedProduct(null);
      setScreen("product-select");
    }
  };

  const filteredVehicles = VEHICLES.filter(
    (v) =>
      vehicleSearch === "" ||
      v.make.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
      v.model.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
      `${v.make} ${v.model}`
        .toLowerCase()
        .includes(vehicleSearch.toLowerCase()),
  );

  if (pdfView) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="flex items-center gap-3 px-5 py-3 bg-white border-b border-gray-200">
          <button
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors"
            onClick={() => setPdfView(null)}
          >
            <ChevronLeft /> Back
          </button>
          <span className="font-medium text-gray-900">
            {pdfView.make} {pdfView.model} &mdash; Installation Guide
          </span>
          <button
            className="ml-auto bg-[#006B2D] hover:bg-[#005824] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            onClick={() => window.open(pdfView.bootHoistPdf, "_blank")}
          >
            Download PDF
          </button>
        </div>
        <iframe
          src={pdfView.bootHoistPdf}
          className="flex-1 border-none w-full"
          style={{ minHeight: "calc(100vh - 56px)" }}
          title="Installation Guide"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 w-full max-w-sm">
          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#006B2D] flex items-center justify-center text-white mb-3">
              <LockIcon />
            </div>
            <h2 className="text-xl font-medium text-gray-900">JG Systems</h2>
            <p className="text-sm text-gray-500 mt-1">
              Sign in to your account
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <input
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#006B2D]"
              placeholder="Email address"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            <input
              type="password"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#006B2D]"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            {loginError && <p className="text-sm text-red-600">{loginError}</p>}
            <button
              className="w-full bg-[#006B2D] hover:bg-[#005824] text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
              onClick={handleLogin}
            >
              Sign in
            </button>
          </div>
          <div className="mt-5 p-3 bg-gray-50 rounded-lg text-xs text-gray-500 leading-5">
            <span className="font-medium text-gray-700">Demo accounts:</span>
            <br />
            admin@accessparts.co.uk / admin123
            <br />
            installer@garageone.co.uk / install123
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 flex items-center gap-4 h-14">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#006B2D] flex items-center justify-center text-white">
            <LockIcon />
          </div>
          <span className="font-medium text-gray-900">JG Systems</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-sm text-gray-500">{user.name}</span>
          <button
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors px-2 py-1"
            onClick={handleSignOut}
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="flex-1 px-6 py-6 max-w-4xl w-full mx-auto">
        {screen === "product-select" && (
          <div>
            <h1 className="text-xl font-medium text-gray-900 mb-2">
              Select product
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              Choose a product to view fitting instructions for your customer's
              vehicle.
            </p>
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              }}
            >
              {PRODUCTS.map((p) => (
                <button
                  key={p.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-start gap-2 hover:shadow-sm transition-shadow text-left"
                  onClick={() => handleSelectProduct(p)}
                >
                  <div className="w-10 h-10 rounded-lg bg-[#006B2D] flex items-center justify-center text-white">
                    <CarIcon />
                  </div>
                  <span className="font-medium text-gray-900 text-base">
                    {p.label}
                  </span>
                  <span className="text-sm text-gray-500">{p.description}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {screen === "vehicle-search" && (
          <div>
            <button
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4"
              onClick={handleBack}
            >
              <ChevronLeft /> Back
            </button>
            <h1 className="text-xl font-medium text-gray-900 mb-1">
              {selectedProduct?.label}
            </h1>
            <p className="text-sm text-gray-500 mb-5">
              Find your customer's vehicle to view fitting instructions.
            </p>
            <div className="relative mb-5">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <SearchIcon />
              </div>
              <input
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#006B2D] bg-white"
                placeholder="Search by make or model..."
                value={vehicleSearch}
                onChange={(e) => setVehicleSearch(e.target.value)}
              />
            </div>
            <div
              className="grid gap-3"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              }}
            >
              {filteredVehicles.map((v) => (
                <button
                  key={v.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4 items-center hover:shadow-sm transition-shadow text-left w-full"
                  onClick={() => handleSelectVehicle(v)}
                >
                  <img
                    src={v.image}
                    alt={`${v.make} ${v.model}`}
                    className="w-20 h-14 object-cover rounded-lg bg-gray-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm">
                      {v.make} {v.model}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {v.year} &middot; {v.variant}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {v.hoistType ? (
                      <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-[#F1C800] text-[#3D3500] font-medium">
                        <CheckIcon /> {v.hoistType}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 font-medium">
                        N/A
                      </span>
                    )}
                  </div>
                </button>
              ))}
              {filteredVehicles.length === 0 && (
                <p className="text-sm text-gray-400 col-span-full">
                  No vehicles found.
                </p>
              )}
            </div>
          </div>
        )}

        {screen === "vehicle-detail" && selectedVehicle && (
          <div>
            <button
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4"
              onClick={handleBack}
            >
              <ChevronLeft /> Back
            </button>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="h-48 bg-gray-100 overflow-hidden">
                <img
                  src={selectedVehicle.image}
                  alt={`${selectedVehicle.make} ${selectedVehicle.model}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-medium text-gray-900">
                      {selectedVehicle.make} {selectedVehicle.model}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedVehicle.year} &middot; {selectedVehicle.variant}
                    </p>
                  </div>
                  {selectedVehicle.hoistType ? (
                    <span className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-[#F1C800] text-[#3D3500] font-medium flex-shrink-0">
                      <CheckIcon /> {selectedVehicle.hoistType} Compatible
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-gray-100 text-gray-500 font-medium flex-shrink-0">
                      No Hoist Available
                    </span>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Vehicle specifications
                  </h3>
                  <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
                    <DetailRow label="Engine" value={selectedVehicle.engine} />
                    <DetailRow
                      label="Transmission"
                      value={selectedVehicle.transmission}
                    />
                    <DetailRow
                      label="Boot Space"
                      value={selectedVehicle.bootSpace}
                    />
                    {selectedVehicle.hoistType && (
                      <DetailRow
                        label="Hoist Type"
                        value={selectedVehicle.hoistType}
                      />
                    )}
                  </dl>
                </div>

                {selectedVehicle.hoistType && (
                  <div className="border-t border-gray-100 pt-4 mt-4 flex gap-3">
                    <button
                      className="flex-1 bg-[#006B2D] hover:bg-[#005824] text-white text-sm font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                      onClick={() => setPdfView(selectedVehicle)}
                    >
                      <DocIcon /> View Installation Guide
                    </button>
                    <button
                      className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                      onClick={() =>
                        window.open(selectedVehicle.bootHoistPdf, "_blank")
                      }
                    >
                      <DocIcon /> Download PDF
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <>
      <dt className="text-xs text-gray-400">{label}</dt>
      <dd className="text-sm text-gray-900 font-medium">{value}</dd>
    </>
  );
}
