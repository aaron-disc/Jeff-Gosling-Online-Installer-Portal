import { useState } from "react";

import { DEMO_USERS } from "./data/users";
import { VEHICLES } from "./data/vehicles";

import LoginForm from "./components/authentication/LoginForm";
import RequestAccessForm from "./components/authentication/RequestAccessForm";

import Header from "./components/Header";

import { BackButton } from "./components/BackButon";
import VehicleList from "./components/VehicleList";
import VehicleDetail from "./components/VehicleDetail";
import PdfViewer from "./components/PdfViewer";
import ProductSelect from "./components/ProductSelect";
import VehicleFilterPopup from "./components/VehicleFilterPopup";

import loginBg from "./images/Login.png";

export default function App() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [requestFirstName, setRequestFirstName] = useState("");
  const [requestSurname, setRequestSurname] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicleFilters, setVehicleFilters] = useState({
    manufacturer: "",
    model: "",
    maxVehicleLoad: 1000,
  });
  const [filterPopupOpen, setFilterPopupOpen] = useState(false);
  const [filterPopupKey, setFilterPopupKey] = useState(0);
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

  const handleRequestAccess = () => {
    setScreen("request-access");
    setLoginEmail("");
    setLoginPassword("");
    setLoginError("");
  };

  const handleBackToLogin = () => {
    setScreen("login");
    setRequestFirstName("");
    setRequestSurname("");
  };

  const handleSignOut = () => {
    setUser(null);
    setScreen("login");
    setLoginEmail("");
    setLoginPassword("");
    setSelectedProduct(null);
    setSelectedVehicle(null);
    setVehicleFilters({ manufacturer: "", model: "", maxVehicleLoad: 1000 });
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setSelectedVehicle(null);
    setVehicleFilters({ manufacturer: "", model: "", maxVehicleLoad: 1000 });
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
      (!vehicleFilters.manufacturer ||
        v.manufacturer === vehicleFilters.manufacturer) &&
      (!vehicleFilters.model || v.model === vehicleFilters.model) &&
      (!v.maxVehicleLoad ||
        Number(v.maxVehicleLoad) <= vehicleFilters.maxVehicleLoad),
  );

  if (pdfView) {
    return <PdfViewer vehicle={pdfView} onBack={() => setPdfView(null)} />;
  }

  if (!user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${loginBg})` }}
      >
        {screen === "request-access" ? (
          <RequestAccessForm
            firstName={requestFirstName}
            setFirstName={setRequestFirstName}
            surname={requestSurname}
            setSurname={setRequestSurname}
            onBack={handleBackToLogin}
          />
        ) : (
          <LoginForm
            email={loginEmail}
            setEmail={setLoginEmail}
            password={loginPassword}
            setPassword={setLoginPassword}
            error={loginError}
            onSubmit={handleLogin}
            onRequestAccess={handleRequestAccess}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header user={user} onSignOut={handleSignOut} />
      <main className="flex-1 px-6 py-6 max-w-7xl w-full mx-auto">
        {screen === "product-select" && (
          <ProductSelect onSelect={handleSelectProduct} />
        )}

        {screen === "vehicle-search" && (
          <div>
            <BackButton onClick={handleBack} style="mb-4" />
            <div className="min-[1280px]:flex min-[1280px]:items-start min-[1280px]:justify-between min-[1280px]:gap-6 mb-5">
              <div className="min-[1280px]:flex-1">
                <h1 className="text-xl font-medium text-gray-900 mb-1">
                  {selectedProduct?.label}
                </h1>
                <p className="text-sm text-gray-500">
                  Find your customer&apos;s vehicle to view fitting instructions.
                </p>
              </div>
              <div className="xl:w-160 xl:pt-0 pt-4">
                <VehicleFilterPopup
                  key={filterPopupKey}
                  isOpen={filterPopupOpen}
                  onClose={() => setFilterPopupOpen(false)}
                  filters={vehicleFilters}
                  onFilterChange={setVehicleFilters}
                  vehicles={VEHICLES}
                />

                <button
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-left flex items-center justify-between cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    setFilterPopupOpen(true);
                    setFilterPopupKey((k) => k + 1);
                  }}
                >
                  <span
                    className={
                      vehicleFilters.manufacturer ||
                      vehicleFilters.model ||
                      vehicleFilters.maxVehicleLoad < 1000
                        ? "text-[#006B2D] font-medium"
                        : "text-gray-600"
                    }
                  >
                    Filter vehicles
                  </span>
                  <div className="flex items-center gap-2">
                    {(vehicleFilters.manufacturer ||
                      vehicleFilters.model ||
                      vehicleFilters.maxVehicleLoad < 1000) && (
                      <span className="bg-[#006B2D] text-white text-xs px-1.5 py-0.5 rounded">
                        {[
                          vehicleFilters.manufacturer,
                          vehicleFilters.model,
                          vehicleFilters.maxVehicleLoad < 1000,
                        ].filter(Boolean).length}
                      </span>
                    )}
                    <span className="text-gray-400">↓</span>
                  </div>
                </button>
              </div>
            </div>

            {filteredVehicles.length > 0 ? (
              <VehicleList
                vehicles={filteredVehicles}
                onSelect={handleSelectVehicle}
              />
            ) : (
              <p className="text-sm text-gray-400">No vehicles found.</p>
            )}
          </div>
        )}

        {screen === "vehicle-detail" && selectedVehicle && (
          <div>
            <BackButton onClick={handleBack} style="mb-4" />
            <VehicleDetail
              vehicle={selectedVehicle}
              onViewPdf={() => setPdfView(selectedVehicle)}
              onDownloadPdf={async () => {
                const response = await fetch(selectedVehicle.bootHoistPdf);
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);

                const a = document.createElement("a");
                a.href = url;
                a.download = `${selectedVehicle.manufacturer}_${selectedVehicle.model}_Installation_Guide.pdf`;

                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                URL.revokeObjectURL(url);
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
}
