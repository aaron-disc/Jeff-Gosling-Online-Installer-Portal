import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import { VehiclesProvider } from "./context/VehiclesContext";
import ProtectedLayout from "./components/layout/ProtectedLayout";
import LoginScreen from "./components/screens/LoginScreen";
import ProductSelect from "./components/products/ProductSelect";
import VehicleSearchScreen from "./components/screens/VehicleSearchScreen";
import VehicleDetailScreen from "./components/screens/VehicleDetailScreen";
import UploadDataSceen from "./components/screens/UploadDataScreen";
import HandleUsersScreen from "./components/screens/HandleUsersScreen";
import ProfileScreen from "./components/screens/ProfileScreen";
import PdfViewer from "./components/shared/PdfViewer";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <VehiclesProvider>
            <Routes>
              <Route path="/login" element={<LoginScreen />} />
              <Route element={<ProtectedLayout />}>
                <Route path="/products" element={<ProductSelect />} />
                <Route path="/vehicles" element={<VehicleSearchScreen />} />
                <Route
                  path="/vehicles/:vehicleId"
                  element={<VehicleDetailScreen />}
                />
                <Route path="/upload-data" element={ <UploadDataSceen/> } />
                <Route path="/handle-users" element={<HandleUsersScreen />} />
                <Route path="/profile" element={<ProfileScreen />} />
              </Route>
              <Route path="/vehicles/:vehicleId/pdf" element={<PdfViewer />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </VehiclesProvider>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
