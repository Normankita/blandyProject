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
    <div className="bg-slate-50 dark:bg-slate-900 p-6 min-h-150 max-h-400 shadow-lg shadow-slate-900/10 dark:shadow-black/40 dark:text-gray-300 text-gray-800  rounded-sm duration-300">
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
            <a href={gitHubUrl} target="_blank" rel="noreferrer" className="text-yellow-500 underline">
              {gitHubUrl}
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
