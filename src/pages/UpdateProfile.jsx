import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserForm } from './admin/components/UserForm';
import { serverTimestamp } from 'firebase/firestore';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';

// Format Date object or ISO string into YYYY-MM-DD
const formatDateInput = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0]; // YYYY-MM-DD
};

const UpdateProfile = () => {
  const { updateData, uploadFile, deleteFile, setUserProfile, userProfile, loading:submitting, setLoading:setSubmitting } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const datepickerRef = useRef(null);

  const [profileImage, setProfileImage] = useState(userProfile.photoUrl || null);
  const [error, setError] = useState({
    fullNameError: '',
    doBError: '',
    genderError: '',
    maritalStatError: '',
    roleError: '',
    regionError: '',
    isActiveError: '',
    mobNoError: '',
    emailError: '',
    passwordError: '',
    department: '',
    program: '',
    gitHubUrl: '',
  });

  const [formData, setFormData] = useState({
    fullName: userProfile.name || '',
    doB: formatDateInput(userProfile?.doB),
    gender: userProfile.gender || '',
    role: userProfile.role || '',
    isActive: userProfile.isActive || false,
    mobNo: userProfile.mobNo || '',
    department: userProfile.department || '',
    program: userProfile.program || '',
    gitHubUrl: userProfile.gitHubUrl || '',
    photoUrl: userProfile.photoUrl || '',
    registrationNumber: userProfile.registrationNumber || '',
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

      default:
        setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!user?.uid) {
      toast.error('User not authenticated');
      setSubmitting(false);
      return;
    }

    let photoUrl = userProfile.photoUrl;

    try {
      if (profileImage && profileImage !== userProfile.photoUrl) {
        if (userProfile.photoUrl) {
          await deleteFile(userProfile.photoUrl);
        }
        const path = `profilePics/${user.uid}.jpg`;
        const uploadedUrl = await uploadFile(profileImage, path);
        if (!uploadedUrl) throw new Error('Image upload failed');
        photoUrl = uploadedUrl;
      }

      const dobDate = new Date(formData.doB);
      if (isNaN(dobDate)) {
        toast.error('Invalid Date of Birth');
        setSubmitting(false);
        return;
      }

      const {
        password,
        repassword,
        fullName,
        ...rest
      } = formData;

      const updatedData = {
        ...rest,
        name: fullName.trim(),
        doB: dobDate.toISOString(),
        uid: user.uid,
        email: user.email,
        photoUrl,
        updatedAt: serverTimestamp(),
      };

      await updateData('users', user.uid, updatedData);
      setUserProfile(updatedData);
      sessionStorage.setItem('userProfile', JSON.stringify(updatedData));
      toast.success('Profile updated! Redirecting...');
      setTimeout(() => navigate(-1), 1000);
    } catch (err) {
      console.error('Error Updating profile:', err);
      toast.error('Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <UserForm
        imageFile={profileImage}
        setImageFile={setProfileImage}
        handleSubmit={handleSubmit}
        error={error}
        handleChange={handleChange}
        formData={formData}
        setFormData={setFormData}
        datepickerRef={datepickerRef}
        auth={false}
        submitting={submitting}
        title={'Update Profile'}
      />
    </section>
  );
};

export default UpdateProfile;
