import { useState, useRef } from 'react';
import Skeleton from 'react-loading-skeleton'; // ensure this is installed
import 'react-loading-skeleton/dist/skeleton.css';

const TableComponent = ({ ItemData = [], headers = [], title = "", isLoading = true }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const norow = useRef();

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

  return (
    <div className="bg-slate-50 dark:bg-slate-900 p-6 min-h-100  shadow-lg shadow-slate-900/10 dark:shadow-black/40 dark:text-gray-300 text-gray-800  rounded-sm duration-300">

      {/* Title */}
      <div className="flex justify-center items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-600 dark:text-gray-400">{title} Table</h1>
      </div>

      {/* Entries Control */}
      <form className="flex justify-center items-center mb-5">
        <div className="relative flex items-center max-w-[8rem]">
          <button onClick={(e) => { e.preventDefault(); handleNumber("minus"); }} type="button" className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-2 focus:outline-none">
            <svg className="w-3 h-3 text-gray-900 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
              <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M1 1h16" />
            </svg>
          </button>

          <input ref={norow} onChange={handleEntriesChange} type="text" className="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-sm text-gray-900 block w-full dark:bg-gray-700 dark:text-white" defaultValue={entriesPerPage} min="1" />

          <button onClick={(e) => { e.preventDefault(); handleNumber("add"); }} type="button" className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-2 focus:outline-none">
            <svg className="w-3 h-3 text-gray-900 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
              <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M9 1v16M1 9h16" />
            </svg>
          </button>
        </div>
      </form>

      {/* Table */}
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              {headers.map((heading) =>
                (heading !== "password" && heading !== "repassword") && (
                  <th key={heading} className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                    {heading}
                  </th>
                )
              )}
              <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              [...Array(entriesPerPage)].map((_, index) => (
                <tr key={index}>
                  {headers.map((header) =>
                    header !== "password" && header !== "repassword" && (
                      <td key={header} className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                        <Skeleton height={20} />
                      </td>
                    )
                  )}
                  <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                    <Skeleton width={80} height={20} />
                  </td>
                </tr>
              ))
            ) : (
              paginatedData.map((item, key) => (
                <tr key={key}>
                  {headers.map((field) =>
                    (field !== "password" && field !== "repassword") ? (
                      field === "status" ? (
                        <td key={field} className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <p className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${item.status === 1 ? 'bg-success text-success' : item.status === 2 ? 'bg-danger text-danger' : 'bg-warning text-warning'}`}>
                            {item.status === 0 ? "Created" : item.status === 1 ? "Active" : "Inactive"}
                          </p>
                        </td>
                      ) : (
                        <td key={field} className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                          <h5 className="font-medium text-black dark:text-white">{item[field]}</h5>
                        </td>
                      )
                    ) : null
                  )}
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      {/* Action buttons here */}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center my-4">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300' : 'bg-yellow-500 text-white'}`}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-300' : 'bg-yellow-500 text-white'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TableComponent;
