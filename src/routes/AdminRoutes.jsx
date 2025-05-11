import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext"; // adjust path if needed
import { toast } from "react-toastify";

const AdminRoutes = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [userIsAdmin, setUserIsAdmin]= useState(true)
  const [profileExists, setProfileExists] = useState(false);
  const { fetchSingleDoc } = useData();

  useEffect(() => {
    const checkUserIsAdmin = async (user)=>{
        if(user.role!=="Admin"){
          setUserIsAdmin(false)
            toast.error("Oops, you are not authorized to access this route!")
            navigate('/login')
        }
    }
    const checkUserProfile = async () => {
      if (!user) {
        navigate("/login"); // fail-safe: shouldn't happen if wrapped in ProtectedRoutes
        return;
      }

      try {
        const userDoc = await fetchSingleDoc("users", user.uid);
        if (userDoc) {
          setProfileExists(true);
          checkUserIsAdmin(userDoc);
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

  if(!userIsAdmin) return null; //prevents flashing content during redirect
  return children;
};

export default AdminRoutes;
