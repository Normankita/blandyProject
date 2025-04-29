import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { updateUser } from "../../../services/dataService";
import PersonalInfoCard from './PersonalInfoCard';
import Skeleton from 'react-loading-skeleton';

export const Table = ({ ItemData, SetItemData, headers, title, loading=true }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [userProfile, setUserProfile] = useState({});
  const [isUser, setIsUser] = useState(false);
  const norow = useRef();

  const isSidenavOpen = useSelector(state => state.sidenavState.isSidenavOpen);
  const userData = useSelector(state=> state.userState.userState)
  const navigate = useNavigate();

  const handleEntriesChange = () => {
    const newEntries = parseInt(norow.current.value, 10);
    if (!isNaN(newEntries) && newEntries > 0) {
      setEntriesPerPage(newEntries);
      setCurrentPage(1);
    } else {
      norow.current.value = entriesPerPage;
    }
  };

  const totalPages = Math.ceil(ItemData.length / entriesPerPage);

  const paginatedData = ItemData.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleNumber = (operation) => {
    const currentValue = parseInt(norow.current.value, 10) || entriesPerPage;
    if (operation === "minus" && currentValue > 1) {
      norow.current.value = currentValue - 1;
    } else if (operation === "add") {
      norow.current.value = currentValue + 1;
    }
    handleEntriesChange();
  };

  const handleActive = async (user, active) => {
    if(userData.id !== user.id){
      user.isActive = active;
      try {
        console.log(user.id, user)
        const data = await updateUser(user.id, user);
  
        toast.success(`User ${active ? "Activated Successfully " : "Deactivated Successfully "}`);
        if (data.status === "success") {
          SetItemData((prev) => prev.map((p) => (p.id === user.id ? user : p)));
        }
      } catch (error) {
        toast.error(`Oops! failed to ${active ? "activate user " : "deactivated user "}`);
      }
    }else{
      toast.error(`Oops! Sorry, you can not ${active? 'activate': 'deactivate'} while you are the current logged in user`)
    }

  };

  const openProfile = (profile) => {
    setUserProfile(profile);
    setIsUser(true);

  };

  return (
    <div className={`rounded-sm relative border border-0 bg-slate-50 dark:bg-slate-900 px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark sm:px-7.5 xl:pb-1 shadow-lg shadow-slate-900/10 dark:shadow-black/40 my-10 dark:text-gray-300 text-gray-800 mr-3 duration-300  ${isSidenavOpen ? '' : 'lg:mx-35'}`}>
      <button
        className="mb-4 px-4 py-2 bg-blue-800 text-white rounded"
        onClick={() => navigate("/register")}
      >
        Create New User
      </button>

      {/* Title Centered */}
      <div className="flex justify-center items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-600 dark:text-gray-400">{title} Table</h1>
      </div>

      {/* Entries Per Page Centered */}
      <form className="flex justify-center items-center mb-5">
        <div className="relative flex items-center max-w-[8rem]">
          <button
            onClick={(e) => {
              e.preventDefault();
              handleNumber("minus");
            }}
            type="button"
            className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
          >
            <svg className="w-3 h-3 text-gray-900 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16" />
            </svg>
          </button>

          <input
            ref={norow}
            onChange={handleEntriesChange}
            type="text"
            className="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="5"
            defaultValue={entriesPerPage}
            min="1"
          />

          <button
            onClick={(e) => {
              e.preventDefault();
              handleNumber("add");
            }}
            type="button"
            className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
          >
            <svg className="w-3 h-3 text-gray-900 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
            </svg>
          </button>
        </div>
      </form>

      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              {headers.map((heading) => (
                (heading !== "password" && heading !== "repassword" && heading!=="createdAt" && heading!=="updatedAt" && heading!=="userId" && heading!== "lastName") && (
                  <th className="min-w-[220px] py-1 px-2 font-bold text-black dark:text-white xl:pl-11" key={heading}>
                    {heading === "isActive" ? "Status" :heading==="id"? "#": heading==="email"? "Email": heading==="firstName"? "User Name" : heading==="email"? "email": heading}
                  </th>
                )
              ))}
              <th className="py-1 px-2 font-bold text-black dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? //loading state
              (
                [...Array(entriesPerPage)].map((_, index) => (
                  <tr key={index}>
                    {headers.map((header) => (
                      <td className="border-b border-[#eee] py-1 px-2 dark:border-strokedark" key={header}>
                        <Skeleton height={20} />
                      </td>
                    ))}
                    <td className="border-b border-[#eee] py-1 px-2 dark:border-strokedark">
                      <Skeleton width={80} height={20} />
                    </td>
                  </tr>
                ))
              ) : paginatedData.map((Item, key) => (
                <tr key={key}>
                  {headers.map((single) => (
                    (single !== "password" && single !== "repassword" && single!=="createdAt" && single!=="updatedAt" && single!=="userId" && single!== "lastName") ? (
                      single === "isActive" ? (
                        <td className="border-b border-[#eee] py-1 px-2 dark:border-strokedark" key={single}>
                          <p className={`inline-flex rounded-full bg-opacity-10 py-1 px-2 text-sm font-medium ml-8 ${Item.isActive ? 'bg-green-500 dark:bg-green-700' : 'bg-red-500 dark:bg-red-700' }`}>
                            {Item.isActive? "Active" : "Not active"}
                          </p>
                        </td>
                      ) : single==="firstName"?(
                        <td className="border-b border-[#eee] py-1 px-2 dark:border-strokedark xl:pl-11" key={single}>
                        <h5 className="font-medium text-black dark:text-white">{`${Item.firstName} ${Item.lastName}`}</h5>
                      </td>
                      ):(
                        <td className="border-b border-[#eee] py-1 px-2 dark:border-strokedark xl:pl-11" key={single}>
                          <h5 className="font-medium text-black dark:text-white">{Item[single]}</h5>
                        </td>
                      )
                    ) : null
                  ))}
                  <td className="border-b border-[#eee] py-1 px-2 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      {/* Action buttons */}
                      <button>
                        <span>
                          <svg className="w-6 h-6 dark:text-white cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28" />
                          </svg>
                        </span>
                      </button>

                      <button onClick={() => openProfile(Item)}>
                        <span>
                          <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-width="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z" />
                            <path stroke="currentColor" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          </svg>
                        </span>
                      </button>



                      {Item.isActive ?
                        (<button onClick={() => handleActive(Item, false)}>
                          <span>
                            <svg className="w-6 h-6 text-red-500 cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                              <path fill-rule="evenodd" d="M8 5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H8Zm7 0a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1Z" clip-rule="evenodd" />
                            </svg>
                          </span>
                        </button>) : (
                          <button onClick={() => handleActive(Item, true)}>
                            <span>
                              <svg className="w-6 h-6 text-green-500 cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd" d="M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6l-8-6Z" clip-rule="evenodd" />
                              </svg>
                            </span>
                          </button>
                        )
                      }

                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4 mb-20">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-blue-400 dark:bg-blue-600 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-blue-400 dark:bg-blue-600 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
        >
          Next
        </button>
      </div>

      {isUser && <div onClick={()=>setIsUser(!isUser)} className="fixed inset-0 lg:inset-9 backdrop-blur-sm w-full flex items-center justify-center max-h-screen min-h-screen">
        <PersonalInfoCard userProfile={userProfile} />
      </div>}
    </div>
  );
};


