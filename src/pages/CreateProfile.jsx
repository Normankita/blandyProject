import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { UserForm } from './admin/components/UserForm';
import { serverTimestamp } from "firebase/firestore";
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';
const CreateProfile = () => {
  const { user, logout } = useAuth();
  const [profileImage, setProfileImage] = useState(null);
  useEffect(() => {
    if (user?.photoURL) {
      console.log("User photoURL:", user.photoURL.trim());
      setProfileImage(user.photoURL.trim());
    }
  }, [user]);
  const { addData, setUserProfile, uploadFile } = useData();
  const datepickerRef = useRef(null);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  
  const [error, setError] = useState({
    fullNameError: "",
    doBError: "",
    genderError: "",
    maritalStatError: "",
    roleError: "",
    regionError: "",
    isActiveError: "",
    mobNoError: "",
    emailError: "",
    passwordError: "",
    department: "",
    program: "",
    gitHubUrl: ""
  });

  const [formData, setFormData] = useState({
    fullName: user?.displayName || "",
    doB: "",
    gender: "",
    role: "",
    isActive: false,
    mobNo: user?.phoneNumber || "",
    department: "",
    program: "",
    gitHubUrl: "",
    photoUrl: user?.photoURL?.trim() || "",
    registrationNumber: "",
  });


  const handleChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case 'mobNo':
        const cleaned = '+' + value.replace(/[^0-9]/g, '').slice(0, 12);
        setFormData((prev) => ({ ...prev, mobNo: cleaned }));
        setError((prev) => ({
          ...prev,
          mobNoError: cleaned.length !== 13 ? 'Invalid phone number' : '',
        }));
        break;

      case 'password':
        const strength = [/[0-9]/, /[a-z]/, /[A-Z]/, /[^0-9a-zA-Z]/].reduce(
          (acc, regex) => acc + regex.test(value),
          0
        );
        setError((prev) => ({
          ...prev,
          passwordError: strength < 4 ? 'Weak Password' : '',
        }));
        setFormData((prev) => ({ ...prev, password: value }));
        break;

      case 'repassword':
        setError((prev) => ({
          ...prev,
          passwordError: value !== formData.password ? 'Passwords do not match!' : '',
        }));
        setFormData((prev) => ({ ...prev, repassword: value }));
        break;

      case 'fullName':
        const parts = value.trim().split(' ');
        setError((prev) => ({
          ...prev,
          fullNameError: parts.length < 2 ? 'Please enter first and last name' : '',
        }));
        setFormData((prev) => ({ ...prev, fullName: value }));
        break;

      case 'registrationNumber':
        let formattedValue = value.replace(/[^0-9\/T\.]/gi, ''); // Clean unwanted chars

        // Auto-insert "/T." after 8 digits
        if (/^\d{8}$/.test(formattedValue)) {
          formattedValue += '/T.';
        }

        // Limit to full format length
        if (formattedValue.length > 13) {
          formattedValue = formattedValue.slice(0, 13);
        }

        const regNumPattern = /^\d{8}\/T\.\d{2}$/;
        setFormData((prev) => ({ ...prev, registrationNumber: formattedValue }));
        setError((prev) => ({
          ...prev,
          registrationNumberError: regNumPattern.test(formattedValue)
            ? ''
            : 'Expected format: 12345678/T.22',
        }));
        break;

      default:
        setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!user || !user.uid) {
      toast.error(`User not authenticated`);
      return;
    }
    let photoUrl = "";

    if (profileImage) {
      if (typeof profileImage === "string") {
        photoUrl = profileImage;
      } else {
        const path = `profilePics/${user.uid}.jpg`;
        const uploadedUrl = await uploadFile(profileImage, path);
        if (uploadedUrl) {
          photoUrl = uploadedUrl;
        } else {
          toast.error("Failed to upload profile picture");
          setSubmitting(false);
          return;
        }
      }
    }

    const updatedFormData = {
      ...formData,
      name: formData.fullName.trim(),
      doB: new Date(formData.doB).toISOString(),
      createdAt: serverTimestamp(),
      uid: user.uid,
      email: user.email,
      photoUrl,
      status: formData.role === "student" ? "active" : "pending",
    };


    try {
      const id = await addData("users", updatedFormData, user.uid);
      if (id) {
        toast.success(`Profile created successfully`);
        toast.success(`Welcome ${updatedFormData.name.split(' ')[0]}`);
        if (updatedFormData.status === "pending") {
          if (logout()) {
            navigate("/login");
          }
          return;
        }
        setUserProfile(updatedFormData);
        sessionStorage.setItem("userProfile", JSON.stringify(updatedFormData));
        navigate("/admin-dashboard");
      }
    } catch (err) {
      console.error("Error creating profile:", err);
      toast.error("Failed to create profile");
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "tween", duration: 0.5 }}
    >
      <button onClick={() => navigate(-1)} className="mx-10">
        <svg className="w-6 h-6 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12l4-4m-4 4 4 4" /></svg>
      </button>

      <UserForm
        imageFile={profileImage} setImageFile={setProfileImage}
        handleSubmit={handleSubmit}
        error={error}
        handleChange={handleChange}
        formData={formData}
        setFormData={setFormData}
        datepickerRef={datepickerRef}
        auth={false}
        submitting={submitting}
      />
    </motion.div>
  );
};

export default CreateProfile;
