import { Link, NavLink, useLocation } from "react-router-dom";
import Goback from "../Goback";
import { auth, signOutUser } from "../../configs/firebase";
import { useState, useEffect } from "react";
import { useData } from "@/contexts/DataContext";
import Woman from "@/assets/avatars/woman.svg";
import Man from "@/assets/avatars/man.svg";

const SideHeader = ({ children, role }) => {
    const { userProfile } = useData();

    const [isMou, setIsMou] = useState(false);

    const pathname = useLocation().pathname;
    useEffect(() => {
        if (pathname.match(/\/mou\b/)) {
            setIsMou(true);
        } else {
            setIsMou(false);
        }
    }, [pathname]);

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [isDarkMode, setIsDarkMode] = useState(true);
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


    const [profile, setProfile] = useState(false);

    return (
        <div>


            <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start rtl:justify-end">
                            {/* hide and show sidenav on mobile */}

                            <button onClick={() => setSidebarOpen(!sidebarOpen)} data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                                <span className="sr-only">Open sidebar</span>
                                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                                </svg>
                            </button>
                            <Link to="/" className="flex ms-2 md:me-24">
                                <img src="/sitelogo.png" className="h-8 me-3" alt="FlowBite Logo" />
                                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">Mzumber Academic Portal</span>
                            </Link>
                            <button onClick={toggleDarkMode} type="button" className="hidden sm:flex items-center p-2 text-sm text-gray-500 rounded-lg sm:ml-6 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                                <span>
                                    {isDarkMode ? (<svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M13 3a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0V3ZM6.343 4.929A1 1 0 0 0 4.93 6.343l1.414 1.414a1 1 0 0 0 1.414-1.414L6.343 4.929Zm12.728 1.414a1 1 0 0 0-1.414-1.414l-1.414 1.414a1 1 0 0 0 1.414 1.414l1.414-1.414ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm-9 4a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2H3Zm16 0a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2h-2ZM7.757 17.657a1 1 0 1 0-1.414-1.414l-1.414 1.414a1 1 0 1 0 1.414 1.414l1.414-1.414Zm9.9-1.414a1 1 0 0 0-1.414 1.414l1.414 1.414a1 1 0 0 0 1.414-1.414l-1.414-1.414ZM13 19a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0v-2Z" clipRule="evenodd" />
                                    </svg>) : (<svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M11.675 2.015a.998.998 0 0 0-.403.011C6.09 2.4 2 6.722 2 12c0 5.523 4.477 10 10 10 4.356 0 8.058-2.784 9.43-6.667a1 1 0 0 0-1.02-1.33c-.08.006-.105.005-.127.005h-.001l-.028-.002A5.227 5.227 0 0 0 20 14a8 8 0 0 1-8-8c0-.952.121-1.752.404-2.558a.996.996 0 0 0 .096-.428V3a1 1 0 0 0-.825-.985Z" clipRule="evenodd" />
                                    </svg>)}
                                </span>
                            </button>
                        </div>
                        <div className="flex items-center">
                            <div className="flex items-center ms-3">
                                <div>
                                    {/* activate profile options */}
                                    <button onClick={() => setProfile(!profile)} type="button" className="flex text-sm bg-gray-100 dark:bg-gray-900 rounded-full focus:ring-4 focus:ring-gray-500 dark:focus:ring-gray-500 md:mr-10 shadow-lg shadow-slate-900/20 dark:shadow-black/40 duration-300" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="dropdown-user">
                                        <span className="sr-only">Open user menu</span>
                                        <img className="w-10 h-10 rounded-full p-1  cursor-pointer" src={auth.currentUser.photoURL ? auth.currentUser.photoURL : userProfile.photoUrl ? userProfile.photoUrl : userProfile.gender === "female" ? Woman : Man} alt="user photo" />
                                    </button>
                                </div>
                                {/* Profile options */}
                                <div className={`z-50 ${profile ? "block" : "hidden"} absolute top-16 right-4 w-44 rounded-lg shadow-xl bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-600`} id="dropdown-user" role="menu" aria-orientation="vertical" aria-labelledby="dropdown-user">
                                    <div className="px-4 py-3" role="none">
                                        <p className="text-sm text-gray-900 dark:text-white" role="none">
                                            {`${auth.currentUser.displayName ? auth.currentUser.displayName : `User Account`}`}
                                        </p>
                                        <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">
                                            {auth.currentUser.email}
                                        </p>
                                    </div>
                                    <ul className="py-1" role="none">
                                        <li>
                                            <NavLink to={`/${role}-dashboard`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Dashboard</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Settings</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Profile</NavLink>
                                        </li>
                                        <li>
                                            <button onClick={signOutUser} className="w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">
                                                sign out
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <aside id="logo-sidebar" className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200
  ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
  md:translate-x-0
  dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between`}
                aria-label="Sidebar">
                <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
                    <ul className="space-y-2 font-medium">
                        <li>
                            <NavLink to={`/${role}-dashboard`}
                                className={({ isActive }) =>
                                    `flex items-center p-2 rounded-lg group transition-colors dark:text-white duration-200 ${isActive
                                        ? "bg-gray-200 text-gray-900 dark:bg-gray-700 "
                                        : "text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                    }`
                                }
                            >
                                <svg className="w-5 h-5 text-gray-500 transition duration-300 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                                    <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                                    <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                                </svg>
                                <span className="ms-3">Dashboard</span>
                            </NavLink>
                        </li>
                        {/* This section is for only if we are ging to apply mods */}
                        {/* <li>
                            <NavLink to="/Applications" className={({ isActive }) =>
                              `flex items-center p-2 rounded-lg group transition-colors dark:text-white duration-200 ${
                                isActive
                                  ? "bg-gray-200 text-gray-900 dark:bg-gray-700 "
                                : "text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 group"
                              }`
                            }>
                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-300 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                                    <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Applications</span>
                                <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">Pro</span>
                            </NavLink>
                        </li> */}
                        <li>
                            <NavLink to="/invoice" className={({ isActive }) =>
                                `flex items-center p-2 rounded-lg group transition-colors dark:text-white duration-200 ${isActive
                                    ? "bg-gray-200 text-gray-900 dark:bg-gray-700 "
                                    : "text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                }`
                            }>
                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-300 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Communicate</span>
                                <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">3</span>
                            </NavLink>
                        </li>

                        {userProfile.role === "admin" && <li>
                            <NavLink to="/users" className={({ isActive }) =>
                                `flex items-center p-2 rounded-lg group transition-colors dark:text-white duration-200 ${isActive
                                    ? "bg-gray-200 text-gray-900 dark:bg-gray-700 "
                                    : "text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                }`
                            }>
                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-300 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                    <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Users</span>
                            </NavLink>
                        </li>}


                        {/* Link for admin to create Departments */}
                        {userProfile.role === "admin" && <li>
                            <NavLink to="/departments" className={({ isActive }) =>
                                `flex items-center p-2 rounded-lg group transition-colors dark:text-white duration-200 ${isActive
                                    ? "bg-gray-200 text-gray-900 dark:bg-gray-700 "
                                    : "text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                }`
                            }>
                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-300 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M4 4a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2v14a1 1 0 1 1 0 2H5a1 1 0 1 1 0-2V5a1 1 0 0 1-1-1Zm5 2a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H9Zm5 0a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-1Zm-5 4a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1H9Zm5 0a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1h-1Zm-3 4a2 2 0 0 0-2 2v3h2v-3h2v3h2v-3a2 2 0 0 0-2-2h-2Z" clipRule="evenodd" />
                                </svg>


                                <span className="flex-1 ms-3 whitespace-nowrap">Departments</span>
                            </NavLink>
                        </li>}

                        {/* Link for admin assigning supervisor to panels */}
                        {userProfile.role === "staff" && userProfile?.category === "coordinator" && <li>
                            <NavLink to="/panel-management" className={({ isActive }) =>
                                `flex items-center p-2 rounded-lg group transition-colors dark:text-white duration-200 ${isActive
                                    ? "bg-gray-200 text-gray-900 dark:bg-gray-700 "
                                    : "text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                }`
                            }>
                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-300 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12 6a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm-1.5 8a4 4 0 0 0-4 4 2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-3Zm6.82-3.096a5.51 5.51 0 0 0-2.797-6.293 3.5 3.5 0 1 1 2.796 6.292ZM19.5 18h.5a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-1.1a5.503 5.503 0 0 1-.471.762A5.998 5.998 0 0 1 19.5 18ZM4 7.5a3.5 3.5 0 0 1 5.477-2.889 5.5 5.5 0 0 0-2.796 6.293A3.501 3.501 0 0 1 4 7.5ZM7.1 12H6a4 4 0 0 0-4 4 2 2 0 0 0 2 2h.5a5.998 5.998 0 0 1 3.071-5.238A5.505 5.505 0 0 1 7.1 12Z" clipRule="evenodd" />
                                </svg>


                                <span className="flex-1 ms-3 whitespace-nowrap">Panels Management</span>
                            </NavLink>
                        </li>}

                        {/* Link for admin assigning students to supervisor */}
                        {userProfile.role === "staff" && userProfile?.category === "coordinator" && <li>
                            <NavLink to="/supervision" className={({ isActive }) =>
                                `flex items-center p-2 rounded-lg group transition-colors dark:text-white duration-200 ${isActive
                                    ? "bg-gray-200 text-gray-900 dark:bg-gray-700 "
                                    : "text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                }`
                            }>
                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-300 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M11.4453 3.16795c.3359-.22393.7735-.22393 1.1094 0l6 4c.4595.30635.5837.92722.2773 1.38675-.1925.28877-.5092.44511-.832.44541-.1748.00016-.3515-.04546-.5112-.1406-.0146-.00873-.0292-.01789-.0435-.02746L16 7.86853v8.59597l-.2322-.2323c-.9763-.9763-2.5593-.9763-3.5356 0-.9763.9763-.9763 2.5593 0 3.5356L13.4645 21H8V7.86853l-1.44532.96352c-.45952.30635-1.08039.18218-1.38675-.27735-.30635-.45953-.18217-1.0804.27735-1.38675l6.00002-4ZM11 11c-.5523 0-1 .4477-1 1s.4477 1 1 1h2c.5523 0 1-.4477 1-1s-.4477-1-1-1h-2Zm-1-2c0-.55228.4477-1 1-1h2c.5523 0 1 .44772 1 1s-.4477 1-1 1h-2c-.5523 0-1-.44772-1-1Z" clipRule="evenodd" />
                                    <path d="M21 13.708v-1.583c0-.448-.298-.8414-.7293-.9627L18 10.5237v3.9408l.2322-.2323c.7484-.7483 1.853-.923 2.7678-.5242ZM6 10.5237l-2.27075.6386C3.29797 11.2836 3 11.677 3 12.125V20c0 .5523.44772 1 1 1h2V10.5237Z" />
                                    <path fillRule="evenodd" d="M20.7071 15.2929c.3905.3905.3905 1.0237 0 1.4142l-4 4c-.3905.3905-1.0237.3905-1.4142 0l-2-2c-.3905-.3905-.3905-1.0237 0-1.4142.3905-.3905 1.0237-.3905 1.4142 0L16 18.5858l3.2929-3.2929c.3905-.3905 1.0237-.3905 1.4142 0Z" clipRule="evenodd" />
                                </svg>


                                <span className="flex-1 ms-3 whitespace-nowrap">Supervision</span>
                            </NavLink>
                        </li>}


                        {(userProfile.role === "admin" || userProfile.role === "staff") && <li>
                            <NavLink to="/projects" className={({ isActive }) =>
                                `flex items-center p-2 rounded-lg group transition-colors dark:text-white duration-200 ${isActive
                                    ? "bg-gray-200 text-gray-900 dark:bg-gray-700 "
                                    : "text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                }`
                            }>
                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-300 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.4472 2.10557c-.2815-.14076-.6129-.14076-.8944 0L5.90482 4.92956l.37762.11119c.01131.00333.02257.00687.03376.0106L12 6.94594l5.6808-1.89361.3927-.13363-5.6263-2.81313ZM5 10V6.74803l.70053.20628L7 7.38747V10c0 .5523-.44772 1-1 1s-1-.4477-1-1Zm3-1c0-.42413.06601-.83285.18832-1.21643l3.49538 1.16514c.2053.06842.4272.06842.6325 0l3.4955-1.16514C15.934 8.16715 16 8.57587 16 9c0 2.2091-1.7909 4-4 4-2.20914 0-4-1.7909-4-4Z" />
                                    <path d="M14.2996 13.2767c.2332-.2289.5636-.3294.8847-.2692C17.379 13.4191 19 15.4884 19 17.6488v2.1525c0 1.2289-1.0315 2.1428-2.2 2.1428H7.2c-1.16849 0-2.2-.9139-2.2-2.1428v-2.1525c0-2.1409 1.59079-4.1893 3.75163-4.6288.32214-.0655.65589.0315.89274.2595l2.34883 2.2606 2.3064-2.2634Z" />
                                </svg>


                                <span className="flex-1 ms-3 whitespace-nowrap">Projects</span>
                            </NavLink>
                        </li>}

                        {(userProfile.role === "staff") && <li>
                            <NavLink to="/assigned-students" className={({ isActive }) =>
                                `flex items-center p-2 rounded-lg group transition-colors dark:text-white duration-200 ${isActive
                                    ? "bg-gray-200 text-gray-900 dark:bg-gray-700 "
                                    : "text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                }`
                            }>
                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-300 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20 14h-2.722L11 20.278a5.511 5.511 0 0 1-.9.722H20a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1ZM9 3H4a1 1 0 0 0-1 1v13.5a3.5 3.5 0 1 0 7 0V4a1 1 0 0 0-1-1ZM6.5 18.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM19.132 7.9 15.6 4.368a1 1 0 0 0-1.414 0L12 6.55v9.9l7.132-7.132a1 1 0 0 0 0-1.418Z" />
                                </svg>

                                <span className="flex-1 ms-3 whitespace-nowrap">Assigned </span>
                            </NavLink>
                        </li>}
                        {userProfile.role === "student" && <li>
                            <NavLink to="/student-projects" className={({ isActive }) =>
                                `flex items-center p-2 rounded-lg group transition-colors dark:text-white duration-200 ${isActive
                                    ? "bg-gray-200 text-gray-900 dark:bg-gray-700 "
                                    : "text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                }`
                            }>
                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-300 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20 14h-2.722L11 20.278a5.511 5.511 0 0 1-.9.722H20a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1ZM9 3H4a1 1 0 0 0-1 1v13.5a3.5 3.5 0 1 0 7 0V4a1 1 0 0 0-1-1ZM6.5 18.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM19.132 7.9 15.6 4.368a1 1 0 0 0-1.414 0L12 6.55v9.9l7.132-7.132a1 1 0 0 0 0-1.418Z" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Project</span>
                            </NavLink>
                        </li>}
                        {userProfile.role === "admin" && <li>
                            <NavLink to="/admin-register" className={({ isActive }) =>
                                `flex items-center p-2 rounded-lg group transition-colors dark:text-white duration-200 ${isActive
                                    ? "bg-gray-200 text-gray-900 dark:bg-gray-700 "
                                    : "text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                }`
                            }>
                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-300 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z" />
                                    <path d="M6.737 11.061a2.961 2.961 0 0 1 .81-1.515l6.117-6.116A4.839 4.839 0 0 1 16 2.141V2a1.97 1.97 0 0 0-1.933-2H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18v-3.093l-1.546 1.546c-.413.413-.94.695-1.513.81l-3.4.679a2.947 2.947 0 0 1-1.85-.227 2.96 2.96 0 0 1-1.635-3.257l.681-3.397Z" />
                                    <path d="M8.961 16a.93.93 0 0 0 .189-.019l3.4-.679a.961.961 0 0 0 .49-.263l6.118-6.117a2.884 2.884 0 0 0-4.079-4.078l-6.117 6.117a.96.96 0 0 0-.263.491l-.679 3.4A.961.961 0 0 0 8.961 16Zm7.477-9.8a.958.958 0 0 1 .68-.281.961.961 0 0 1 .682 1.644l-.315.315-1.36-1.36.313-.318Zm-5.911 5.911 4.236-4.236 1.359 1.359-4.236 4.237-1.7.339.341-1.699Z" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Create new user</span>
                            </NavLink>
                        </li>}
                        <li>
                            <NavLink to="/profile" className={({ isActive }) =>
                                `flex items-center p-2 rounded-lg group transition-colors dark:text-white duration-200 ${isActive
                                    ? "bg-gray-200 text-gray-900 dark:bg-gray-700 "
                                    : "text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                }`
                            }>
                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-300 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4Zm10 5a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Zm0 3a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Zm0 3a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Zm-8-5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm1.942 4a3 3 0 0 0-2.847 2.051l-.044.133-.004.012c-.042.126-.055.167-.042.195.006.013.02.023.038.039.032.025.08.064.146.155A1 1 0 0 0 6 17h6a1 1 0 0 0 .811-.415.713.713 0 0 1 .146-.155c.019-.016.031-.026.038-.04.014-.027 0-.068-.042-.194l-.004-.012-.044-.133A3 3 0 0 0 10.059 14H7.942Z" clipRule="evenodd" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Profile</span>
                            </NavLink>
                        </li>

                        {/* Mou begins here */}
                        <li>
                            <button onClick={() => setIsMou(!isMou)} type="button" className="flex items-center w-full p-2 text-base text-gray-900 transition duration-300 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700" aria-controls="dropdown-example" data-collapse-toggle="dropdown-example">
                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-300 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                                    <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                                </svg>

                                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">MOU Panel</span>
                                {isMou ? (<svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-300 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7" />
                                </svg>
                                ) : (
                                    <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-300 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7" />
                                    </svg>
                                )}
                            </button>
                            <ul id="dropdown-example" className={`${isMou ? 'block' : 'hidden'} py-2 space-y-2`}>
                                <li>

                                    <NavLink to="/mou" className={({ isActive }) =>
                                        `flex items-center p-2 rounded-lg group transition-colors dark:text-white duration-200 pl-11 ${isActive
                                            ? "bg-gray-200 text-gray-900 dark:bg-gray-700 "
                                            : "text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                        }`
                                    }>
                                        <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-300 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                            <path fillRule="evenodd" d="M9 7V2.221a2 2 0 0 0-.5.365L4.586 6.5a2 2 0 0 0-.365.5H9Zm2 0V2h7a2 2 0 0 1 2 2v5.703l-4.311-1.58a2 2 0 0 0-1.377 0l-5 1.832A2 2 0 0 0 8 11.861c.03 2.134.582 4.228 1.607 6.106.848 1.555 2 2.924 3.382 4.033H6a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Z" clipRule="evenodd" />
                                            <path fillRule="evenodd" d="M15.345 9.061a1 1 0 0 0-.689 0l-5 1.833a1 1 0 0 0-.656.953c.028 1.97.538 3.905 1.485 5.641a12.425 12.425 0 0 0 3.956 4.34 1 1 0 0 0 1.12 0 12.426 12.426 0 0 0 3.954-4.34A12.14 12.14 0 0 0 21 11.848a1 1 0 0 0-.656-.954l-5-1.833ZM15 19.765a10.401 10.401 0 0 0 2.76-3.235 10.15 10.15 0 0 0 1.206-4.011L15 11.065v8.7Z" clipRule="evenodd" />
                                        </svg>
                                        <p>MOU</p>
                                    </NavLink>
                                </li>
                                <li>

                                    <NavLink to="/mou-create" className={({ isActive }) =>
                                        `flex items-center p-2 rounded-lg group transition-colors dark:text-white duration-200 pl-11 ${isActive
                                            ? "bg-gray-200 text-gray-900 dark:bg-gray-700 "
                                            : "text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                        }`
                                    }>
                                        <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-300 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                            <path fillRule="evenodd" d="M9 7V2.221a2 2 0 0 0-.5.365L4.586 6.5a2 2 0 0 0-.365.5H9Zm2 0V2h7a2 2 0 0 1 2 2v6.41A7.5 7.5 0 1 0 10.5 22H6a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Z" clipRule="evenodd" />
                                            <path fillRule="evenodd" d="M9 16a6 6 0 1 1 12 0 6 6 0 0 1-12 0Zm6-3a1 1 0 0 1 1 1v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 1 1 0-2h1v-1a1 1 0 0 1 1-1Z" clipRule="evenodd" />
                                        </svg>

                                        <p>Create</p>
                                    </NavLink>
                                </li>

                                <li>

                                    <NavLink to="/mou-sign" className={({ isActive }) =>
                                        `flex items-center p-2 rounded-lg group transition-colors dark:text-white duration-200 pl-11 ${isActive
                                            ? "bg-gray-200 text-gray-900 dark:bg-gray-700 "
                                            : "text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                        }`
                                    }>
                                        <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-300 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                            <path fillRule="evenodd" d="M8 7V2.221a2 2 0 0 0-.5.365L3.586 6.5a2 2 0 0 0-.365.5H8Zm2 0V2h7a2 2 0 0 1 2 2v.126a5.087 5.087 0 0 0-4.74 1.368v.001l-6.642 6.642a3 3 0 0 0-.82 1.532l-.74 3.692a3 3 0 0 0 3.53 3.53l3.694-.738a3 3 0 0 0 1.532-.82L19 15.149V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Z" clipRule="evenodd" />
                                            <path fillRule="evenodd" d="M17.447 8.08a1.087 1.087 0 0 1 1.187.238l.002.001a1.088 1.088 0 0 1 0 1.539l-.377.377-1.54-1.542.373-.374.002-.001c.1-.102.22-.182.353-.237Zm-2.143 2.027-4.644 4.644-.385 1.924 1.925-.385 4.644-4.642-1.54-1.54Zm2.56-4.11a3.087 3.087 0 0 0-2.187.909l-6.645 6.645a1 1 0 0 0-.274.51l-.739 3.693a1 1 0 0 0 1.177 1.176l3.693-.738a1 1 0 0 0 .51-.274l6.65-6.646a3.088 3.088 0 0 0-2.185-5.275Z" clipRule="evenodd" />
                                        </svg>


                                        <p>Sign Collaborated</p>
                                    </NavLink>
                                </li>
                                {role === "admin" &&
                                    <li>

                                        <NavLink to="/mou-reviewer-management" className={({ isActive }) =>
                                            `flex items-center p-2 rounded-lg group transition-colors dark:text-white duration-200 pl-11 ${isActive
                                                ? "bg-gray-200 text-gray-900 dark:bg-gray-700 "
                                                : "text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                            }`
                                        }>
                                            <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-300 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M6 2c-1.10457 0-2 .89543-2 2v4c0 .55228.44772 1 1 1s1-.44772 1-1V4h12v7h-2c-.5523 0-1 .4477-1 1v2h-1c-.5523 0-1 .4477-1 1s.4477 1 1 1h5c.5523 0 1-.4477 1-1V3.85714C20 2.98529 19.3667 2 18.268 2H6Z" />
                                                <path d="M6 11.5C6 9.567 7.567 8 9.5 8S13 9.567 13 11.5 11.433 15 9.5 15 6 13.433 6 11.5ZM4 20c0-2.2091 1.79086-4 4-4h3c2.2091 0 4 1.7909 4 4 0 1.1046-.8954 2-2 2H6c-1.10457 0-2-.8954-2-2Z" />
                                            </svg>

                                            <p>Manage Reviewers</p>
                                        </NavLink>
                                    </li>}
                                {userProfile.isReviewer &&
                                    <li>

                                        <NavLink to="/mou-reviewer-mou" className={({ isActive }) =>
                                            `flex items-center p-2 rounded-lg group transition-colors dark:text-white duration-200 pl-11 ${isActive
                                                ? "bg-gray-200 text-gray-900 dark:bg-gray-700 "
                                                : "text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                            }`
                                        }>
                                            <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-300 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M6 2c-1.10457 0-2 .89543-2 2v4c0 .55228.44772 1 1 1s1-.44772 1-1V4h12v7h-2c-.5523 0-1 .4477-1 1v2h-1c-.5523 0-1 .4477-1 1s.4477 1 1 1h5c.5523 0 1-.4477 1-1V3.85714C20 2.98529 19.3667 2 18.268 2H6Z" />
                                                <path d="M6 11.5C6 9.567 7.567 8 9.5 8S13 9.567 13 11.5 11.433 15 9.5 15 6 13.433 6 11.5ZM4 20c0-2.2091 1.79086-4 4-4h3c2.2091 0 4 1.7909 4 4 0 1.1046-.8954 2-2 2H6c-1.10457 0-2-.8954-2-2Z" />
                                            </svg>

                                            <p>Review MOUs</p>
                                        </NavLink>
                                    </li>}
                            </ul>
                        </li>

                    </ul>
                </div>
                <div onClick={signOutUser} className=" m-6 pb-4 overflow-y-auto bg-white  dark:bg-gray-800 p-4 flex flex-row justify-around text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer duration-300 rounded-lg">
                    <span className=" ms-3 whitespace-nowrap dark:text-white"> Sign Out</span>
                    <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-300 dark:text-gray-400 group-hover:text-gray-900  dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3" />
                    </svg>
                </div>
            </aside>
            <div onClick={() => setSidebarOpen(false)} className="md:pl-70 md:pr-10 pt-20 bg-gray-50 dark:bg-gray-900 min-h-screen min-w-screen max-w-screen max-h-screen overflow-y-auto duration-300">
                <Goback />
                {children}
            </div>
        </div>
    );
};

export default SideHeader;