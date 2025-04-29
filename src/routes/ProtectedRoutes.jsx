import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import SideHeader from "../components/layout/SideHeader";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";

const ProtectedRoutes = ({ children }) => {
  const navigate = useNavigate();
  const { token, loading } = useAuth();

  useEffect(() => {
    if (!loading && !token) {
      // Redirect to login if user is not logged in
      navigate("/login");
    }
  }, [token, loading, navigate]); // Depend on token and loading, so effect runs when either changes

  // Don't render anything while loading, or if the user isn't logged in
  if (loading) return <div>Loading...</div>;
  if (!token) return null; // Prevent rendering children if user is not logged in

  return (
    <>
      <SideHeader>
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: "100%" }}
        exit={{ opacity: 0 }}
        transition={{ type: "tween", duration: 0.5 }}
        >
          {children}
        </motion.div>
      </SideHeader>
    </>
  );
};

export default ProtectedRoutes;
