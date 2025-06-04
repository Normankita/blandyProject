import { useEffect, useState } from 'react';
import MessagingTemplate from './MessagingTemplate';
import { Button } from '@/components/ui/button';

const Invoice = () => {// Custom hook to set the document title
  const messages = [];



  const [selectedMessage, setSelectedMessage] = useState(null);

  return (
    <>
      <div className="flex  bg-slate-50 dark:bg-slate-900 p-6 min-h-150 max-h-screen overflow-auto  shadow-lg shadow-slate-900/10 dark:shadow-black/40 dark:text-gray-300 text-gray-800  rounded-sm duration-300">
        {/* Left Sidebar - Message List */}
        <div className="w-1/3 backdrop-blur-3xl border-0 border-r border-gray-400 dark:border-gray-700 rounded-l-lg overflow-y-auto p-4">
          <div className='flex items-center justify-between'>
            <h2 className="text-lg font-semibold mb-4">Site Queries</h2>
            <Button className={'bg-slate-200 dark:bg-slate-800 hover:bg-gray-100'} onClick={() => setSelectedMessage(null)}>
              <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </Button>
          </div>
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
            <p className="text-gray-500">Select a message to view
              <MessagingTemplate />
            </p>

          )}
        </div>
      </div>

    </>
  );
};

export default Invoice;