import { useState } from "react";

import { DEMO_USERS } from "./data/users";
import { VEHICLES } from "./data/vehicles";

import LoginForm from "./components/authentication/LoginForm";
import RequestAccessForm from "./components/authentication/RequestAccessForm";

import Header from "./components/Header";

import VehicleList from "./components/VehicleList";
import VehicleDetail from "./components/VehicleDetail";
import VehicleSearch, { BackButton } from "./components/VehicleSearch";
import PdfViewer from "./components/PdfViewer";
import ProductSelect from "./components/ProductSelect";

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
      <main className="flex-1 px-6 py-6 max-w-4xl w-full mx-auto">
        {screen === "product-select" && (
          <ProductSelect onSelect={handleSelectProduct} />
        )}

        {screen === "vehicle-search" && (
          <div>
            <BackButton onClick={handleBack} />
            <h1 className="text-xl font-medium text-gray-900 mb-1">
              {selectedProduct?.label}
            </h1>
            <p className="text-sm text-gray-500 mb-5">
              Find your customer&apos;s vehicle to view fitting instructions.
            </p>
            <VehicleSearch search={vehicleSearch} onSearch={setVehicleSearch} />
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
            <BackButton onClick={handleBack} />
            <VehicleDetail
              vehicle={selectedVehicle}
              onViewPdf={() => setPdfView(selectedVehicle)}
              onDownloadPdf={async () => {
                const response = await fetch(selectedVehicle.bootHoistPdf);
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${selectedVehicle.make}_${selectedVehicle.model}_Installation_Guide.pdf`;
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
