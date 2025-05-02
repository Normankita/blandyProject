import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext"; // adjust path if needed

const ProfiledRoutes = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [profileExists, setProfileExists] = useState(false);
  const { fetchSingleDoc } = useData();

  useEffect(() => {
    const checkUserProfile = async () => {
      if (!user) {
        navigate("/login"); // fail-safe: shouldn't happen if wrapped in ProtectedRoutes
        return;
      }

      try {
        const userDoc = await fetchSingleDoc("users", user.uid);
        if (userDoc) {
          setProfileExists(true);
        } else {
          navigate("/create-profile");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        navigate("/login");
      } finally {
        setCheckingProfile(false);
      }
    };

    checkUserProfile();
  }, [user, navigate]);

  if (checkingProfile) return <div>Loading profile...</div>;
  if (!profileExists) return null; // prevents flashing content during redirect

  return children;
};

export default ProfiledRoutes;
