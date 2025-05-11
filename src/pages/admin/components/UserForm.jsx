import { useEffect } from 'react';
import flatpickr from 'flatpickr';
import "flatpickr/dist/flatpickr.min.css";
import { useNavigate } from 'react-router-dom';
import "./flatpickroverrides.css";
import DragAndDrop from '../../../components/DragAndDrop';



export const UserForm = ({ error, handleSubmit, handleChange, formData, setFormData, datepickerRef, authorized, submitting }) => {

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
    <div className=" min-h-screen bg-slate-50 dark:bg-slate-900 p-6 shadow-lg mb-10 dark:text-gray-300 text-gray-800 rounded-sm duration-300">

      <div className="flex flex-wrap items-center">

        <div className="w-full border-stroke dark:border-strokedark ">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
                <div className='md:col-span-6'>
                <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
              {authorized ? "Create New Member" : "Create your profile"}
            </h2>
                </div>
                <div className='col-span-6 flex justify-end'>
                  <div className='sm:w-1/2 w-full mb-2'>
                    <DragAndDrop />
                  </div>
                </div>

                {/* Full Name */}

                <div className='sm:col-span-4'>
                  <label className={`block mb-2 font-medium  ${error.fullNameError ? "text-red" : "text-black dark:text-white"}`}>{authorized ? "Member Name" : "your full names (3)"}</label>
                  <div className='relative'>
                    <input
                      type="text"
                      placeholder="John middle Doe"
                      className={`w-full rounded-lg border  bg-transparent py-4 pl-6 text-black outline-none   dark:bg-meta-5 dark:text-white ${error.fullNameError ? "border-red" : " border-stroke dark:border-form-strokedark focus:border-primary"} `} name="fullName"
                      value={formData.fullName}
                      onChange={handleChange} required
                    />
                    {error.fullNameError && <p className='mt-2 text-sm text-red-600 dark:text-red-500'><span className='font-medium'>Oops!  </span> {error.fullNameError}</p>}
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
                            d="M11.0008 9.52185C13.5445 9.52185 15.607 7.5281 15.607 5.0531C15.607 2.5781 13.5445 0.584351 11.0008 0.584351C8.45703 0.584351 6.39453 2.5781 6.39453 5.0531C6.39453 7.5281 8.45703 9.52185 11.0008 9.52185ZM11.0008 2.1656C12.6852 2.1656 14.0602 3.47185 14.0602 5.08748C14.0602 6.7031 12.6852 8.00935 11.0008 8.00935C9.31641 8.00935 7.94141 6.7031 7.94141 5.08748C7.94141 3.47185 9.31641 2.1656 11.0008 2.1656Z"
                            fill=""
                          />
                          <path
                            d="M13.2352 11.0687H8.76641C5.08828 11.0687 2.09766 14.0937 2.09766 17.7719V20.625C2.09766 21.0375 2.44141 21.4156 2.88828 21.4156C3.33516 21.4156 3.67891 21.0719 3.67891 20.625V17.7719C3.67891 14.9531 5.98203 12.6156 8.83516 12.6156H13.2695C16.0883 12.6156 18.4258 14.9187 18.4258 17.7719V20.625C18.4258 21.0375 18.7695 21.4156 19.2164 21.4156C19.6633 21.4156 20.007 21.0719 20.007 20.625V17.7719C19.9039 14.0937 16.9133 11.0687 13.2352 11.0687Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Date of Birth */}
                <div className='sm:col-span-3'>
                  <label className="block mb-2 font-medium text-black dark:text-white">Date of Birth</label>
                  <div className="relative">
                    <input
                      name='doB'
                      ref={datepickerRef}
                      className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      placeholder="mm/dd/yyyy"
                      data-classname="flatpickr-right"
                    />

                    <span className='absolute right-4 top-4'>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15.7504 2.9812H14.2879V2.36245C14.2879 2.02495 14.0066 1.71558 13.641 1.71558C13.2754 1.71558 12.9941 1.99683 12.9941 2.36245V2.9812H4.97852V2.36245C4.97852 2.02495 4.69727 1.71558 4.33164 1.71558C3.96602 1.71558 3.68477 1.99683 3.68477 2.36245V2.9812H2.25039C1.29414 2.9812 0.478516 3.7687 0.478516 4.75308V14.5406C0.478516 15.4968 1.26602 16.3125 2.25039 16.3125H15.7504C16.7066 16.3125 17.5223 15.525 17.5223 14.5406V4.72495C17.5223 3.7687 16.7066 2.9812 15.7504 2.9812ZM1.77227 8.21245H4.16289V10.9968H1.77227V8.21245ZM5.42852 8.21245H8.38164V10.9968H5.42852V8.21245ZM8.38164 12.2625V15.0187H5.42852V12.2625H8.38164V12.2625ZM9.64727 12.2625H12.6004V15.0187H9.64727V12.2625ZM9.64727 10.9968V8.21245H12.6004V10.9968H9.64727ZM13.8379 8.21245H16.2285V10.9968H13.8379V8.21245ZM2.25039 4.24683H3.71289V4.83745C3.71289 5.17495 3.99414 5.48433 4.35977 5.48433C4.72539 5.48433 5.00664 5.20308 5.00664 4.83745V4.24683H13.0504V4.83745C13.0504 5.17495 13.3316 5.48433 13.6973 5.48433C14.0629 5.48433 14.3441 5.20308 14.3441 4.83745V4.24683H15.7504C16.0316 4.24683 16.2566 4.47183 16.2566 4.75308V6.94683H1.77227V4.75308C1.77227 4.47183 1.96914 4.24683 2.25039 4.24683ZM1.77227 14.5125V12.2343H4.16289V14.9906H2.25039C1.96914 15.0187 1.77227 14.7937 1.77227 14.5125ZM15.7504 15.0187H13.8379V12.2625H16.2285V14.5406C16.2566 14.7937 16.0316 15.0187 15.7504 15.0187Z"
                          fill="#64748B"
                        />
                      </svg>
                    </span>
                  </div>
                </div>


                {/* Gender */}
                <div className='sm:col-span-5'>
                  <label className="block mb-2 font-medium text-black dark:text-white">Gender</label>
                  <select
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-meta-5 dark:text-white"
                    name='gender' value={formData.gender} onChange={handleChange} required
                  >
                    <option disabled value="">Select your gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                {/* Mobile Number */}
                <div className='sm:col-span-4'>
                  <label className={`block mb-2 font-medium  ${error.mobNoError ? "text-red" : "text-black dark:text-white"}`}>Mobile Number</label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="+255123456789"
                      className={`w-full rounded-lg border  bg-transparent py-4 pl-6 text-black outline-none   dark:bg-meta-5 dark:text-white ${error.mobNoError ? "border-red" : " border-stroke dark:border-form-strokedark focus:border-primary"} `} name='mobNo' value={formData.mobNo} onChange={handleChange} required
                    />
                    {error.mobNoError && <p className='mt-2 text-sm text-red-600 dark:text-red-500'><span className='font-medium'>Oops!  </span> {error.mobNoError}</p>}
                    <span className='absolute right-4 top-4'>
                      <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M18.427 14.768 17.2 13.542a1.733 1.733 0 0 0-2.45 0l-.613.613a1.732 1.732 0 0 1-2.45 0l-1.838-1.84a1.735 1.735 0 0 1 0-2.452l.612-.613a1.735 1.735 0 0 0 0-2.452L9.237 5.572a1.6 1.6 0 0 0-2.45 0c-3.223 3.2-1.702 6.896 1.519 10.117 3.22 3.221 6.914 4.745 10.12 1.535a1.601 1.601 0 0 0 0-2.456Z" />
                      </svg>

                    </span>
                  </div>


                </div>

                {/* Role */}
                <div className='sm:col-span-3'>
                  <label className="block mb-2 font-medium text-black dark:text-white"> role</label>
                  <select
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-meta-5 dark:text-white" name='role' value={formData.role} onChange={handleChange} required
                  >
                    <option value="" disabled>role</option>
                    <option disabled={!authorized} value="admin">Admin</option>
                    <option value="student">Student</option>
                    <option value="staff">Staff</option>
                    <option disabled value="Alumni">Alumni</option>
                  </select>
                </div>

                {/* Additionals */}

                {formData.role === "student" && (

                  <>
                    {/* Registration Number */}
                    <div className='sm:col-span-4'>
                      <label className={`block mb-2 font-medium  ${error.registrationNumber ? "text-red" : "text-black dark:text-white"}`}>registration Number</label>
                      <div className='relative'>
                        <input
                          type="text"
                          placeholder="T-XXXXX"
                          className={`w-full rounded-lg border  bg-transparent py-4 pl-6 text-black outline-none   dark:bg-meta-5 dark:text-white ${error.registrationNumber ? "border-red" : " border-stroke dark:border-form-strokedark focus:border-primary"} `} name="registrationNumber"
                          value={formData.registrationNumber}
                          onChange={handleChange} required
                        />
                        {error.registrationNumber && <p className='mt-2 text-sm text-red-600 dark:text-red-500'><span className='font-medium'>Oops!  </span> {error.registrationNumber}</p>}
                      </div>
                    </div>

                    {/* program name */}

                    <div className='sm:col-span-4'>
                      <label className={`block mb-2 font-medium  ${error.program ? "text-red" : "text-black dark:text-white"}`}>Program Name</label>
                      <div className='relative'>
                        <input
                          type="text"
                          placeholder="Bachelor of science in IT"
                          className={`w-full rounded-lg border  bg-transparent py-4 pl-6 text-black outline-none   dark:bg-meta-5 dark:text-white ${error.program ? "border-red" : " border-stroke dark:border-form-strokedark focus:border-primary"} `} name="program"
                          value={formData.program}
                          onChange={handleChange} required
                        />
                        {error.program && <p className='mt-2 text-sm text-red-600 dark:text-red-500'><span className='font-medium'>Oops!  </span> {error.program}</p>}
                      </div>
                    </div>
                  </>

                )}

                {/* Department */}
                <div className='sm:col-span-4'>
                  <label className={`block mb-2 font-medium  ${error.department ? "text-red" : "text-black dark:text-white"}`}>Department Name</label>
                  <div className='relative'>
                    <input
                      type="text"
                      placeholder="Computer Science and Engineering"
                      className={`w-full rounded-lg border  bg-transparent py-4 pl-6 text-black outline-none   dark:bg-meta-5 dark:text-white ${error.department ? "border-red" : " border-stroke dark:border-form-strokedark focus:border-primary"} `} name="department"
                      value={formData.department}
                      onChange={handleChange} required
                    />
                    {error.department && <p className='mt-2 text-sm text-red-600 dark:text-red-500'><span className='font-medium'>Oops!  </span> {error.department}</p>}
                  </div>
                </div>

                {formData.role === "student" && (
                  <>
                    {/* githubUrl */}
                    <div className='sm:col-span-4'>
                      <label className={`block mb-2 font-medium  ${error.gitHubUrl ? "text-red" : "text-black dark:text-white"}`}>github url</label>
                      <div className='relative'>
                        <input
                          type="text"
                          placeholder="John middle Doe"
                          className={`w-full rounded-lg border  bg-transparent py-4 pl-6 text-black outline-none   dark:bg-meta-5 dark:text-white ${error.gitHubUrl ? "border-red" : " border-stroke dark:border-form-strokedark focus:border-primary"} `} name="gitHubUrl"
                          value={formData.gitHubUrl}
                          onChange={handleChange} required
                        />
                        {error.gitHubUrl && <p className='mt-2 text-sm text-red-600 dark:text-red-500'><span className='font-medium'>Oops!  </span> {error.gitHubUrl}</p>}
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
                                d="M11.0008 9.52185C13.5445 9.52185 15.607 7.5281 15.607 5.0531C15.607 2.5781 13.5445 0.584351 11.0008 0.584351C8.45703 0.584351 6.39453 2.5781 6.39453 5.0531C6.39453 7.5281 8.45703 9.52185 11.0008 9.52185ZM11.0008 2.1656C12.6852 2.1656 14.0602 3.47185 14.0602 5.08748C14.0602 6.7031 12.6852 8.00935 11.0008 8.00935C9.31641 8.00935 7.94141 6.7031 7.94141 5.08748C7.94141 3.47185 9.31641 2.1656 11.0008 2.1656Z"
                                fill=""
                              />
                              <path
                                d="M13.2352 11.0687H8.76641C5.08828 11.0687 2.09766 14.0937 2.09766 17.7719V20.625C2.09766 21.0375 2.44141 21.4156 2.88828 21.4156C3.33516 21.4156 3.67891 21.0719 3.67891 20.625V17.7719C3.67891 14.9531 5.98203 12.6156 8.83516 12.6156H13.2695C16.0883 12.6156 18.4258 14.9187 18.4258 17.7719V20.625C18.4258 21.0375 18.7695 21.4156 19.2164 21.4156C19.6633 21.4156 20.007 21.0719 20.007 20.625V17.7719C19.9039 14.0937 16.9133 11.0687 13.2352 11.0687Z"
                                fill=""
                              />
                            </g>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </>
                )}



                {/* Email */}
                {authorized && <div className="sm:col-span-4">
                  <label className="block mb-2 font-medium text-black dark:text-white">Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="someone@example.com"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-meta-5 dark:text-white" name='email' value={formData.email} onChange={handleChange} required autoComplete='off'
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


                {/* Password */}
                {authorized &&
                  <>
                    <div className='sm:col-span-4'>
                      <label className={`block mb-2 font-medium  ${error.passwordError === " Weak Password " ? "text-red" : "text-black dark:text-white"}`}>Password</label>
                      <input
                        type="password" id="password"
                        placeholder="Your password"
                        className={`w-full rounded-lg border  bg-transparent py-4 pl-6 text-black outline-none   dark:bg-meta-5 dark:text-white ${error.passwordError === " Weak Password " ? "border-red" : " border-stroke dark:border-form-strokedark focus:border-primary"} `}
                        name='password' value={formData.password} onChange={handleChange} required
                      />
                      {error.passwordError === " Weak Password " && <p className='mt-2 text-sm text-red-600 dark:text-red-500'><span className='font-medium'> </span> {error.passwordError}</p>}
                    </div>

                    {/* Re-type Password */}
                    <div className='sm:col-span-4'>
                      <label className={`block mb-2 font-medium  ${error.passwordError === " Passwords do not match! " ? "text-red" : "text-black dark:text-white"}`}>Re-type Password</label>
                      <input
                        type="password"
                        placeholder="same as your password"
                        className={`w-full rounded-lg border  bg-transparent py-4 pl-6 text-black outline-none   dark:bg-meta-5 dark:text-white ${error.passwordError === " Passwords do not match! " ? "border-red" : " border-stroke dark:border-form-strokedark focus:border-primary"} `} name='repassword' value={formData.repassword} onChange={handleChange} required
                      />
                      {error.passwordError === " Passwords do not match! " && <p className='mt-2 text-sm text-red-600 dark:text-red-500'><span className='font-medium'> </span> {error.passwordError}</p>}
                    </div>
                  </>}

                {/* Member Status */}
                {authorized &&
                  <div className='sm:col-span-3'>
                    <label className="block mb-2 font-medium text-black dark:text-white">User Status</label>
                    <select
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-meta-5 dark:text-white" name='isActive' value={formData.isActive} onChange={handleChange} required
                    >
                      <option value="">Status</option>
                      <option value={true} >Active</option>
                      <option value={false}>In-Active</option>
                    </select>
                  </div>}

              </div>

              <div data-hs-strong-password='{
          "target": "#hs-strong-password-base",
          "stripClasses": "hs-strong-password:opacity-100 hs-strong-password-accepted:bg-teal-500 h-2 flex-auto rounded-full bg-yellow-500 opacity-50 mx-1"
        }' className="flex mt-2 -mx-1 sm:col-span-8 h-6"></div>

              <div>
                <input
                  type="submit"
                  value={authorized ? "create user Profile" : "Create your profile"}
                  className={`w-full ${submitting ? `cursor-not-allowed` : `cursor-pointer`} curs0r-n0t-all0wed cursor-pointer rounded-lg mb-4 px-4 py-2 bg-blue-500 lg:w-sm text-white font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                  disabled={submitting}
                />
              </div>
            </form>


          </div>
        </div>
      </div>
    </div>
  );
};
