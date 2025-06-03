import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { useFetchProfile } from "@/hooks/fetchProfile";
import SideHeader from "@/components/layout/SideHeader";
import Loading from "@/components/layout/Loading";

const FullPageLoader = () => <Loading/>;

const dashboardMap = {
  admin: "/admin-dashboard",
  student: "/student-dashboard",
  staff: "/staff-dashboard",
};

const useAccessControl = ({
  token,
  authLoading,
  userProfile,
  userProfileLoading,
  profiled,
  blockProfiled,
  allow,
  logout,
}) => {
  const navigate = useNavigate();
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    if (authLoading || redirected) return;

    // No token
    if (!token) {
      if (blockProfiled) return;
      setRedirected(true);
      navigate("/login");
      return;
    }

    // Check user status
    if (userProfile?.status === "inactive") {
      toast.info("Your account is deactivated. Please contact the administrator.");
      logout();
      setRedirected(true);
      return;
    }

    if (userProfile?.status === "pending") {
      toast.info("Your account is pending approval. Please wait for admin verification.");
      logout();
      setRedirected(true);
      return;
    }

    // If blocked and already profiled, redirect to dashboard
    if (blockProfiled && userProfile) {
      const role = userProfile?.role;
      if (role && dashboardMap[role]) {
        setRedirected(true);
        navigate(dashboardMap[role]);
        return;
      }
    }

    // If profiled required but no profile
    if (profiled && !userProfileLoading && !userProfile) {
      setRedirected(true);
      navigate("/create-profile");
      return;
    }

    // If role is not allowed
    if (userProfile && allow.length > 0) {
      const userRole = userProfile.role;
      if (!allow.includes(userRole)) {
        toast.error("You are not authorized to access this route!");
        setRedirected(true);
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
    redirected,
    navigate,
    logout,
  ]);

  const ready =
    !authLoading &&
    !userProfileLoading &&
    token &&
    (!profiled || (profiled && userProfile)) &&
    (allow.length === 0 || (userProfile && allow.includes(userProfile.role)));

  return { ready };
};

const ProtectedRoutes = ({ children, allow = [], profiled = false, blockProfiled = false }) => {
  const { token, loading: authLoading, logout } = useAuth();
  const { userProfile, setUserProfile, userProfileLoading } = useData();
  const fetchProfile = useFetchProfile();

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

  const { ready } = useAccessControl({
    token,
    authLoading,
    userProfile,
    userProfileLoading,
    profiled,
    blockProfiled,
    allow,
    logout,
  });

  if (!ready && !blockProfiled) return <FullPageLoader />;

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
