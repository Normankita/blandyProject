import { useEffect, useMemo, useState } from 'react';
import Man from '@/assets/avatars/man.svg';
import Woman from '@/assets/avatars/woman.svg';
import { Button } from '@/components/ui/button';
import ProjectModal from './admin/components/ProjectModal';
import { useData } from '@/contexts/DataContext';
import { toast } from 'react-toastify';

const Invoice = () => {

  const markOtherParticipantMessagesAsRead = async (conversation) => {
    if (!conversation?.messages?.length) return conversation;

    const updatedMessages = conversation.messages.map(msg => {
      if (msg.sender.email !== userProfile.email && msg.status !== "read") {
        return {
          ...msg,
          status: "read",
          readAt: new Date()
        };
      }
      return msg;
    });

    const changesMade = conversation.messages.some((msg, i) =>
      msg.status !== updatedMessages[i].status
    );

    if (!changesMade) return conversation;

    try {
      await updateData("conversations", conversation.id, { messages: updatedMessages });

      return { ...conversation, messages: updatedMessages };
    } catch (error) {
      console.error("Failed to mark messages as read:", error);
      toast.error("Failed to mark messages as read:", error);
      return conversation;
    }
  };

  // Declaring usage data
  const [usersRecipients, setUserRecipients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [newConvo, setNewConvo] = useState(null);
  const [myMessage, setMyMessage] = useState('');
  const [isConvSelected, setIsConvSelected] = useState(false);
  const [chatRecipientData, setChatRecipientData] = useState({});

  const { fetchData, fetchSnapshotData, userProfile, addData, updateData, notifications, setNotifications } = useData();

 const handleNewConvo = async (convoRecipient) => {
  const existing = conversations.find((c) =>
    Array.isArray(c.participants) &&
    c.participants.some(p => p.email === userProfile.email) &&
    c.participants.some(p => p.email === convoRecipient.email)
  );

  if (existing) {
    const updatedConvo = await markOtherParticipantMessagesAsRead(existing);
    setSelectedConversation(updatedConvo);
    const recipient = existing.participants.find(p => p.email !== userProfile.email); // changed from 'something'
    const recipientUser = usersRecipients.find(u => u.email === recipient?.email);

    let image = recipientUser?.photoUrl?.trim()
      ? recipientUser.photoUrl.trim()
      : recipientUser?.gender === "female"
        ? Woman
        : Man;

    setChatRecipientData({
      name: recipient?.name || "",
      image,
    });

    setIsConvSelected(true);
    setNewConvo(null);
    return;
  }

  const newConvoData = {
    participants: [
      { name: userProfile.name, email: userProfile.email },
      { name: convoRecipient.name, email: convoRecipient.email }
    ],
    subject: "",
    messages: [],
    createdAt: new Date(),
    status: "sent"
  };

  try {
    const convoId = await addData('conversations', newConvoData);
    const newConvoFull = { id: convoId, ...newConvoData };
    setSelectedConversation(newConvoFull);
    const recipient = newConvoData.participants.find(p => p.email !== userProfile.email);
    const recipientUser = usersRecipients.find(u => u.email === recipient?.email);

    let image = recipientUser?.photoUrl?.trim()
      ? recipientUser.photoUrl.trim()
      : recipientUser?.gender === "female"
        ? Woman
        : Man;

    setChatRecipientData({
      name: recipient?.name || "",
      image,
    });

    setIsConvSelected(true);
  } catch (error) {
    console.error("Error creating conversation:", error);
  } finally {
    // Ensure this always runs regardless of success or failure
    setNewConvo(null);
  }
};


  const handleChange = (e) => {
    setMyMessage(e.target.value);
  };

  const handleSend = async () => {
    if (!myMessage.trim()) return;

    const newMessage = {
      sender: {
        email: userProfile.email,
        name: userProfile.name,
        id: userProfile.uid,
      },
      message: myMessage,
      sendTime: new Date(),
      status: "sent"
    };

    const updatedMessages = [...(selectedConversation.messages || []), newMessage];

    try {
      await updateData("conversations", selectedConversation.id, {
        messages: updatedMessages,
        subject: newMessage.message
      });

      setSelectedConversation(prev => {
        const updated = conversations.find(c => c.id === prev.id);
        return updated ? { ...updated, messages: updatedMessages } : { ...prev, messages: updatedMessages };
      });

      setMyMessage("");
    } catch (error) {
      toast.error("Error sending message:", error);
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    setNotifications([]);
    console.log(notifications);
    const unsubscribe = fetchSnapshotData({
      path: "conversations",
      onDataChange: (liveData) => {
        setConversations(liveData.filter((c) =>
          c.participants.some((r) => userProfile.email === r.email)
        ));

        setSelectedConversation(prev => {
          if (!prev) return null;
          const updated = liveData.find(c => c.id === prev.id);
          if (!updated) return prev;
          markOtherParticipantMessagesAsRead(updated).then(setSelectedConversation);
          return updated;
        });
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);




  const handleSettingConversation = async (conversation) => {
    setIsConvSelected(true);
    const something = await markOtherParticipantMessagesAsRead(conversation);
    setSelectedConversation(something);
    const recipient = something?.participants.find(p => p.email !== userProfile.email);
    const recipientUser = usersRecipients.find(u => u.email === recipient?.email);

    let image = "";
    if (recipientUser?.photoUrl?.trim()) {
      image = recipientUser.photoUrl.trim();
    } else {
      image = recipientUser?.gender === "female" ? Woman : Man;
    }

    setChatRecipientData({
      name: recipient?.name || "",
      image,
    });


    setNewConvo(null);
  };
  const fetchUsers = async () => {
    try {
      const { data: recipients } = await fetchData({ path: "users" });
      setUserRecipients(recipients || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return usersRecipients;
    const term = searchTerm.toLowerCase();
    return usersRecipients.filter(user =>
      ['name', 'email'].some(key =>
        user[key]?.toString().toLowerCase().includes(term)
      )
    );
  }, [usersRecipients, searchTerm]);

  const formatTime = (parsedTime, type = "date") => {
    if (!parsedTime) return "";

    try {
      let date;
      if (typeof parsedTime.toDate === "function") {
        date = parsedTime.toDate();
      } else if (parsedTime instanceof Date) {
        date = parsedTime;
      } else if (typeof parsedTime === 'string' || typeof parsedTime === 'number') {
        date = new Date(parsedTime);
      } else {
        return "Invalid input";
      }

      if (isNaN(date.getTime())) return "Invalid date";

      const optionsMap = {
        datetime: {
          year: "numeric", month: "short", day: "numeric",
          hour: "2-digit", minute: "2-digit"
        },
        date: {
          year: "numeric", month: "long", day: "numeric"
        },
        time: {
          hour: "2-digit", minute: "2-digit"
        },
        day: {
          weekday: "long"
        }
      };

      const options = optionsMap[type] || optionsMap["date"];
      return date.toLocaleString("en-US", options);

    } catch (e) {
      console.error("Error formatting parsedTime:", parsedTime, e);
      return "";
    }
  };


  return (
    <>
      <div className="flex bg-slate-50 dark:bg-slate-900 p-6 min-h-150 max-h-screen overflow-auto shadow-lg shadow-slate-900/10 dark:shadow-black/40 dark:text-gray-300 text-gray-800 rounded-sm duration-300">

        {/* Left Sidebar - Conversation List */}
        <div className={`${!isConvSelected ? 'block' : 'hidden md:block'} w-full md:w-1/3 backdrop-blur-3xl border-0 border-r border-gray-400 dark:border-gray-700 rounded-l-lg overflow-y-auto p-4`}>
          <div className='flex items-center justify-between'>
            <h2 className="text-lg font-semibold mb-4">Site Queries</h2>
            <Button className={'flex flex-row gap-2 items-center text-slate-900 bg-white border border-yellow-300 focus:outline-none hover:bg-slate-100 focus:ring-4 focus:ring-yellow-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-slate-900 dark:text-white dark:border-yellow-600 dark:hover:bg-slate-950 dark:hover:border-slate-600 dark:focus:ring-yellow-700 shadow-lg shadow-slate-900/10 dark:shadow-black/40 duration-300 '} onClick={() => setNewConvo(true)}>
              <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </Button>
          </div>
          <ul>
            {conversations.map((msg) => (

              <li
                key={msg.id}
                className={`p-3 border-b border-gray-400 dark:border-gray-700 cursor-pointer flex flex-row${(() => {
                  const lastMsg = [...msg.messages].reverse().find(m => m.status === "sent");
                  return (lastMsg && lastMsg.sender?.email !== userProfile.email)
                    ? 'font-bold bg-gray-100 dark:bg-gray-800'
                    : '';
                })()} hover:bg-gray-200 dark:hover:bg-gray-700`}
                onClick={() => handleSettingConversation(msg)}
              >
                {(() => {
                  const otherParticipant = msg.participants.find(p => p.email !== userProfile.email);
                  const recipient = usersRecipients.find(u => u.email === otherParticipant?.email);
                  const photo = recipient?.photoUrl?.trim() || Man;

                  return (
                    <img
                      src={photo}
                      alt=""
                      className="w-10 h-10 rounded-full mr-4"
                    />
                  );
                })()}


                <span>
                  <p className="font-semibold">{msg.participants.find(p => p.email !== userProfile.email).name}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-400">{msg.subject}</p>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Section - Conversation View */}
        <div className={`${isConvSelected ? 'block' : 'hidden'} md:block w-full md:w-2/3 p-6`}>
          <Button onClick={() => setIsConvSelected(false)} className={
            `md:hidden flex flex-row gap-2 items-center text-slate-900 bg-white border border-yellow-300 focus:outline-none hover:bg-slate-100 focus:ring-4 focus:ring-yellow-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-slate-900 dark:text-white dark:border-yellow-600 dark:hover:bg-slate-950 dark:hover:border-slate-600 dark:focus:ring-yellow-700 shadow-lg shadow-slate-900/10 dark:shadow-black/40 duration-300`
          }>Conversations</Button>
          {selectedConversation ? (
            <div className='bg-white dark:bg-slate-950 h-full p-8 duration-300'>

              {/* Header */}
              <div className="py-2 px-3 bg-grey-lighter flex flex-row justify-between items-center">
                <div className="flex items-center">
                  <div>
                    {/* Image goes here */}
                    <img className="w-10 h-10 rounded-full" src={chatRecipientData.image} />
                    {console.log(`I am the image ${chatRecipientData.image}`)}
                  </div>
                  <div className="ml-4">
                    <p className="text-grey-darkest">
                      {selectedConversation.participants.find(p => p.email !== userProfile.email).name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-auto min-h-[400px] w-full" >
                <div className="py-2 px-3">

                  <div className="flex justify-center mb-2">
                    <div className="rounded py-2 px-4" >
                      <p className="text-sm uppercase">
                        {/* Here goes the timestamp */}
                        {formatTime(selectedConversation.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className='flex flex-col items-center gap-2 overflow-y-auto max-h-[350px]'>
                    {selectedConversation.messages.map((msg) => (
                      <div className={`flex ${msg.sender.id === userProfile.uid ? "flex-row-reverse ml-auto" : "flex-row mr-auto"} gap-2.5 my-2`}>{/*This controlls alignment*/}
                        <img className="w-8 h-8 rounded-full" src={msg.sender.id !== userProfile.uid ? chatRecipientData.image : userProfile.photoUrl} alt="Jese image" />
                        <div className={`flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 ${msg.sender.id === userProfile.uid ? "rounded-s-xl rounded-ee-xl" : "rounded-e-xl rounded-es-xl"} dark:bg-gray-700`}>
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{msg.sender.name}</span>
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{formatTime(msg.sendTime, 'time')}</span>
                          </div>
                          <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">{msg.message}</p>
                          {msg.sender.id !== userProfile.uid ? <span className="text-sm font-semibold text-gray-900 dark:text-white">You</span> : <span className={`text-sm font-normal ${msg.status === "read" ? 'text-yellow-500 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-400'}`}>{msg.status}</span>}
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Input */}
              <div className="bg-grey-lighter px-4 md:py-4 flex items-end md:items-center">
                <div className="flex-1  md:mx-4">
                  <input
                    onChange={handleChange}
                    value={myMessage}
                    className="md:flex md:flex-row md:gap-2 w-full items-center text-slate-900 bg-white border border-yellow-300 focus:outline-none hover:bg-slate-100 focus:ring-4 focus:ring-yellow-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-slate-900 dark:text-white dark:border-yellow-600 dark:hover:bg-slate-950 dark:hover:border-slate-600 dark:focus:ring-yellow-700 shadow-lg shadow-slate-900/10 dark:shadow-black/40 duration-300 " type="text" placeholder='Type a message ...' />
                </div>
                <Button
                  onClick={handleSend}
                  className={`flex flex-row gap-2 items-center text-slate-900 bg-white border border-yellow-300 focus:outline-none hover:bg-slate-100 focus:ring-4 focus:ring-yellow-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-slate-900 dark:text-white dark:border-yellow-600 dark:hover:bg-slate-950 dark:hover:border-slate-600 dark:focus:ring-yellow-700 shadow-lg shadow-slate-900/10 dark:shadow-black/40 duration-300 `}>
                  <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M3 4a1 1 0 0 0-.822 1.57L6.632 12l-4.454 6.43A1 1 0 0 0 3 20h13.153a1 1 0 0 0 .822-.43l4.847-7a1 1 0 0 0 0-1.14l-4.847-7a1 1 0 0 0-.822-.43H3Z" clipRule="evenodd" />
                  </svg>

                </Button>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Select a Conversation to view</p>
          )}
        </div>
      </div>

      {/* Modal for Creating New Conversation */}
      {!newConvo? '': (
        <ProjectModal
          title={"Select Recipient"}
          onClose={() => setNewConvo(null)}
        >
          <div className="flex justify-center mb-4">
            <input
              type="text"
              className="border px-4 py-2 rounded dark:bg-gray-700 dark:text-white duration-300 shadow-lg shadow-slate-900/10 dark:shadow-black/40"
              placeholder="Type here to search recipient..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          {filteredData.length === 0 ? (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">No users found.</p>
          ) : (
            <ul className='flex flex-col gap-2 overflow-y-auto max-h-[400px] '>
              {filteredData.filter(user => user.email !== userProfile.email).map((user) => (
                <li className=' mx-30 rounded-lg' key={user.id}>
                
                  <button
                    onClick={() => handleNewConvo(user)}
                    key={user.id}
                    className="p-2 border-b border-gray-400 dark:border-gray-700 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 min-w-full flex flex-row items-center gap-2 duration-300"
                  >
                  <img src={user.photoUrl?user.photoUrl: user.gender==="male"?Man:Woman } alt="" className='h-10 w-10 rounded-full' />
                    <span>
                      <p className="font-semibold min-w-full">{user.name}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-400">{user.email}</p>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </ProjectModal>
      )}
    </>
  );
};

export default Invoice;
