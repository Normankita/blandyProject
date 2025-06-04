import { useEffect, useState }  from 'react';
import MessagingTemplate from './MessagingTemplate';

const Invoice = () => {// Custom hook to set the document title
  const messages = []


  
  const [selectedMessage, setSelectedMessage] = useState(null);

  return (
    <>
      <div className="flex  bg-slate-50 dark:bg-slate-900 p-6 min-h-150 max-h-screen overflow-auto  shadow-lg shadow-slate-900/10 dark:shadow-black/40 dark:text-gray-300 text-gray-800  rounded-sm duration-300">
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
          <p className="text-gray-500">Select a message to view
          <MessagingTemplate/>
          </p>
          
        )}
      </div>
    </div>

    </>
  );
};

export default Invoice;