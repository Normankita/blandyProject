import { useState } from "react";
import { useData } from "../contexts/DataContext";
import { Link, useNavigate } from "react-router-dom";
import { SiGoogle } from 'react-icons/si';
import { useAuth } from "../contexts/AuthContext";
import SiteButton from "../components/SiteButton";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ProjectTitle from "@/components/ProjectTitle";

const LoginPage = () => {
  const { fetchSingleDoc } = useData();
  const { login, loading, loginWithGoogle, logout } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const checkUserExistsInUsersTable = async (userId) => {
    fetchSingleDoc("users", userId)
      .then((userDoc) => {

        if (userDoc) {
          if (userDoc.status === "pending") {
            toast.info("Account not verified yet, consult admin to activate your account!");
            logout();
            return;
          }
          if (userDoc.role) {
            toast.success(`👍 welcome back ${userDoc.name.split(' ')[0]}`)
            navigate(`/${userDoc.role}-dashboard`);
            return true;
          } else {
            alert("user has no role");
            return false;
          }
        } else {
          navigate("/create-profile");
          return false;
        }
      }
      )
      .catch((error) => {
        alert("Error checking user in users table:", error);
        return false;
      }
      );
    // addData
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value.trim() });
  };

  const loginWithEmail = async (e) => {
    e.preventDefault();
    try {
      const { user } = await login(form.email, form.password);
      const userId = user.uid;
      checkUserExistsInUsersTable(userId);
    } catch (error) {
      toast.error(`Login error: ${error.message}`);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { user, token } = await loginWithGoogle();
      const userId = user.uid;
      checkUserExistsInUsersTable(userId);
    } catch (err) {
      toast.error(`Google login failed:${err.message}`);
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: "100%" }}
      exit={{ opacity: 0 }}
      transition={{ type: "tween", duration: 0.5 }}
    >
      <section className="bg-slate-200 dark:bg-gray-900 min-h-screen min-w-screen max-w-screen max-h-screen">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <ProjectTitle/>
          <div className="w-full md:mt-0 sm:max-w-md xl:p-0 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-950 p-6 rounded-sm dark:text-gray-300 text-gray-800 duration-300 shadow-lg shadow-slate-900/10 dark:shadow-black/40 border">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white flex flex-col items-center w-full">
                Sign in
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={loginWithEmail} >
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"> Email</label>
                  <input type="email" name="email" id="email" value={form.email}
                    onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-700 font-bold rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-yellow-500 dark:focus:border-yellow-500 " required />
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                  <input type="password" value={form.password}
                    onChange={handleChange} name="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-700 font-bold rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-yellow-500 dark:focus:border-yellow-500 mb-15" required />
                </div>
                <div className="px-6">
                  <SiteButton text={"Sign in"} loadText="Authenticating..." loading={loading} />
                </div>
              </form>
              <button onClick={handleGoogleLogin} className={`text-gray-900 bg-red-200/40 border  focus:outline-none focus:ring-4 font-bold rounded-full text-sm px-4 py-1.5 me-2 dark:bg-slate-900 dark:text-white  dark:hover:bg-slate-950 shadow-lg shadow-slate-900/10 dark:shadow-black/40 flex flex-row gap-1 items-center dark:focus:ring-red-700 dark:hover:border-red-600 dark:border-red-600 hover:bg-red-100 border-red-300 focus:ring-red-100 ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`} disabled={loading}>
                <SiGoogle className="text-red-600 text-xl" />
                <span>Sign in with Google</span>
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet? <Link to="/register" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </motion.div>

  );
};

export default LoginPage;