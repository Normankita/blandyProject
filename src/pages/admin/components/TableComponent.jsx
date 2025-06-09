import { useState, useRef, useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

/**
 * A table component with sorting and pagination.
 * 
 * @param {Object[]} ItemData - The data to be displayed in the table.
 * @param {string[]} headers - The header fields of the table.
 * @param {string} title - The title of the table.
 * @param {boolean} isLoading - If the data is loading.
 * @param {string[]} excludeFields - The fields to be excluded from the table.
 * @param {Object} transformFields - An object with functions to transform the data in each field.
 * @param {Object} headerLabels - An object with the labels for each header.
 * @param {Function} customActions - A function that returns the custom action buttons for each row.
*/
const TableComponent = ({
  ItemData = [],
  headers = [],
  title = "",
  isLoading = false,
  excludeFields = [],
  transformFields = {},
  headerLabels = {},
  customActions = () => null,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const norow = useRef();

  const count = 0;

  const visibleHeaders = useMemo(() => {
    return headers.filter(
      (h) => !excludeFields.includes(h) && h !== 'password' && h !== 'repassword'
    );
  }, [headers, excludeFields]);

  const handleEntriesChange = () => {
    const newEntries = parseInt(norow.current.value, 10);
    if (!isNaN(newEntries) && newEntries > 0) {
      setEntriesPerPage(newEntries);
      setCurrentPage(1);
    } else {
      norow.current.value = entriesPerPage;
    }
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return ItemData;
    const term = searchTerm.toLowerCase();
    return ItemData.filter(item =>
      visibleHeaders.some(
        key => item[key]?.toString().toLowerCase().includes(term)
      )
    );
  }, [ItemData, searchTerm, visibleHeaders]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / entriesPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const handleSort = (key) => {
    if (sortConfig.key === key) {
      setSortConfig(prev => ({
        key,
        direction: prev.direction === 'asc' ? 'desc' : 'asc'
      }));
    } else {
      setSortConfig({ key, direction: 'asc' });
    }
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return "⇅";
    return sortConfig.direction === 'asc' ? "↑" : "↓";
  };

  return (
    <div className="bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-950 p-6 rounded-sm dark:text-gray-300 text-gray-800 duration-300 shadow-lg shadow-slate-900/10 dark:shadow-black/40 border">
      <div className="flex justify-center items-center mb-4 ">
        <h1 className="text-2xl font-bold text-gray-600 dark:text-gray-400">{title} Table</h1>
      </div>

      <div className="flex justify-center mb-4">
        <input
          type="text"
          className="border px-4 py-2 rounded w-full max-w-sm dark:bg-gray-700 dark:text-white duration-300 shadow-lg shadow-slate-900/10 dark:shadow-black/40"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <form className="flex justify-center items-center mb-5 ">
        <div className="relative flex items-center max-w-[8rem] duration-300 shadow-lg shadow-slate-900/10 dark:shadow-black/40">
          <button onClick={(e) => { e.preventDefault(); handleNumber("minus"); }} className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-900 shadow-lg shadow-slate-900/10 dark:shadow-black/40 border border-gray-300 rounded-s-lg p-3 h-11">
            <span className="text-black dark:text-white">−</span>
          </button>
          <input ref={norow} onChange={handleEntriesChange} type="text" className="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-sm text-gray-900 block w-full dark:bg-gray-700 dark:text-white" defaultValue={entriesPerPage} />
          <button onClick={(e) => { e.preventDefault(); handleNumber("add"); }} className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-900 shadow-lg shadow-slate-900/10 dark:shadow-black/40 border border-gray-300 rounded-e-lg p-3 h-11">
            <span className="text-black dark:text-white">+</span>
          </button>
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-left ">
              <th className='cursor-pointer select-none py-4 px-4 font-medium text-black dark:text-white'>#</th>
              {visibleHeaders.map(heading => (
                <th
                  key={heading}
                  onClick={() => handleSort(heading)}
                  className="cursor-pointer select-none min-w-[110px] py-4 px-4 text-black dark:text-white font-bold uppercase text-sm "
                >
                  <span className='flex flex-col items-center'>
                    {headerLabels[heading] || heading} <span>{getSortIcon(heading)}</span>
                  </span>

                </th>
              ))}
              <th className="py-4 px-4 text-black dark:text-white flex flex-col items-center font-bold uppercase">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              [...Array(entriesPerPage)].map((_, index) => (
                <tr key={index}>
                  {visibleHeaders.map(header => (
                    <td key={header} className="border-b py-4 px-4 dark:border-strokedark ">
                      <Skeleton height={20} />
                    </td>
                  ))}
                  <td className="border-b py-4 px-4 dark:border-strokedark">
                    <Skeleton width={80} height={20} />
                  </td>
                </tr>
              ))
            ) : (
              paginatedData.map((item, key) => (
                <tr key={key}>
                  <td className='border-b py-5 px-4 dark:border-strokedark'>{key + 1}</td>
                  {visibleHeaders.map(field => (
                    <td key={field} className="truncate border-b py-5 px-4 max-w-xs dark:border-strokedark">
                      <h5 className="font-medium text-black dark:text-white">
                        {
                          transformFields[field]
                            ? transformFields[field](item[field], item)
                            : item[field]
                        }
                      </h5>
                    </td>
                  ))}
                  <td className="border-b py-1 px-4 dark:border-strokedark">
                    <div className="flex flex-row items-center ">
                      {customActions(item)}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`flex flex-row gap-2 items-center text-slate-900 bg-white border border-yellow-300 focus:outline-none hover:bg-slate-100 focus:ring-4 focus:ring-yellow-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-slate-900 dark:text-white dark:border-yellow-600 dark:hover:bg-slate-950 dark:hover:border-slate-600 dark:focus:ring-yellow-700 shadow-lg shadow-slate-900/10 dark:shadow-black/40 duration-300  ${currentPage === 1 ? 'bg-gray-300 dark:bg-gray-500 cursor-not-allowed' : 'bg-yellow-500 '} `}
        >
          <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12l4-4m-4 4 4 4" />
          </svg>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`flex flex-row gap-2 items-center text-slate-900 bg-white border border-yellow-300 focus:outline-none hover:bg-slate-100 focus:ring-4 focus:ring-yellow-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-slate-900 dark:text-white dark:border-yellow-600 dark:hover:bg-slate-950 dark:hover:border-slate-600 dark:focus:ring-yellow-700 shadow-lg shadow-slate-900/10 dark:shadow-black/40 duration-300  ${currentPage === totalPages ? 'bg-gray-300 dark:bg-gray-500 cursor-not-allowed' : 'bg-yellow-500'}`}
        >

          Next
          <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m14 0-4 4m4-4-4-4" />
          </svg>

        </button>
      </div>
    </div>
  );
};

export default TableComponent;
