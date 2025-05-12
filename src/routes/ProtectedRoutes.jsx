// components/ProtectedRoutes.js
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { useFetchProfile } from "../hooks/fetchProfile";// Import custom hook
import SideHeader from "../components/layout/SideHeader";

const ProtectedRoutes = ({
  children,
  admin = false,
  student = false,
  staff = false,
  profiled = false,
}) => {
  const navigate = useNavigate();
  const { token, loading} = useAuth();
  const { userProfile, setUserProfile, userProfileLoading } = useData();
  const fetchProfile = useFetchProfile(); // Get the fetchProfile function from the custom hook

  const [redirecting, setRedirecting] = useState(false); // Stops multiple redirects from happening
  const roleRequired = useMemo(() => {
    // Figure out what role is needed for this route
    if (admin) return "admin";
    if (student) return "student";
    if (staff) return "staff";
    return null; // No specific role required
  }, [admin, student, staff]);

  // Check if we already have the user's profile cached, if not, fetch it
  useEffect(() => {
    if (token && !userProfile && !userProfileLoading) {
      const cachedProfile = sessionStorage.getItem("userProfile");

      if (cachedProfile) {
        setUserProfile(JSON.parse(cachedProfile));
      } else {
        const MAX_RETRIES = 2;
        let attempt = 0;

        const fetchWithRetry = async () => {
          while (attempt < MAX_RETRIES) {
            try {
              const profile = await fetchProfile(); // Fetch the profile using the custom hook
              setUserProfile(profile);
              sessionStorage.setItem("userProfile", JSON.stringify(profile));
              break; // Success, break the loop
            } catch (err) {
              console.error(`Profile fetch failed (attempt ${attempt + 1}):`, err);
              attempt += 1;

              if (attempt >= MAX_RETRIES) {
                console.error("Max retries reached. Could not fetch user profile.");
                // Optionally show a fallback or redirect to login
              }
            }
          }
        };

        fetchWithRetry();
      }
    }
  }, [token, userProfile, userProfileLoading, setUserProfile, fetchProfile]);

  // Handle role checks and redirects
  useEffect(() => {
    if (!loading && !token) {
      // If you're not logged in, go to the login page
      navigate("/login");
    } else if (token && !redirecting) {
      // If you're logged in, let's figure out where you should go
      if (userProfile) {
        const userRole = userProfile.role; // Grab the user's role
        if (!roleRequired && !redirecting) {
          // No specific role required? Just send them to their dashboard
          setRedirecting(true);
          navigate(`/${userRole}-dashboard`);
        }
        if (roleRequired && userRole !== roleRequired) {
          // If the user's role doesn't match the required role, kick them out
          toast.error("You are not authorized to access this route!");
          navigate("/unauthorized"); // Send them to the unauthorized page
        }
      }
    }

    // If the route requires a profile and the user doesn't have one, send them to create it
    if (!userProfileLoading && profiled && !userProfile) {
      navigate("/create-profile");
    }
  }, [loading, token, navigate, userProfile, roleRequired, redirecting, profiled, userProfileLoading]);

  // Check if everything is ready for the user to access the route
  const isReady =
    !loading && // Not loading auth state
    (profiled ? token : true) && // If profile is required, make sure they're logged in
    !userProfileLoading && // Not loading the user profile
    (!profiled || userProfile) && // If profile is required, make sure we have it
    (!roleRequired || userProfile?.role === roleRequired); // If a role is required, make sure it matches

  if (!isReady) return <div>Loading...</div>; // If not ready, show a loading screen

  // If everything checks out, render the children with the layout
  return userProfile ? (
    <SideHeader role={userProfile.role}>
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
