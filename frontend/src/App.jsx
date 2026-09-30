import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import ProtectedLayout from "./components/layout/ProtectedLayout";
import LoginScreen from "./components/screens/LoginScreen";
import RequestAccessScreen from "./components/screens/RequestAccessScreen";
import ProductSelect from "./components/products/ProductSelect";
import VehicleSearchScreen from "./components/screens/VehicleSearchScreen";
import VehicleDetailScreen from "./components/screens/VehicleDetailScreen";
import HandleUsersScreen from "./components/screens/HandleUsersScreen";
import PdfViewer from "./components/shared/PdfViewer";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/request-access" element={<RequestAccessScreen />} />
            <Route element={<ProtectedLayout />}>
              <Route path="/products" element={<ProductSelect />} />
              <Route path="/vehicles" element={<VehicleSearchScreen />} />
              <Route
                path="/vehicles/:vehicleId"
                element={<VehicleDetailScreen />}
              />
              <Route path="/handle-users" element={<HandleUsersScreen />} />
            </Route>
            <Route path="/vehicles/:vehicleId/pdf" element={<PdfViewer />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
