import { useEffect, useState } from 'react';
import flatpickr from 'flatpickr';
import "flatpickr/dist/flatpickr.min.css";
import { useNavigate } from 'react-router-dom';
import "./flatpickroverrides.css";
import DragAndDrop from '../../../components/DragAndDrop';
import { useData } from '@/contexts/DataContext';




export const UserForm = ({ error, handleSubmit, handleChange, formData, setFormData, datepickerRef, authorized, submitting=false, imageFile, setImageFile, title="Create your profile" }) => {
  const { fetchData } = useData();


  const [departments, setDepartments] = useState();


  useEffect(() => {
    const data = handleFetchDepartments();
    data.then((fetchedDepartments) => {
      setDepartments(fetchedDepartments);
    });
  }, []);

  const handleFetchDepartments = async () => {
    try {
      const { data } = await fetchData({ path: 'departments' });
      return data;
    } catch (error) {
      console.error("Error fetching departments:", error);
      return [];
    }
  };

  const navigate = useNavigate();
  useEffect(() => {
    if (datepickerRef.current) {
      flatpickr(datepickerRef.current, {
        mode: 'single',
        static: true,
        monthSelectorType: 'static',
        dateFormat: 'M j, Y',
        prevArrow:
          '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
        nextArrow:
          '<svg className="fill-current" width="7" height="11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
        onChange: (selectedDates) => {
          const formattedDate = selectedDates[0]?.toISOString() || ''; // Format date
          setFormData((prev) => ({ ...prev, doB: formattedDate })); // Update state
        },
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 shadow-lg mb-10 dark:text-gray-300 text-gray-800 rounded-sm duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-black dark:text-white md:text-title-xl2">
          {authorized ? "Create New User" : title}
        </h2>
        <div className="w-full sm:w-1/2 md:w-1/5 md:mr-10">
          <DragAndDrop imageFile={imageFile} setImageFile={setImageFile} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          <div className="col-span-1">
            <label className={`block mb-2 font-medium ${error.fullNameError ? "text-red" : "text-black dark:text-white"}`}>
              {authorized ? "Member Name" : "Your full names (3)"}
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="John middle Doe"
                className={`w-full rounded-lg border bg-transparent py-3 px-4 outline-none text-black dark:bg-meta-5 dark:text-white ${error.fullNameError ? "border-red" : "border-stroke dark:border-form-strokedark focus:border-primary"}`}
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              {error.fullNameError && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                  <span className="font-medium">Oops! </span> {error.fullNameError}
                </p>
              )}
            </div>
          </div>

          <div className="col-span-1">
            <label className="block mb-2 font-medium text-black dark:text-white">Date of Birth</label>
            <input
              name="doB"
              ref={datepickerRef}
              className="w-full rounded border border-stroke bg-transparent px-4 py-3 outline-none text-black dark:bg-form-input dark:border-form-strokedark dark:text-white focus:border-primary"
              placeholder="mm/dd/yyyy"
            />
          </div>

          <div className="col-span-1">
            <label className="block mb-2 font-medium text-black dark:text-white">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none text-black dark:bg-meta-5 dark:border-form-strokedark dark:text-white"
            >
              <option disabled value="">Select your gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="col-span-1">
            <label className={`block mb-2 font-medium ${error.mobNoError ? "text-red" : "text-black dark:text-white"}`}>Mobile Number</label>
            <div className="relative">
              <input
                type="tel"
                placeholder="+255123456789"
                className={`w-full rounded-lg border bg-transparent py-3 px-4 outline-none text-black dark:bg-meta-5 dark:text-white ${error.mobNoError ? "border-red" : "border-stroke dark:border-form-strokedark focus:border-primary"}`}
                name="mobNo"
                value={formData.mobNo}
                onChange={handleChange}
                required
              />
              {error.mobNoError && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                  <span className="font-medium">Oops! </span> {error.mobNoError}
                </p>
              )}
            </div>
          </div>

          <div className="col-span-1">
            <label className="block mb-2 font-medium text-black dark:text-white">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none text-black dark:bg-slate-900 dark:border-form-strokedark dark:text-white"
            >
              <option value="" disabled>Role</option>
              <option disabled={!authorized} value="admin">Admin</option>
              <option value="student">Student</option>
              <option value="staff">Staff</option>
              <option disabled value="Alumni">Alumni</option>
            </select>
          </div>

          {/* Coordinator specification */}
          {authorized &&formData.role==="staff" && (
            <div className="col-span-1">
              <label className="block mb-2 font-medium text-black dark:text-white">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none text-black dark:bg-slate-900 dark:border-form-strokedark dark:text-white"
              >
                <option value="" disabled>Privelege</option>
                <option disabled={!authorized} value="coordinator">Coordinator</option>
              </select>
            </div>
          )}

          {formData.role === "student" && (
            <>
              <div className="col-span-1">
                <label className={`block mb-2 font-medium ${error.registrationNumber ? "text-red" : "text-black dark:text-white"}`}>Registration Number</label>
                <input
                  type="text"
                  name="registrationNumber"
                  placeholder="T-XXXXX"
                  className={`w-full rounded-lg border bg-transparent py-3 px-4 outline-none text-black dark:bg-meta-5 dark:text-white ${error.registrationNumber ? "border-red" : "border-stroke dark:border-form-strokedark focus:border-primary"}`}
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  required
                />
                {error.registrationNumber && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span className="font-medium">Oops! </span> {error.registrationNumber}
                  </p>
                )}
              </div>

              <div className="col-span-1">
                <label className={`block mb-2 font-medium ${error.program ? "text-red" : "text-black dark:text-white"}`}>Program Name</label>
                <input
                  type="text"
                  name="program"
                  placeholder="Bachelor of Science in IT"
                  className={`w-full rounded-lg border bg-transparent py-3 px-4 outline-none text-black dark:bg-meta-5 dark:text-white ${error.program ? "border-red" : "border-stroke dark:border-form-strokedark focus:border-primary"}`}
                  value={formData.program}
                  onChange={handleChange}
                  required
                />
                {error.program && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span className="font-medium">Oops! </span> {error.program}
                  </p>
                )}
              </div>
            </>
          )}

          {/* user email */}

          {authorized && <div className="col-span-1">
            <label className="block mb-2 font-medium text-black dark:text-white">Email</label>
            <div className="relative">
              <input
                type="email"
                placeholder="someone@example.com"
                className={`w-full rounded-lg border bg-transparent py-3 px-4 outline-none text-black dark:bg-meta-5 dark:text-white ${error.email ? "border-red" : "border-stroke dark:border-form-strokedark focus:border-primary"}`} name='email' value={formData.email} onChange={handleChange} required autoComplete='off'
              />
              <span className="absolute right-4 top-4">
                <svg
                  className="fill-current"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g opacity="0.5">
                    <path
                      d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                      fill=""
                    />
                  </g>
                </svg>
              </span>
            </div>
            {error.emailError && <p className='mt-2 text-sm text-red-600 dark:text-red-500'><span className='font-medium'>Oops!  </span> {error.emailError}</p>}
            <span className='absolute right-4 top-4'>
              <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M18.427 14.768 17.2 13.542a1.733 1.733 0 0 0-2.45 0l-.613.613a1.732 1.732 0 0 1-2.45 0l-1.838-1.84a1.735 1.735 0 0 1 0-2.452l.612-.613a1.735 1.735 0 0 0 0-2.452L9.237 5.572a1.6 1.6 0 0 0-2.45 0c-3.223 3.2-1.702 6.896 1.519 10.117 3.22 3.221 6.914 4.745 10.12 1.535a1.601 1.601 0 0 0 0-2.456Z" />
              </svg>

            </span>
          </div>}

          {authorized && <div className="col-span-1">
            <label className="block mb-2 font-medium text-black dark:text-white">Secret Key</label>
            <div className="relative">
              <input
                type="text"
                placeholder="secret key"
                className={`w-full rounded-lg border bg-transparent py-3 px-4 outline-none text-black dark:bg-meta-5 dark:text-white ${error.secretpass ? "border-red" : "border-stroke dark:border-form-strokedark focus:border-primary"}`} name='secretpass' value={formData.secretpass} onChange={handleChange} required autoComplete='off'
              />
              
            </div>
            {error.secretpassError && <p className='mt-2 text-sm text-red-600 dark:text-red-500'><span className='font-medium'>Oops!  </span> {error.secretpassError}</p>}
            <span className='absolute right-4 top-4'>
              <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M18.427 14.768 17.2 13.542a1.733 1.733 0 0 0-2.45 0l-.613.613a1.732 1.732 0 0 1-2.45 0l-1.838-1.84a1.735 1.735 0 0 1 0-2.452l.612-.613a1.735 1.735 0 0 0 0-2.452L9.237 5.572a1.6 1.6 0 0 0-2.45 0c-3.223 3.2-1.702 6.896 1.519 10.117 3.22 3.221 6.914 4.745 10.12 1.535a1.601 1.601 0 0 0 0-2.456Z" />
              </svg>

            </span>
          </div>}


          {/* Status */}
          {authorized &&
            <div className='col-span-1'>
              <label className="block mb-2 font-medium text-black dark:text-white">User Status</label>
              <select
                className={`w-full rounded-lg border bg-transparent py-3 px-4 outline-none text-black dark:bg-meta-5 dark:text-white ${error.status ? "border-red" : "border-stroke dark:border-form-strokedark focus:border-primary"}`} name='isActive' value={formData.isActive} onChange={handleChange} required
              >
                <option value="" disabled>Status</option>
                <option value="active" >Active</option>
                <option value="inactive">In-Active</option>
              </select>
            </div>}

          {formData.role !== "admin" && (
            <div className="col-span-1">
              <label className={`block mb-2 font-medium ${error.department ? "text-red" : "text-black dark:text-white"}`}>Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className={`w-full rounded-lg border bg-transparent py-3 px-4 outline-none text-black dark:bg-meta-5 dark:text-white ${error.department ? "border-red" : "border-stroke dark:border-form-strokedark focus:border-primary"}`}
              >
                <option value="">Select Department</option>
                {Array.isArray(departments) &&
                  departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
              </select>
              {error.department && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                  <span className="font-medium">Oops! </span> {error.department}
                </p>
              )}
            </div>
          )}

          {formData.role === "student" && (
            <div className="col-span-1">
              <label className={`block mb-2 font-medium ${error.gitHubUrl ? "text-red" : "text-black dark:text-white"}`}>GitHub URL</label>
              <input
                type="url"
                name="gitHubUrl"
                placeholder="https://github.com/yourusername"
                className={`w-full rounded-lg border bg-transparent py-3 px-4 outline-none text-black dark:bg-meta-5 dark:text-white ${error.gitHubUrl ? "border-red" : "border-stroke dark:border-form-strokedark focus:border-primary"}`}
                value={formData.gitHubUrl}
                onChange={handleChange}
              />
              {error.gitHubUrl && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                  <span className="font-medium">Oops! </span> {error.gitHubUrl}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="pt-4 flex flex-col items-center w-full">
          <button disabled={submitting} type="submit" className={`w-xl text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-slate-900 dark:text-white dark:border-gray-600 dark:hover:bg-slate-950 dark:hover:border-gray-600 dark:focus:ring-gray-700 shadow-lg shadow-slate-900/10 dark:shadow-black/40 ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}>
            <p className='font-bold'>Submit</p>
          </button>
        </div>
      </form>
    </div>

  );
};
