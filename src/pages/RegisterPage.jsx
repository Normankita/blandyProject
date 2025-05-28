import { useState } from "react";
import { auth } from '../configs/firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";
import SiteButton from "../components/SiteButton";


const RegisterPage = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [userForm, setUserForm] = useState({
        email: "",
        password: "",
        rePassword: "",
        acceptTerms: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserForm({
            ...userForm,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userForm.email)) {
            setError("Please enter a valid email address.");
            setLoading(false);
            return;
        }

        if (userForm.password !== userForm.rePassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }
        try {
            const res = await createUserWithEmailAndPassword(auth, userForm.email, userForm.password);
            const token = await res.user.getIdToken();

            dispatch(setUser({
                userState: {
                    uid: res.user.uid,
                    email: res.user.email,
                    displayName: res.user.displayName,
                    photoURL: res.user.photoURL,
                },
                token: token,
            }));

            navigate("/create-profile"); // redirect on success
        }
        catch (err) {
            if (err.code === "auth/email-already-in-use") {
                setError("This email is already in use.");
            } else if (err.code === "auth/weak-password") {
                setError("Password should be at least 6 characters.");
            } else {
                setError("An error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <section className="bg-slate-200 dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <a href="#" className="flex flex-col items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                    <span><img src="/sitelogo.png" alt="" /></span>
                    <span>MZUMBE ACADEMIC PORTAL</span>
                    </a>
                    {error && <p className="text-red-500">{error}</p>}
                    <div className="w-full bg-white rounded-lg dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 shadow-xl shadow-slate-900/10 dark:shadow-black/40 duration-300">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white flex flex-col items-center">
                                Create an account
                            </h1>
                            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        onChange={handleChange}
                                        value={userForm.email}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                                </div>
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                    
                                        onChange={handleChange}
                                        value={userForm.password}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                                </div>
                                <div>
                                    <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                                    <input
                                        type="password"
                                        name="rePassword"
                                        id="confirm-password"
                                    
                                        onChange={handleChange}
                                        value={userForm.rePassword}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                                </div>
                               
                                <SiteButton text={"Sign Up"} loadText="Creating account..." loading={loading}/>
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Already have an account? <Link to="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default RegisterPage;