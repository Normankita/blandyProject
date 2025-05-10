import React from 'react';
import { useNavigate } from 'react-router-dom';

const Goback = () => {
    const navigate = useNavigate();
    return (
        <button type="button" onClick={() => navigate(-1)} className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 duration-300 shadow-2xs ">
            <span className='flex flex-row'>
                <span>
                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12l4-4m-4 4 4 4" />
                    </svg>
                </span>
              
            </span>
        </button>
    );
};

export default Goback;