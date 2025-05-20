import { useState, useRef, useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const TableComponent = ({
  ItemData = [],
  headers = [],
  title = "",
  isLoading = false,
  excludeFields = [],
  transformFields = {},
  headerLabels = {},
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const norow = useRef();

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
    <div className="bg-slate-50 dark:bg-slate-900 p-6 shadow-lg rounded-sm dark:text-gray-300 text-gray-800 duration-300">
      {/* Title */}
      <div className="flex justify-center items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-600 dark:text-gray-400">{title} Table</h1>
      </div>

      {/* Search */}
      <div className="flex justify-center mb-4">
        <input
          type="text"
          className="border px-4 py-2 rounded w-full max-w-sm dark:bg-gray-700 dark:text-white"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Entries control */}
      <form className="flex justify-center items-center mb-5">
        <div className="relative flex items-center max-w-[8rem]">
          <button onClick={(e) => { e.preventDefault(); handleNumber("minus"); }} className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11">
            <span className="text-black dark:text-white">−</span>
          </button>
          <input ref={norow} onChange={handleEntriesChange} type="text" className="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-sm text-gray-900 block w-full dark:bg-gray-700 dark:text-white" defaultValue={entriesPerPage} />
          <button onClick={(e) => { e.preventDefault(); handleNumber("add"); }} className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11">
            <span className="text-black dark:text-white">+</span>
          </button>
        </div>
      </form>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-left">
              {visibleHeaders.map(heading => (
                <th
                  key={heading}
                  onClick={() => handleSort(heading)}
                  className="cursor-pointer select-none min-w-[220px] py-4 px-4 font-medium text-black dark:text-white"
                >
                  {headerLabels[heading] || heading} <span>{getSortIcon(heading)}</span>
                </th>
              ))}
              <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              [...Array(entriesPerPage)].map((_, index) => (
                <tr key={index}>
                  {visibleHeaders.map(header => (
                    <td key={header} className="border-b py-4 px-4 dark:border-strokedark">
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
                  {visibleHeaders.map(field => (
                    <td key={field} className="border-b py-5 px-4 dark:border-strokedark">
                      <h5 className="font-medium text-black dark:text-white">
                        {
                          transformFields[field]
                            ? transformFields[field](item[field], item)
                            : item[field]
                        }
                      </h5>
                    </td>
                  ))}
                  <td className="border-b py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      {/* Add your edit/delete buttons here */}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300 dark:bg-gray-500' : 'bg-blue-500 text-white'}`}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-300 dark:bg-gray-500' : 'bg-blue-500 text-white'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TableComponent;
