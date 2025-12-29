import { useEffect, useState } from 'react';
import flatpickr from 'flatpickr';
import "flatpickr/dist/flatpickr.min.css";
import "./flatpickroverrides.css";
import DragAndDrop from '../../../components/DragAndDrop';

export const UserForm = ({ error, handleSubmit, handleChange, formData, setFormData, datepickerRef, authorized, submitting = false, imageFile, setImageFile, title = "Create your profile" }) => {

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
          const formattedDate = selectedDates[0]?.toISOString() || '';
          setFormData((prev) => ({ ...prev, doB: formattedDate }));
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
              {authorized ? "Staff Name" : "Your Full Name"}
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="John Doe"
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
              <option value="" disabled>Select Role</option>
              <option disabled={!authorized} value="admin">Admin (Manager)</option>
              <option value="staff">Staff (Mechanic/Worker)</option>
            </select>
          </div>

          {/* Specialization / Job Title - Optional replacement for Department */}
          <div className="col-span-1">
            <label className="block mb-2 font-medium text-black dark:text-white">Specialization / Job Title</label>
            <input
              type="text"
              placeholder="e.g. Senior Mechanic"
              className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none text-black dark:bg-meta-5 dark:border-form-strokedark dark:text-white"
              name="specialization"
              value={formData.specialization || ""}
              onChange={handleChange}
            />
          </div>

          {/* Email - Show if authorized (Admin creating user) or if editing */}
          {authorized && <div className="col-span-1">
            <label className="block mb-2 font-medium text-black dark:text-white">Email</label>
            <div className="relative">
              <input
                type="email"
                placeholder="someone@example.com"
                className={`w-full rounded-lg border bg-transparent py-3 px-4 outline-none text-black dark:bg-meta-5 dark:text-white ${error.email ? "border-red" : "border-stroke dark:border-form-strokedark focus:border-primary"}`} name='email' value={formData.email} onChange={handleChange} required autoComplete='off'
              />
            </div>
            {error.emailError && <p className='mt-2 text-sm text-red-600 dark:text-red-500'><span className='font-medium'>Oops!  </span> {error.emailError}</p>}
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
        </div>

        <div className="pt-4 flex flex-col items-center w-full">
          <button disabled={submitting} type="submit" className={`w-full sm:w-auto sm:min-w-[12rem] text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-slate-900 dark:text-white dark:border-gray-600 dark:hover:bg-slate-950 dark:hover:border-gray-600 dark:focus:ring-gray-700 shadow-lg shadow-slate-900/10 dark:shadow-black/40 ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}>
            <p className='font-bold'>{submitting ? "Saving..." : "Submit"}</p>
          </button>
        </div>
      </form>
    </div>

  );
};
