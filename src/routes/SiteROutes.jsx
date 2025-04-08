import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoutes = ({ children }) => {
  const legitUser = useSelector((state) => state.userState.isLoggedIn); 
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (legitUser) {
      setIsRedirecting(true); // Set loading state before redirecting
      navigate("/admin-dashboard");
    } 
  }, [legitUser, navigate]);

  if (isRedirecting) {
    return <div>Redirecting...</div>; // Optionally,  show a loading message or spinner
  }

  return (
    <div>
      {children}
    </div>
  );
};

export default ProtectedRoutes;
