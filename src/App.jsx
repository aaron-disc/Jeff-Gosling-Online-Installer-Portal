import { useState } from "react";
import { DEMO_USERS } from "./data/users";
import { PRODUCTS } from "./data/products";
import { VEHICLES } from "./data/vehicles";
import LoginForm from "./components/LoginForm";
import Header from "./components/Header";
import { ProductCard } from "./components/Header";
import VehicleList from "./components/VehicleList";
import VehicleDetail from "./components/VehicleDetail";
import VehicleSearch, { BackButton } from "./components/VehicleSearch";
import PdfViewer from "./components/PdfViewer";

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
      `${v.make} ${v.model}`.toLowerCase().includes(vehicleSearch.toLowerCase()),
  );

  if (pdfView) {
    return <PdfViewer vehicle={pdfView} onBack={() => setPdfView(null)} />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoginForm
          email={loginEmail}
          setEmail={setLoginEmail}
          password={loginPassword}
          setPassword={setLoginPassword}
          error={loginError}
          onSubmit={handleLogin}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header user={user} onSignOut={handleSignOut} />

      <main className="flex-1 px-6 py-6 max-w-4xl w-full mx-auto">
        {screen === "product-select" && (
          <div>
            <h1 className="text-xl font-medium text-gray-900 mb-2">
              Select product
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              Choose a product to view fitting instructions for your customer&apos;s
              vehicle.
            </p>
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}
            >
              {PRODUCTS.map((p) => (
                <ProductCard key={p.id} product={p} onSelect={handleSelectProduct} />
              ))}
            </div>
          </div>
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
            <VehicleSearch
              search={vehicleSearch}
              onSearch={setVehicleSearch}
            />
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
              onDownloadPdf={() => window.open(selectedVehicle.bootHoistPdf, "_blank")}
            />
          </div>
        )}
      </main>
    </div>
  );
}