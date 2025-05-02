import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import SideHeader from "../components/layout/SideHeader";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { motion } from "framer-motion";

const ProtectedRoutes = ({ children }) => {
  const navigate = useNavigate();
  const { token, loading } = useAuth();
  const { userProfile, userProfileLoading } = useData();

  useEffect(() => {
    if (!loading && !token) {
      navigate("/login");
    }
  }, [token, loading, navigate]);

  if (loading || userProfileLoading) return <div>Loading...</div>;
  if (!token) return null;

  const hasProfile = !!userProfile;

  return hasProfile ? (
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
  ) : (
    <>{children}</>
  );
};

export default ProtectedRoutes;
