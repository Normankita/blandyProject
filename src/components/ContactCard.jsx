import React from "react";
import { auth } from "../configs/firebase";
import { Link } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import Man from "@/assets/avatars/man.svg";
import Woman from "@/assets/avatars/woman.svg";
import { toast } from "react-toastify";

const ContactCard = ({ userToDisplay = null }) => {
  const { userProfile } = useData();

  if (!userProfile) return <div>Loading profile...</div>;

  const {
    name,
    email,
    photoUrl,
    role,
    gender,
    doB,
    mobNo,
    department,
    program,
    gitHubUrl,
    registrationNumber,
    status,
  } = userToDisplay ?? userProfile;

  const profileImage =
    auth.currentUser?.photoURL ? auth.currentUser?.photoURL : photoUrl ? photoUrl : gender === "female" ? Woman : Man;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 min-h-150 max-h-400 shadow-lg shadow-slate-900/10 dark:shadow-black/40 dark:text-gray-300 text-gray-800  rounded-sm duration-300">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="w-30 h-30 rounded-full overflow-hidden bg-slate-300 dark:bg-slate-800 p-2 shadow-lg shadow-slate-900/10 dark:shadow-black/40 dark:text-gray-300 text-gray-800 duration-300">
          <img
            src={profileImage} // Replace with actual image path
            alt="Profile"
            className="w-full h-full min-w-full min-h-full rounded-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">{name || "User Account"}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{role || "unknown role"}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-6 border-b border-gray-600 pb-2">
        <span className="text-lg font-semibold">Overview</span>
      </div>

      {/* Info Grid */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
        {email && (
          <div>
            <p className="text-gray-400">Email</p>
            <p>{email}</p>
          </div>
        )}
        {mobNo && (
          <div>
            <p className="text-gray-400">Mobile</p>
            <p>{mobNo}</p>
          </div>
        )}
        {registrationNumber && (
          <div>
            <p className="text-gray-400">Registration No.</p>
            <p>{registrationNumber}</p>
          </div>
        )}
        {gender && (
          <div>
            <p className="text-gray-400">Gender</p>
            <p>{gender}</p>
          </div>
        )}
        {doB && (
          <div>
            <p className="text-gray-400">Date of Birth</p>
            <p>{new Date(doB).toDateString()}</p>
          </div>
        )}
        {role === "student" && program && (
          <div>
            <p className="text-gray-400">Program</p>
            <p>{program}</p>
          </div>
        )}
        {role === "staff" && department && (
          <div>
            <p className="text-gray-400">Department</p>
            <p>{department}</p>
          </div>
        )}
        {status && (
          <div>
            <p className="text-gray-400">Account Status</p>
            <p>{status}</p>
          </div>
        )}
        {gitHubUrl && (
          <div>
            <p className="text-gray-400">GitHub</p>
            <a href={gitHubUrl} target="_blank" rel="noreferrer" className="tunderline pt-5">
              <span>
                <svg className="w-6 h-6 text-gray-800 dark:text-white duration-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.006 2a9.847 9.847 0 0 0-6.484 2.44 10.32 10.32 0 0 0-3.393 6.17 10.48 10.48 0 0 0 1.317 6.955 10.045 10.045 0 0 0 5.4 4.418c.504.095.683-.223.683-.494 0-.245-.01-1.052-.014-1.908-2.78.62-3.366-1.21-3.366-1.21a2.711 2.711 0 0 0-1.11-1.5c-.907-.637.07-.621.07-.621.317.044.62.163.885.346.266.183.487.426.647.71.135.253.318.476.538.655a2.079 2.079 0 0 0 2.37.196c.045-.52.27-1.006.635-1.37-2.219-.259-4.554-1.138-4.554-5.07a4.022 4.022 0 0 1 1.031-2.75 3.77 3.77 0 0 1 .096-2.713s.839-.275 2.749 1.05a9.26 9.26 0 0 1 5.004 0c1.906-1.325 2.74-1.05 2.74-1.05.37.858.406 1.828.101 2.713a4.017 4.017 0 0 1 1.029 2.75c0 3.939-2.339 4.805-4.564 5.058a2.471 2.471 0 0 1 .679 1.897c0 1.372-.012 2.477-.012 2.814 0 .272.18.592.687.492a10.05 10.05 0 0 0 5.388-4.421 10.473 10.473 0 0 0 1.313-6.948 10.32 10.32 0 0 0-3.39-6.165A9.847 9.847 0 0 0 12.007 2Z" clipRule="evenodd" />
                </svg>

              </span>
            </a>
          </div>
        )}
      </div>

      {/* Edit Button */}
      <div className="mt-6">
        <Link to="/update-profile" className="inline-block">
          <button className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-bold rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-slate-900 dark:text-white dark:border-gray-600 dark:hover:bg-slate-950 dark:hover:border-gray-600 dark:focus:ring-gray-700 shadow-lg shadow-slate-900/10 dark:shadow-black/40 mt-10 ">
            {!userToDisplay && (!userToDisplay ? "Edit Profile" : "Edit User")}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ContactCard;
