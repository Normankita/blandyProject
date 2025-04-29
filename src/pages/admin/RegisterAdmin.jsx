import { useRef, useState } from 'react';
import { UserForm } from './components/UserForm';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import useTitle from '../../hooks/useTitle';
import DragAndDrop from '../components/DragAndDrop';
const RegisterAdmin= () => {
  useTitle("Register"); // Custom hook to set the document title

  const datepickerRef = useRef(null);  // Ref for the input
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
  
    const [error, setError] = useState({
      fullNameError: "",
      doBError: "",
      doJError: "",
      genderError: "",
      maritalStatError: "",
      categoryError: "",
      regionError: "",
      isActiveError: "",
      NIDError: "",
      mobNoError: "",
      emailError: "",
    });
  
    const [formData, setFormData] = useState({
      fullName: "",
      firstName:'',
      lastName:'',
      doB: "",
      gender: "",
      category: "",
      region: "",
      isActive: false,
      mobNo: "",
      email: "",
      password: "",
      repassword: ""
    });
  
  
    const ensureNumber = (confusedString) => {
  
      return confusedString.replace(/[^0-9]/g, '');
    };
  
    const handleChange = (e) => {
  
      const { name, value } = e.target;
  
      if (name === "NID") {
  
      } else {
        if (name === "mobNo") {
          if (value.length <= 13) {
            if (value.length <= 4 || value.slice(0, 4) === "+255") {
              setFormData((prev) => ({ ...prev, [name]: "+".concat(ensureNumber(value)) }));
  
  
              if (value.length !== 13) {
                if (value.length <= 4 && value.slice(0, 4) !== "+255") {
                  setError((prev) => ({ ...prev, mobNoError: "Invalid Country Code" }));
                } else setError((prev) => ({ ...prev, mobNoError: "Phone number incomplete" }));
              }
              else {
                setError((prev) => ({ ...prev, mobNoError: "" }));
  
              }
            }
          }
        } else {
  
          if (name === "password") {
           
            let point = 0;  
            if (value.length >= 6) {
              let arrayTest =
                [/[0-9]/, /[a-z]/, /[A-Z]/, /[^0-9a-zA-Z]/];
              arrayTest.forEach((item) => {
                if (item.test(value)) {
                  point += 1;
                }
              });
            }
            if (point < 4) {
              setError((prev) => ({ ...prev, passwordError: " Weak Password " }));
            } else {
              setError((prev) => ({ ...prev, passwordError: "" }));
            }
          
  
            setFormData((prev) => ({ ...prev, [name]: value }));
  
  
          } if (name === "repassword") {
  
            if (value !== formData.password) {
              setError((prev) => ({ ...prev, passwordError: " Passwords do not match! " }));
            } else {
              setError((prev) => ({ ...prev, passwordError: "" }));
            }
  
            setFormData((prev) => ({ ...prev, [name]: value }));
  
  
          }
          else {
            if (name === "fullName") {
              const fullNamecon = value.trim().split(" ");
              if (fullNamecon.length === 3) {
                setError((prev) => ({ ...prev, fullNameError: "" }));
                console.log("I am complete");
  
              }
              else {
                setError((prev) => ({ ...prev, fullNameError: "Must Have three names" }));
                console.log(error.fullNameError);
              }
            }
            setFormData((prev) => ({ ...prev, [name]: value }));
          }
  
  
        }
  
      }
  
    };
  
    async function handleSubmit(e) {
      e.preventDefault();
    setSubmitting(true)
      // Format the date of birth
      const formattedDoB = new Date(formData.doB).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    
      const names = formData.fullName.split(" ");
      
      // Create a new object with updated data
      const updatedFormData = { 
        ...formData, 
        doB: formattedDoB, 
        firstName: names[0], 
        lastName: names.length > 1 ? names[names.length - 1] : "" 
      };
    
      setFormData(updatedFormData);
    
      try {
        const {user, token} = await register(updatedFormData.email, updatedFormData.password);
if(user && token) {
          // Creating user in the user database table logic goes here
        toast.success("Registration successful!");
        setSubmitting(false)
        
        // Clear form on success
        setFormData({
          fullName: "",
          doB: "",
          gender: "",
          category: "",
          region: "",
          isActive: "",
          mobNo: "",
          email: "",
          password: "",
          repassword: "",
        });
        
        navigate("/Users"); // Redirect user after successful registration
        }
      } catch (error) {
        console.log("this is the error",error)
        setSubmitting(false)
    
        if (error.reason && typeof error.reason === "object") {
          // Map API errors to corresponding form fields
          setError((prev) => ({
            ...prev,
            fullNameError: error.reason.firstName ? error.reason.firstName[0] : error.reason.lastName ? error.reason.lastName[0]: "",
            doBError: error.reason.doB ? error.reason.doB[0] : "",
            genderError: error.reason.gender ? error.reason.gender[0] : "",
            categoryError: error.reason.category ? error.reason.category[0] : "",
            regionError: error.reason.region ? error.reason.region[0] : "",
            isActiveError: error.reason.isActive ? error.reason.isActive[0] : "",
            mobNoError: error.reason.mobNo ? error.reason.mobNo[0] : "",
            emailError: error.reason.email ? error.reason.email[0] : "",
            passwordError: error.reason.password ? error.reason.password[0] : "",
          }));
    
          toast.error("Please fix the errors and try again.");
        } else {
          toast.error("An unexpected error occurred. Please try again.");
          setSubmitting(false)
        }
      }
    }
    
  
  
  

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: "100%" }}
      exit={{ opacity: 0 }}
      transition={{ type: "tween", duration: 0.5 }}
    >
      <DragAndDrop/>
      <UserForm
              handleSubmit={handleSubmit}
              // splitNida={splitNida}
              error={error}
              handleChange={handleChange}
              formData={formData}
              setFormData={setFormData}
              datepickerRef={datepickerRef}
              auth={true}
              submitting={submitting}
            />
    </motion.div>
  );
};

export default RegisterAdmin


