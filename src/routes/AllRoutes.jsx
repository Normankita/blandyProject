import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import pages from "@/pages";
import admin from "@/pages/admin";
import ProtectedRoutes from "./ProtectedRoutes";
import useTitle from "@/hooks/useTitle";

// New Modules
import VehicleList from "@/pages/vehicles/VehicleList";
import VehicleDetails from "@/pages/vehicles/VehicleDetails";
import PartsInventory from "@/pages/inventory/PartsInventory";

const AllRoutes = () => {
  const location = useLocation();
  useTitle();

  const { LoginPage, RegisterPage, PageNotFound, CreateProfile, UnAuthorized, Invoice, UpdateProfile } = pages;
  const { DashboardPage, RegisterAdmin, Users, UserProfile } = admin;

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* Auth routes */}
        <Route path="/login" element={<ProtectedRoutes blockProfiled><LoginPage /></ProtectedRoutes>} />
        <Route path="/register" element={<ProtectedRoutes blockProfiled><RegisterPage /></ProtectedRoutes>} />
        <Route path="/create-profile" element={<ProtectedRoutes blockProfiled><CreateProfile /></ProtectedRoutes>} />

        {/* Main Dashboard */}
        <Route path="/" element={<ProtectedRoutes allow={["admin", "staff"]} profiled><DashboardPage /></ProtectedRoutes>} />
        <Route path="/dashboard" element={<ProtectedRoutes allow={["admin", "staff"]} profiled><DashboardPage /></ProtectedRoutes>} />

        {/* Garage Modules */}
        <Route path="/vehicles" element={<ProtectedRoutes allow={["admin", "staff"]} profiled><VehicleList /></ProtectedRoutes>} />
        <Route path="/vehicles/:id" element={<ProtectedRoutes allow={["admin", "staff"]} profiled><VehicleDetails /></ProtectedRoutes>} />

        <Route path="/inventory" element={<ProtectedRoutes allow={["admin", "staff"]} profiled><PartsInventory /></ProtectedRoutes>} />

        {/* User Management */}
        <Route path="/users" element={<ProtectedRoutes allow={["admin"]} profiled><Users /></ProtectedRoutes>} />
        <Route path="/admin-register" element={<ProtectedRoutes allow={["admin"]} profiled><RegisterAdmin /></ProtectedRoutes>} />
        <Route path="/profile" element={<ProtectedRoutes allow={["admin", "staff"]} profiled><UserProfile /></ProtectedRoutes>} />
        <Route path="/update-profile" element={<ProtectedRoutes allow={["admin", "staff"]} profiled><UpdateProfile /></ProtectedRoutes>} />

        {/* Support */}
        <Route path="/invoice" element={<ProtectedRoutes allow={["admin", "staff"]} profiled><Invoice /></ProtectedRoutes>} />

        {/* Error & Default Routes */}
        <Route path="/unauthorized" element={<UnAuthorized />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

export default AllRoutes;
