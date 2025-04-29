import { useState } from "react";
import { setUser } from "../store/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { SiGoogle } from 'react-icons/si';
import { useAuth } from "../contexts/AuthContext";

const LoginPage = () => {
  const { login, user, loading, loginWithGoogle } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value.trim() });
  };

  const loginWithEmail = async (e) => {
    e.preventDefault();
    try {
      const { user } = await login(form.email, form.password);
      console.log("Logged in as:", user.email);
      navigate("/admin-dashboard");
    } catch (error) {
      console.error("Login error:", error.message);
    }
  };

  if (loading) return <p>Loading auth...</p>;

  const handleGoogleLogin = async () => {
    try {
      const { user, token } = await loginWithGoogle();
;

      navigate("/admin-dashboard");
    } catch (err) {
      console.error("Google login failed:", err.message);
    }
  };


  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen min-w-screen max-w-screen max-h-screen">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">

          MZUMBE ACADEMIC PORTAL
        </a>
        <div className="w-full bg-white rounded-lg dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 shadow-xl shadow-slate-900/10 dark:shadow-black/40">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={loginWithEmail} >
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                <input type="email" name="email" id="email" value={form.email}
                  onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input type="password" value={form.password}
                  onChange={handleChange} name="password" id="password" placeholder="••••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                  </div>
                </div>
                <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
              </div>
              <button type="submit" className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 cursor-pointer shadow"> Sign in</button>
             

              
            </form>
            <button onClick={handleGoogleLogin} className="flex items-center space-x-2 bg-red-50 border-0 text-black border px-4 py-2 rounded cursor-pointer shadow">
                <SiGoogle className="text-red-500 text-xl" />
                <span>Sign in with Google</span>
              </button> 
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet? <Link to="/register" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</Link>
              </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;