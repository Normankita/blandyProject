import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import useTitle from '../../hooks/useTitle';
import { useData } from '@/contexts/DataContext';
import { UserForm } from './components/UserForm';

const RegisterAdmin = () => {
  useTitle("Register");
  const { addData, uploadFile } = useData();
  const datepickerRef = useRef(null);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const [error, setError] = useState({
    fullNameError: "",
    doBError: "",
    doJError: "",
    genderError: "",
    maritalStatError: "",
    roleError: "",
    regionError: "",
    isActiveError: "",
    NIDError: "",
    mobNoError: "",
    emailError: "",
    passwordError: "",
  });

  const [formData, setFormData] = useState({
    fullName: "",
    firstName: "",
    lastName: "",
    doB: "",
    gender: "",
    role: "",
    region: "",
    isActive: "active",
    mobNo: "",
    email: "",
    password: "",
    repassword: "",
    category: "",
    secretpass: "",
    department: "",
  });

  const ensureNumber = (confusedString) => confusedString.replace(/[^0-9]/g, '');

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobNo") {
      if (value.length <= 13) {
        if (value.length <= 4 || value.slice(0, 4) === "+255") {
          setFormData((prev) => ({ ...prev, [name]: "+".concat(ensureNumber(value)) }));

          if (value.length !== 13) {
            if (value.length <= 4 && value.slice(0, 4) !== "+255") {
              setError((prev) => ({ ...prev, mobNoError: "Invalid Country Code" }));
            } else {
              setError((prev) => ({ ...prev, mobNoError: "Phone number incomplete" }));
            }
          } else {
            setError((prev) => ({ ...prev, mobNoError: "" }));
          }
        }
      }
    } else if (name === "password") {
      let point = 0;
      if (value.length >= 6) {
        let arrayTest = [/[0-9]/, /[a-z]/, /[A-Z]/, /[^0-9a-zA-Z]/];
        arrayTest.forEach((item) => { if (item.test(value)) point++; });
      }
      setError((prev) => ({
        ...prev,
        passwordError: point < 4 ? " Weak Password " : ""
      }));
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else if (name === "repassword") {
      setError((prev) => ({
        ...prev,
        passwordError: value !== formData.password ? " Passwords do not match! " : ""
      }));
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      if (name === "fullName") {
        const fullNamecon = value.trim().split(" ");
        if (fullNamecon.length === 3) {
          setError((prev) => ({ ...prev, fullNameError: "" }));
        } else {
          setError((prev) => ({ ...prev, fullNameError: "Must Have three names" }));
        }
      }
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

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

    const names = formData.fullName.trim().split(" ");
    const firstName = names[0];
    const lastName = names[names.length - 1];

    const userData = {
      uid: null,
      name: formData.fullName,
      role: formData.role,
      doB: formattedDoB,
      gender: formData.gender,
      status: formData.isActive,
      region: formData.region,
      mobNo: formData.mobNo,
      email: formData.email,
      createdAt: new Date().toISOString(),
      category: formData.category,
      photoUrl, // include uploaded photo URL
      secretpass: formData.secretpass,
      department: formData.department,
    };

    try {
      await addData("users", userData);
      toast.success("User successfully added to Firestore.");
      setSubmitting(false);

      setFormData({
        fullName: "",
        firstName: "",
        lastName: "",
        doB: "",
        gender: "",
        role: "",
        region: "",
        isActive: false,
        mobNo: "",
        email: "",
        password: "",
        repassword: "",
        category: ""
      });
      setProfileImage(null);

      navigate("/Users");
    } catch (error) {
      console.error("Firestore write error:", error);
      toast.error("Failed to save user. Please try again.");
      setSubmitting(false);
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
