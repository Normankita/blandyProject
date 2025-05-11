import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import SideHeader from "../components/layout/SideHeader";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const ProtectedRoutes = ({
  children,
  admin = false,
  student = false,
  supervisor = false,
  profiled = false,
}) => {
  const navigate = useNavigate();
  const { token, loading, user, logout } = useAuth();
  const { userProfile, setUserProfile, userProfileLoading, fetchSingleDoc } = useData();
  
  const [redirecting, setRedirecting] = useState(false);  // To prevent multiple redirects
  const roleRequired = useMemo(() => {
    if (admin) return "admin";
    if (student) return "student";
    if (supervisor) return "supervisor";
    return null;
  }, [admin, student, supervisor]);

  // Fetch profile if not cached in the local storage or somethng
  useEffect(() => {
    if (token && !userProfile && !userProfileLoading) {
      const cachedProfile = sessionStorage.getItem("userProfile");

      if (cachedProfile) {
        setUserProfile(JSON.parse(cachedProfile));  // Use cached profile
      } else {
        // If no cached profile, fetch it from the database
        fetchProfile();
      }
    }
  }, [token, userProfile, userProfileLoading, setUserProfile]);

  const fetchProfile = async () => {
    try {
      const userProfileFromDb = await fetchSingleDoc("users", user.uid);  // Adjust this to your DB query
      setUserProfile(userProfileFromDb);
      sessionStorage.setItem("userProfile", JSON.stringify(userProfileFromDb)); // Cache profile
    } catch (e) {
      toast.error("Error fetching user profile:", e);
      console.error("Error fetching user profile:", e);

    }
  };

  // Role check and redirect
  useEffect(() => {
    if (!loading && !token) {
      navigate("/login");
    } else if (token && !redirecting) {
      // If logged in, redirect to appropriate dashboard based on role
      if (userProfile) {
        const userRole = userProfile.role;
        if (!roleRequired && !redirecting) {
          setRedirecting(true);
          navigate(`/${userRole}-dashboard`);
        }
        if (roleRequired && userRole !== roleRequired) {
          toast.error("You are not authorized to access this route!");
          logout();
          navigate("/unauthorized");
        }
      }
    }

    // Handle profile creation for users without a profile
    if (!userProfileLoading && profiled && !userProfile) {
      navigate("/create-profile");
    }
  }, [loading, token, navigate, userProfile, roleRequired, redirecting, profiled, userProfileLoading]);

  const isReady =
    !loading &&
    profiled?token:true &&
    !userProfileLoading &&
    (!profiled || userProfile) &&
    (!roleRequired || userProfile?.role === roleRequired);

  if (!isReady) return <div>Loading...</div>;

  return userProfile ? (
    <SideHeader>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
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
