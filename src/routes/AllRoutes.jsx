// components/AllRoutes.jsx
import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import pages from "@/pages";
import admin from "@/pages/admin";
import student from "@/pages/student";
import staff from "@/pages/supervisor";
import ProtectedRoutes from "./ProtectedRoutes";
import useTitle from "@/hooks/useTitle";
import coordinator from "@/pages/coordinator";

const AllRoutes = () => {
  const location = useLocation();
  useTitle();

  const { LoginPage, RegisterPage, PageNotFound, CreateProfile, UnAuthorized, Invoice } = pages;
  const { DashboardPage, Projects, RegisterAdmin, Users, UserProfile, SupervisionPage, DepartmentsPage } = admin;
  const { StudentDashboardPage, ProjectPage } = student;
  const { StaffDashboardPage, AssignedStudents } = staff;
  const {PanelManagementPage}= coordinator;

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<ProtectedRoutes blockProfiled><LoginPage /></ProtectedRoutes>} />
        <Route path="/login" element={<ProtectedRoutes blockProfiled><LoginPage /></ProtectedRoutes>} />
        <Route path="/register" element={<ProtectedRoutes blockProfiled><RegisterPage /></ProtectedRoutes>} />
        <Route path="/create-profile" element={<ProtectedRoutes blockProfiled><CreateProfile /></ProtectedRoutes>} />
        
        {/* Dashboards */}
        <Route path="/student-dashboard" element={<ProtectedRoutes allow={["student"]} profiled><StudentDashboardPage /></ProtectedRoutes>} />
        <Route path="/admin-dashboard" element={<ProtectedRoutes allow={["admin"]} profiled><DashboardPage /></ProtectedRoutes>} />
        <Route path="/departments" element={<ProtectedRoutes allow={["admin"]} profiled><DepartmentsPage /></ProtectedRoutes>} />
        <Route path="/staff-dashboard" element={<ProtectedRoutes allow={["staff"]} profiled><StaffDashboardPage /></ProtectedRoutes>} />
        <Route path="/panel-management" element={<ProtectedRoutes allow={["staff"]} profiled><PanelManagementPage /></ProtectedRoutes>} />
        <Route path="/assigned-students" element={<ProtectedRoutes allow={["staff"]} profiled><AssignedStudents /></ProtectedRoutes>} />
        <Route path="/supervision" element={<ProtectedRoutes allow={["staff"]} profiled><SupervisionPage /></ProtectedRoutes>} />
        {/* Functional Routes */}
        <Route path="/invoice" element={<ProtectedRoutes allow={["student", "staff", "admin"]} profiled><Invoice /></ProtectedRoutes>} />
        <Route path="/profile" element={<ProtectedRoutes allow={["student", "staff", "admin"]} profiled><UserProfile /></ProtectedRoutes>} />
        <Route path="/projects" element={<ProtectedRoutes allow={["admin", "staff"]} profiled><Projects /></ProtectedRoutes>} />
        <Route path="/admin-register" element={<ProtectedRoutes allow={["admin"]} profiled><RegisterAdmin /></ProtectedRoutes>} />
        <Route path="/student-projects" element={<ProtectedRoutes allow={["student"]} profiled><ProjectPage /></ProtectedRoutes>} />
        <Route path="/users" element={<ProtectedRoutes allow={["admin"]} profiled><Users /></ProtectedRoutes>} />

        {/* Error & Default Routes */}
        <Route path="/unauthorized" element={<UnAuthorized />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

export default AllRoutes;
