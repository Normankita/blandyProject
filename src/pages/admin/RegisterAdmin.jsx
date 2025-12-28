import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import useTitle from '../../hooks/useTitle';
import { useData } from '@/contexts/DataContext';
import { UserForm } from './components/UserForm';

const RegisterAdmin = () => {
  const [currentUsers, setCurrentUsers] = useState([]);
  useTitle("Register");
  const { addData, uploadFile, fetchData } = useData();
  const datepickerRef = useRef(null);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetchData({ path: "users" })
      .then((response) => {
        setCurrentUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  const [error, setError] = useState({
    fullNameError: "",
    doBError: "",
    genderError: "",
    roleError: "",
    isActiveError: "",
    mobNoError: "",
    emailError: "",
    passwordError: "",
  });

  const [formData, setFormData] = useState({
    fullName: "",
    doB: "",
    gender: "",
    role: "",
    isActive: "active",
    mobNo: "",
    email: "",
    specialization: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobNo") {
      const cleaned = '+' + value.replace(/[^0-9]/g, '').slice(0, 12);
      setFormData((prev) => ({ ...prev, [name]: cleaned }));

      if (cleaned.length !== 13) {
        setError((prev) => ({ ...prev, mobNoError: "Phone number incomplete" }));
      } else {
        setError((prev) => ({ ...prev, mobNoError: "" }));
      }

    } else if (name === "email") {
      setError((prev) => ({
        ...prev,
        emailError: !value.includes("@")
          ? "Invalid email"
          : currentUsers.some((user) => user.email === value)
            ? "Email already exists"
            : "",
      }));
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      if (name === "fullName") {
        const fullNamecon = value.trim().split(" ");
        if (fullNamecon.length >= 2) { // Changed to allow 2 names minimum
          setError((prev) => ({ ...prev, fullNameError: "" }));
        } else {
          setError((prev) => ({
            ...prev,
            fullNameError: "Please enter at least two names",
          }));
        }
      }

      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };


  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    if (error.fullNameError || error.doBError || error.genderError || error.roleError || error.isActiveError || error.mobNoError || error.emailError) {
      setSubmitting(false);
      toast.error("Please fill in all the required fields");
      return;
    } else {

      let photoUrl = "";

      if (profileImage) {
        const path = `profilePics/temp_${Date.now()}.jpg`;
        const uploadedUrl = await uploadFile(profileImage, path);
        if (uploadedUrl) {
          photoUrl = uploadedUrl;
        } else {
          toast.error("Failed to upload profile picture.");
          setSubmitting(false);
          return;
        }
      }

      const formattedDoB = new Date(formData.doB).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      const userData = {
        uid: null, // Let Firestore generate ID or manage it separately
        name: formData.fullName,
        role: formData.role,
        doB: formattedDoB,
        gender: formData.gender,
        status: formData.isActive,
        mobNo: formData.mobNo,
        email: formData.email,
        createdAt: new Date().toISOString(),
        photoUrl,
        specialization: formData.specialization,
      };

      try {
        await addData("users", userData);
        toast.success("User successfully added to Firestore.");
        setSubmitting(false);

        setFormData({
          fullName: "",
          doB: "",
          gender: "",
          role: "",
          isActive: "active",
          mobNo: "",
          email: "",
          specialization: "",
        });
        setProfileImage(null);

        navigate("/users");
      } catch (error) {
        console.error("Firestore write error:", error);
        toast.error("Failed to save user. Please try again.");
        setSubmitting(false);
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "tween", duration: 0.5 }}
    >
      <UserForm
        imageFile={profileImage}
        setImageFile={setProfileImage}
        handleSubmit={handleSubmit}
        error={error}
        handleChange={handleChange}
        formData={formData}
        setFormData={setFormData}
        datepickerRef={datepickerRef}
        authorized={true}
        submitting={submitting}
      />
    </motion.div>
  );
};

export default RegisterAdmin;
