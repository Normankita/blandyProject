import React from "react";
import { auth } from "../configs/firebase";
import { Link } from "react-router-dom";

const ContactCard = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 p-6 min-h-150 max-h-400 shadow-lg shadow-slate-900/10 dark:shadow-black/40 dark:text-gray-300 text-gray-800  rounded-sm duration-300">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="w-35 h-35 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 p-6 shadow-lg shadow-slate-900/10 dark:shadow-black/40 dark:text-gray-300 text-gray-800 duration-300">
        <img
          src={`${auth.currentUser.photoURL?auth.currentUser.photoURL:'some image'}`} // Replace with actual image path
          alt="Profile"
          className="w-full h-full min-w-full min-h-full rounded-full object-cover"
        />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">{`${auth.currentUser.displayName? auth.currentUser.displayName: `User Account`}`}</h2>
          <div className="flex items-center space-x-2">
            {/* section for diaplaying github account url */}
            {/* <span className="bg-white text-black px-1 text-sm rounded">in</span>
            <span className="text-xl">...</span> */}
          </div>
        </div>
        
      </div>

      {/* Tabs */}
      <div className="flex space-x-6 mt-6 border-b border-gray-600">
        <span className="pb-2 border-b-2 border-white">Overview</span>
      </div>

      {/* Contact Info */}
      <div className="mt-6">
        <h3 className="font-semibold mb-4">Contact information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Email</p>
            <p>{auth.currentUser.email}</p>
          </div>
          
          <div>
            <p className="text-gray-400">Work phone</p>
            <p>255621381584</p>
          </div>
          <div>
            <p className="text-gray-400">Mobile</p>
            <p>+255762028554</p>
          </div>
          <div>
            <p className="text-gray-400">Home phone</p>
            <p>+255673381584</p>
          </div>
        </div>

        <Link to="/admin/edit-profile">
        <button className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200">
            <span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 inline-block mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 4h2a2 2 0 012 2v2m-4-4h-2a2 2 0 00-2 2v2m4-4v4m0 0h4m-4 0H8m8 0v4m0-4h-8m8 0V8m0 4h4m-4 0H8m8 0v4m0-4H8"
                    />
                </svg>
                Edit Profile
            </span>
        </button>
        </Link>
      </div>
    </div>
  );
};

export default ContactCard;