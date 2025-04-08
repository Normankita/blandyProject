import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ProtectedRoutes = ({ children }) => {
  const legitUser = useSelector((state) => state.userState.isLoggedIn);
  const isSidenavOpen = useSelector((state) => state.sidenavState.isSidenavOpen);
  const navigate = useNavigate();

  useEffect(() => {
    if (!legitUser) {
      // Redirect to login if user is not logged in
      navigate("/login");
    }
  }, [legitUser, navigate]); // Depend on legitUser, so the effect runs when the login state changes

  // Only render the children if the user is logged in
  if (!legitUser) {
    return null; // Prevent rendering children if user is not logged in
  }

  return (
    <div className={`pt-20 ${isSidenavOpen ? `px-4 lg:pl-70 ` : `px-4 lg:px-7`} min-h-screen max-h-screen bg-gray-200 dark:bg-gray-900 overflow-y-auto duration-300`}>
            {children}
    </div>
  );
};

export default ProtectedRoutes;
