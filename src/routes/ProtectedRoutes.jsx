// components/ProtectedRoutes.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { useFetchProfile } from "../hooks/fetchProfile";
import SideHeader from "../components/layout/SideHeader";

const dashboardMap = {
  admin: "/admin-dashboard",
  student: "/student-dashboard",
  staff: "/staff-dashboard",
};

const ProtectedRoutes = ({ children, allow = [], profiled = false, blockProfiled = false }) => {
  const navigate = useNavigate();
  const { token, loading: authLoading } = useAuth();
  const { userProfile, setUserProfile, userProfileLoading } = useData();
  const fetchProfile = useFetchProfile();

  const [hasRedirected, setHasRedirected] = useState(false);

  // Fetch profile when needed
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const cachedProfile = sessionStorage.getItem("userProfile");
        if (cachedProfile) {
          setUserProfile(JSON.parse(cachedProfile));
        } else {
          const profile = await fetchProfile();
          setUserProfile(profile);
          sessionStorage.setItem("userProfile", JSON.stringify(profile));
        }
      } catch (err) {
        console.error("Profile fetch failed:", err);
      }
    };

    if (token && !userProfile && !userProfileLoading) {
      loadProfile();
    }
  }, [token, userProfile, userProfileLoading, setUserProfile, fetchProfile]);

  // Redirection logic
  useEffect(() => {
    if (authLoading || hasRedirected) return;

    if (!token) {
      setHasRedirected(true);
      navigate("/login");
      return;
    }

    // Redirect users with profile away from login/register/etc
    if (blockProfiled && userProfile && token) {
      const role = userProfile?.role;
      if (role && dashboardMap[role]) {
        setHasRedirected(true);
        navigate(dashboardMap[role]);
        return;
      }
    }

    // Require profile to proceed
    if (profiled && !userProfileLoading && !userProfile) {
      setHasRedirected(true);
      navigate("/create-profile");
      return;
    }

    // Role-based restriction
    if (userProfile && allow.length > 0) {
      const userRole = userProfile.role;
      if (!allow.includes(userRole)) {
        toast.error("You are not authorized to access this route!");
        setHasRedirected(true);
        navigate("/unauthorized");
        return;
      }
    }
  }, [
    token,
    authLoading,
    userProfile,
    userProfileLoading,
    profiled,
    blockProfiled,
    allow,
    hasRedirected,
    navigate,
  ]);

  const readyToRender =
    !authLoading &&
    !userProfileLoading &&
    token &&
    (!profiled || (profiled && userProfile)) &&
    (allow.length === 0 || (userProfile && allow.includes(userProfile.role)));

  if (!readyToRender && !blockProfiled) return <div>Loading...</div>;

  return userProfile && !blockProfiled ? (
    <SideHeader role={userProfile.role}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </SideHeader>
  ) : (
    <>{children}</>
  );
};

export default ProtectedRoutes;
