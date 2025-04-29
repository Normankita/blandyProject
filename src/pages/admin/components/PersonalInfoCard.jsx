import { FaFacebookF, FaInstagram, FaGithub, FaDribbble, FaMapMarkerAlt, FaBriefcase } from "react-icons/fa";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Define an array of social icons with their respective hover effects
const socialIcons = [
  { icon: FaFacebookF, hoverClass: "hover:text-blue-500" },
  { icon: FaInstagram, hoverClass: "hover:text-pink-500" },
  { icon: FaGithub, hoverClass: "hover:text-gray-500" },
  { icon: FaDribbble, hoverClass: "hover:text-red-500" },
];

const PersonalInfoCard = ({
  
  userProfile = null
}) => {


  const { email, firstName, lastName, phoneNumber, role, region } = userProfile ? userProfile : useSelector((state) => state.userState.userState);
  const fullName = `${firstName} ${lastName}`;
  const jobTitle = role;
  const location = region;
  const navigate = useNavigate()


  return (
    <div className="  bg-slate-50 dark:bg-slate-900 text-gray-800 dark:text-white p-6 rounded-2xl shadow-lg max-w-4xl mx-auto md:max-w-2xl sm:max-w-full">
      
      {/* Section title */}
      <h2 className="text-xl font-semibold border-b border-gray-700 pb-2 mb-4">Personal Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div>
          <p className="font-semibold">Full name</p>
          <p className="text-gray-400">{fullName}</p>

          <p className="font-semibold mt-4">Biography</p>

          <p className="font-semibold mt-4">Social</p>
          <div className="flex gap-3 mt-2 text-gray-400">
            {/* Dynamically render social icons */}
            {socialIcons.map(({ icon: Icon, hoverClass }, index) => (
              <Icon key={index} className={clsx("cursor-pointer", hoverClass)} />
            ))}
          </div>

          <p className="font-semibold mt-4">Location</p>
          <p className="text-gray-400 flex items-center gap-2">
            <FaMapMarkerAlt /> {location || "Mbeya"}
          </p>

          <p className="font-semibold mt-4">User Category</p>
          <p className="text-gray-400 flex items-center gap-2">
            <FaBriefcase /> {jobTitle || "Admin"}
          </p>
        </div>

        {/* Right Column */}
        <div>
          <p className="font-semibold">Email Address</p>
          <p className="text-gray-400">{email}</p>

          <p className="font-semibold mt-4">Phone Number</p>
          <p className="text-gray-400">{phoneNumber || "+255621382584"}</p>
        </div>
      </div>

      {/* Edit button */}
      <div className="flex justify-end mt-6">
        <button onClick={()=> userProfile? navigate("/register") : navigate("/") } className={clsx("bg-blue-600", "hover:bg-blue-500", "text-white", "px-4", "py-2", "rounded-lg")}>
          ✏ {userProfile? "Change password": "Edit details"}
        </button>
      </div>
    </div>
  );
};

export default PersonalInfoCard;
