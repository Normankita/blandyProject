import React, { useEffect, useState }  from 'react';
import { motion } from 'framer-motion';

import useTitle from '../../hooks/useTitle';
// import from "react";

const Requests = () => {
  useTitle("Site Queries"); // Custom hook to set the document title


  
  const [selectedMessage, setSelectedMessage] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: "100%" }}
      exit={{ opacity: 0 }}
      transition={{ type: "tween", duration: 0.5 }}
    >
      <div className="flex h-screen bg-slate-50 dark:bg-slate-900 p-6 min-h-100  shadow-lg shadow-slate-900/10 dark:shadow-black/40 my-10 dark:text-gray-300 text-gray-800 duration-300 mr-3 rounded-sm duration-300">
      {/* Left Sidebar - Message List */}
      <div className="w-1/3 backdrop-blur-3xl border-0 border-r border-gray-400 dark:border-gray-700 rounded-l-lg overflow-y-auto p-4">
        <h2 className="text-lg font-semibold mb-4">Site Queries</h2>
        <ul>
          {messages.map((msg) => (
            <li
              key={msg.id}
              className="p-3 border-b  border-gray-400 dark:border-gray-700cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => setSelectedMessage(msg)}
            >
              <p className="font-semibold">{msg.sender}</p>
              <p className="text-sm text-gray-700 dark:text-gray-400">{msg.subject}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Section - Message View */}
      <div className="w-2/3 p-6">
        {selectedMessage ? (
          <div className='  bg-white dark:bg-slate-950 h-full p-8 duration-300'>
            <h2 className="text-xl font-semibold mb-2">{selectedMessage.subject}</h2>
            <p className="text-gray-700 dark:text-gray-400 mb-4">From: {selectedMessage.sender} <span className='text-sm'>( {selectedMessage.email} )</span></p>
            <p>{selectedMessage.content}</p>
          </div>
        ) : (
          <p className="text-gray-500">Select a message to view</p>
        )}
      </div>
    </div>

    </motion.div>
  );
};

export default Requests;