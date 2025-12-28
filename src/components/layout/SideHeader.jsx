import { Link, NavLink, useLocation } from "react-router-dom";
import Goback from "../Goback";
import { auth, signOutUser } from "../../configs/firebase";
import { useState, useEffect } from "react";
import { useData } from "@/contexts/DataContext";
import Woman from "@/assets/avatars/woman.svg";
import Man from "@/assets/avatars/man.svg";

const SideHeader = ({ children, role }) => {
    const { userProfile, notifications } = useData();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [profile, setProfile] = useState(false);

    useEffect(() => {
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        setIsDarkMode(savedDarkMode);
        if (savedDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        if (!isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('darkMode', 'false');
        }
    };

    return (
        <div>
            <nav className="fixed top-0 z-40 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start rtl:justify-end">
                            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                                <span className="sr-only">Open sidebar</span>
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                                </svg>
                            </button>
                            <Link to="/" className="flex ms-2 md:me-24">
                                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                                    Garage Management System <small className="text-xs">({userProfile?.role})</small>
                                </span>
                            </Link>
                            <button onClick={toggleDarkMode} type="button" className="hidden sm:flex items-center p-2 text-sm text-gray-500 rounded-lg sm:ml-6 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                                {isDarkMode ? "🌙" : "☀️"}
                            </button>
                        </div>
                        <div className="flex items-center">
                            <div className="flex items-center ms-3">
                                <div>
                                    <button onClick={() => setProfile(!profile)} type="button" className="flex text-sm bg-gray-100 dark:bg-gray-900 rounded-full focus:ring-4 focus:ring-gray-500 dark:focus:ring-gray-500 md:mr-10 shadow-lg shadow-slate-900/20 dark:shadow-black/40 duration-300">
                                        <img className="w-10 h-10 rounded-full p-1 cursor-pointer" src={userProfile?.photoUrl || (userProfile?.gender === "female" ? Woman : Man)} alt="user" />
                                    </button>
                                </div>
                                <div className={`z-40 ${profile ? "block" : "hidden"} absolute top-16 right-4 w-44 rounded-lg shadow-xl bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-600`}>
                                    <div className="px-4 py-3">
                                        <p className="text-sm text-gray-900 dark:text-white">{userProfile?.name || "User"}</p>
                                        <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300">{userProfile?.email}</p>
                                    </div>
                                    <ul className="py-1">
                                        <li><NavLink to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600">Profile</NavLink></li>
                                        <li><button onClick={signOutUser} className="w-full block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 text-left">Sign out</button></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <aside className={`fixed top-0 left-0 z-30 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between`}>
                <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
                    <ul className="space-y-2 font-medium">
                        <li>
                            <NavLink to="/" className={({ isActive }) => `flex items-center p-2 rounded-lg group transition-colors duration-200 ${isActive ? "bg-gray-200 dark:bg-gray-700 font-bold" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
                                <span className="ms-3 dark:text-white">Dashboard</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/vehicles" className={({ isActive }) => `flex items-center p-2 rounded-lg group transition-colors duration-200 ${isActive ? "bg-gray-200 dark:bg-gray-700 font-bold" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
                                <span className="ms-3 dark:text-white">Vehicles</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/inventory" className={({ isActive }) => `flex items-center p-2 rounded-lg group transition-colors duration-200 ${isActive ? "bg-gray-200 dark:bg-gray-700 font-bold" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
                                <span className="ms-3 dark:text-white">Inventory</span>
                            </NavLink>
                        </li>

                        {userProfile?.role === "admin" && (
                            <li>
                                <NavLink to="/users" className={({ isActive }) => `flex items-center p-2 rounded-lg group transition-colors duration-200 ${isActive ? "bg-gray-200 dark:bg-gray-700 font-bold" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
                                    <span className="ms-3 dark:text-white">Users</span>
                                </NavLink>
                            </li>
                        )}

                        {userProfile?.role === "admin" && (
                            <li>
                                <NavLink to="/admin-register" className={({ isActive }) => `flex items-center p-2 rounded-lg group transition-colors duration-200 ${isActive ? "bg-gray-200 dark:bg-gray-700 font-bold" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
                                    <span className="ms-3 dark:text-white">Create User</span>
                                </NavLink>
                            </li>
                        )}

                        <li>
                            <NavLink to="/profile" className={({ isActive }) => `flex items-center p-2 rounded-lg group transition-colors duration-200 ${isActive ? "bg-gray-200 dark:bg-gray-700 font-bold" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
                                <span className="ms-3 dark:text-white">My Profile</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
                <div onClick={signOutUser} className="m-6 pb-4 p-4 flex flex-row justify-around text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded-lg">
                    <span className="ms-3 whitespace-nowrap dark:text-white">Sign Out</span>
                </div>
            </aside>

            <div onClick={() => setSidebarOpen(false)} className="md:pl-64 pt-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
                <Goback />
                {children}
            </div>
        </div>
    );
};

export default SideHeader;