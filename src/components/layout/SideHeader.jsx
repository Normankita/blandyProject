import { Link, NavLink } from "react-router-dom";
import Goback from "../Goback";
import { auth, signOutUser } from "../../configs/firebase";
import { useState, useEffect } from "react";

const SideHeader = ({ children, role }) => {

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
                                    <button onClick={() => setProfile(!profile)} type="button" className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 md:mr-10" aria-expanded="false" data-dropdown-toggle="dropdown-user">
                                        <span className="sr-only">Open user menu</span>
                                        <img className="w-8 h-8 rounded-full" src={auth.currentUser.photoURL ? auth.currentUser.photoURL : "https://flowbite.com/docs/images/people/profile-picture-5.jpg"} alt="user photo" />
                                    </button>
                                </div>
                                {/* Profile options */}
                                <div className={`z-50 ${profile ? "block" : "hidden"} absolute top-16 right-4 w-44 rounded-lg shadow-xl bg-white border-b border-gray-200 dark:bg-gray-800 dark:    border-gray-700`} id="dropdown-user" role="menu" aria-orientation="vertical" aria-labelledby="dropdown-user">
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
                                            <NavLink to="/admin-dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Dashboard</NavLink>
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
                                <svg className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
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
                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
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
                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Incoming</span>
                                <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">3</span>
                            </NavLink>
                        </li>

                        {role === "admin" && <li>
                            <NavLink to="/users" className={({ isActive }) =>
                                `flex items-center p-2 rounded-lg group transition-colors dark:text-white duration-200 ${isActive
                                    ? "bg-gray-200 text-gray-900 dark:bg-gray-700 "
                                    : "text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                }`
                            }>
                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                    <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Users</span>
                            </NavLink>
                        </li>}

                        {/* Link for admin assigning students to supervisor */}
                        {role === "admin" && <li>
                            <NavLink to="/supervision" className={({ isActive }) =>
                                `flex items-center p-2 rounded-lg group transition-colors dark:text-white duration-200 ${isActive
                                    ? "bg-gray-200 text-gray-900 dark:bg-gray-700 "
                                    : "text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                }`
                            }>
                                <svg className="w-6 h-6 text-gray-500 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path fill-rule="evenodd" d="M7.50001 6.49476c-.00222.00067-.00443.00134-.00665.00202-1.36964.41615-2.57189 1.22541-3.40555 1.89335-.42318.33907-.76614.65372-1.00483.88517-.11959.11596-.21369.21169-.2793.27999-.03283.03417-.05857.06153-.07687.08118l-.02184.02361-.00665.00728-.00225.00247-.00152.00167c-.23565.26049-.31736.6255-.21524.9616l1.88966 6.2193c.28122.9255.90731 1.6328 1.59535 2.159.68925.5272 1.4966.9166 2.25327 1.198.76111.2832 1.50814.4708 2.10341.5791.2973.054.5684.0904.7934.1077.1117.0085.2238.0133.3286.0113.0814-.0016.2434-.0076.4111-.0586.1678-.051.3057-.1361.3743-.18.0882-.0566.1786-.123.2667-.1923.1774-.1395.3824-.3205.5994-.5309-.076-.0369-.1525-.0755-.2297-.1152-.6068-.312-1.3433-.7546-2.0675-1.3064-.4898-.3733-1.01068-.8242-1.48988-1.3492-.28662.4467-.87678.5935-1.34124.3253-.47829-.2761-.64217-.8877-.36603-1.366.01906-.033.03873-.0675.05915-.1034.10835-.1902.23774-.4173.40797-.6498C7.73454 14.6941 7.5 13.8935 7.5 13V6.5l.00001-.00524ZM5.72195 11.0461c-.52844.1606-.82665.7191-.6661 1.2476.16056.5284.7191.8266 1.24753.6661l.00957-.003c.52843-.1605.82665-.7191.66609-1.2475-.16056-.5284-.7191-.8266-1.24753-.6661l-.00956.0029Z" clip-rule="evenodd" />
                                    <path fill-rule="evenodd" d="M15 4c-1.4315 0-2.8171.42479-3.8089.82152-.5035.2014-.9231.40276-1.21876.55482-.14814.07618-.26601.14043-.34864.1867-.04134.02315-.07393.04184-.09715.05533l-.02775.01624-.00849.00502-.00286.00171-.00195.00117C9.1843 5.82323 9 6.14874 9 6.5V13c0 .9673.39342 1.8261.89875 2.5296.50625.7048 1.16555 1.312 1.80765 1.8013.646.4922 1.3062.8889 1.8442 1.1655.2688.1382.5176.2518.7279.3338.1044.0407.2102.0778.3111.1063.0784.0222.2351.0635.4104.0635.1753 0 .332-.0413.4104-.0635.1009-.0285.2067-.0656.3111-.1063.2103-.082.4591-.1956.7279-.3338.538-.2766 1.1982-.6733 1.8442-1.1655.6421-.4893 1.3014-1.0965 1.8076-1.8013C20.6066 14.8261 21 13.9673 21 13V6.5c0-.35126-.1852-.67728-.4864-.85801l-.001-.00065-.0029-.00171-.0085-.00502-.0278-.01624c-.0232-.01349-.0558-.03218-.0971-.05533-.0826-.04627-.2005-.11052-.3486-.1867-.2957-.15206-.7153-.35342-1.2188-.55482C17.8171 4.42479 16.4315 4 15 4Zm5 2.5.5136-.85801S20.5145 5.64251 20 6.5ZM13 7c-.5523 0-1 .44772-1 1s.4477 1 1 1h.01c.5523 0 1-.44772 1-1s-.4477-1-1-1H13Zm4 0c-.5523 0-1 .44772-1 1s.4477 1 1 1h.01c.5523 0 1-.44772 1-1s-.4477-1-1-1H17Zm-4.7071 4.2929c-.3905.3905-.3905 1.0237 0 1.4142.0269.027.0549.0552.0838.0845.4776.4831 1.243 1.2574 2.6233 1.2574 1.3803 0 2.1457-.7743 2.6232-1.2573.029-.0294.057-.0576.0839-.0846.3905-.3905.3905-1.0237 0-1.4142-.3905-.3905-1.0237-.3905-1.4142 0-.5293.5293-.757.7561-1.2929.7561-.5359 0-.7636-.2268-1.2929-.7561-.3905-.3905-1.0237-.3905-1.4142 0Z" clip-rule="evenodd" />
                                </svg>

                                <span className="flex-1 ms-3 whitespace-nowrap">Supervision</span>
                            </NavLink>
                        </li>}
                        {(role === "admin" || role === "staff") && <li>
                            <NavLink to="/projects" className={({ isActive }) =>
                                `flex items-center p-2 rounded-lg group transition-colors dark:text-white duration-200 ${isActive
                                    ? "bg-gray-200 text-gray-900 dark:bg-gray-700 "
                                    : "text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                }`
                            }>
                                <svg className="w-6 h-6 text-gray-500 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.4472 2.10557c-.2815-.14076-.6129-.14076-.8944 0L5.90482 4.92956l.37762.11119c.01131.00333.02257.00687.03376.0106L12 6.94594l5.6808-1.89361.3927-.13363-5.6263-2.81313ZM5 10V6.74803l.70053.20628L7 7.38747V10c0 .5523-.44772 1-1 1s-1-.4477-1-1Zm3-1c0-.42413.06601-.83285.18832-1.21643l3.49538 1.16514c.2053.06842.4272.06842.6325 0l3.4955-1.16514C15.934 8.16715 16 8.57587 16 9c0 2.2091-1.7909 4-4 4-2.20914 0-4-1.7909-4-4Z" />
                                    <path d="M14.2996 13.2767c.2332-.2289.5636-.3294.8847-.2692C17.379 13.4191 19 15.4884 19 17.6488v2.1525c0 1.2289-1.0315 2.1428-2.2 2.1428H7.2c-1.16849 0-2.2-.9139-2.2-2.1428v-2.1525c0-2.1409 1.59079-4.1893 3.75163-4.6288.32214-.0655.65589.0315.89274.2595l2.34883 2.2606 2.3064-2.2634Z" />
                                </svg>


                                <span className="flex-1 ms-3 whitespace-nowrap">Projects</span>
                            </NavLink>
                        </li>}

                        {(role === "staff") && <li>
                            <NavLink to="/assigned-students" className={({ isActive }) =>
                                `flex items-center p-2 rounded-lg group transition-colors dark:text-white duration-200 ${isActive
                                    ? "bg-gray-200 text-gray-900 dark:bg-gray-700 "
                                    : "text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                }`
                            }>
                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20 14h-2.722L11 20.278a5.511 5.511 0 0 1-.9.722H20a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1ZM9 3H4a1 1 0 0 0-1 1v13.5a3.5 3.5 0 1 0 7 0V4a1 1 0 0 0-1-1ZM6.5 18.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM19.132 7.9 15.6 4.368a1 1 0 0 0-1.414 0L12 6.55v9.9l7.132-7.132a1 1 0 0 0 0-1.418Z" />
                                </svg>

                                <span className="flex-1 ms-3 whitespace-nowrap">Assigned </span>
                            </NavLink>
                        </li>}
                        {role === "student" && <li>
                            <NavLink to="/student-projects" className={({ isActive }) =>
                                `flex items-center p-2 rounded-lg group transition-colors dark:text-white duration-200 ${isActive
                                    ? "bg-gray-200 text-gray-900 dark:bg-gray-700 "
                                    : "text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                }`
                            }>
                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20 14h-2.722L11 20.278a5.511 5.511 0 0 1-.9.722H20a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1ZM9 3H4a1 1 0 0 0-1 1v13.5a3.5 3.5 0 1 0 7 0V4a1 1 0 0 0-1-1ZM6.5 18.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM19.132 7.9 15.6 4.368a1 1 0 0 0-1.414 0L12 6.55v9.9l7.132-7.132a1 1 0 0 0 0-1.418Z" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Project</span>
                            </NavLink>
                        </li>}
                        {role === "admin" && <li>
                            <NavLink to="/admin-register" className={({ isActive }) =>
                                `flex items-center p-2 rounded-lg group transition-colors dark:text-white duration-200 ${isActive
                                    ? "bg-gray-200 text-gray-900 dark:bg-gray-700 "
                                    : "text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                }`
                            }>
                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z" />
                                    <path d="M6.737 11.061a2.961 2.961 0 0 1 .81-1.515l6.117-6.116A4.839 4.839 0 0 1 16 2.141V2a1.97 1.97 0 0 0-1.933-2H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18v-3.093l-1.546 1.546c-.413.413-.94.695-1.513.81l-3.4.679a2.947 2.947 0 0 1-1.85-.227 2.96 2.96 0 0 1-1.635-3.257l.681-3.397Z" />
                                    <path d="M8.961 16a.93.93 0 0 0 .189-.019l3.4-.679a.961.961 0 0 0 .49-.263l6.118-6.117a2.884 2.884 0 0 0-4.079-4.078l-6.117 6.117a.96.96 0 0 0-.263.491l-.679 3.4A.961.961 0 0 0 8.961 16Zm7.477-9.8a.958.958 0 0 1 .68-.281.961.961 0 0 1 .682 1.644l-.315.315-1.36-1.36.313-.318Zm-5.911 5.911 4.236-4.236 1.359 1.359-4.236 4.237-1.7.339.341-1.699Z" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Create new user</span>
                            </NavLink>
                        </li>}
                        {role === "admin" && <li>
                            <NavLink to="/login" className={({ isActive }) =>
                                `flex items-center p-2 rounded-lg group transition-colors dark:text-white duration-200 ${isActive
                                    ? "bg-gray-200 text-gray-900 dark:bg-gray-700 "
                                    : "text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                }`
                            }>
                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 16">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Sign In as user</span>
                            </NavLink>
                        </li>}
                    </ul>
                </div>
                <div onClick={signOutUser} className=" m-6 pb-4 overflow-y-auto bg-white  dark:bg-gray-800 p-4 flex flex-row justify-around text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer duration-300 rounded-lg">
                    <span className=" ms-3 whitespace-nowrap dark:text-white"> Sign Out</span>
                    <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900  dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 16">
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