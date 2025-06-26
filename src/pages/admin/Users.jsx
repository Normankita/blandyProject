import TableComponent from './components/TableComponent';
import useTableData from '../../hooks/useTableData';
import { useData } from '@/contexts/DataContext';
import { toast } from 'react-toastify';
import ContactCard from '@/components/ContactCard';
import { useState } from 'react';
import ProjectModal from './components/ProjectModal';

const Users = () => {

  const [selectedUser, setSelectedUser] = useState(null);
  const { formattedData, loading, refreshData } = useTableData({
    path: 'users',
    sort: { field: 'createdAt', direction: 'desc' },
  });

  const { updateData, userProfile } = useData(); // Assumes userProfile.id or userProfile.uid is available

  const transform = {
    email: (value) => (
      <a href={`mailto:${value}`} className="text-yellow-600 underline">
        {value}
      </a>
    ),
    role: (value) => <span className="capitalize">{value}</span>,
    status: (value) => (
      <span
        className={`px-2 py-1 rounded text-xs shadow-lg shadow-slate-900/10 dark:shadow-black/40 text-gray-50 font-semibold ${value === 'active'
          ? 'bg-green-500'
          : value === 'inactive'
            ? 'bg-red-500'
            : 'bg-yellow-500'
          }`}
      >
        {value}
      </span>
    ),
    createdAt: (value) => <span className="text-xs text-gray-500">{value}</span>,
  };

  const customHeaders = {
    createdAt: 'Created',
    updatedAt: 'Updated',
    role: 'User Role',
  };

  const filterOut = ['password', 'repassword', 'createdBy', 'updatedBy', 'lastLoginAt', 'id', 'githubUrl', 'photoUrl', 'isActive', 'gitHubUrl', 'uid', 'doB', 'supervisorId', 'registrationNumber', 'mobNo', 'email', 'department', 'region', 'gender', 'program', 'panelId', 'secretpass'];

  const handleStatusChange = async (userId, newStatus) => {
    if (userId === userProfile?.uid || userId === userProfile?.uid) {
      toast.warn('You cannot deactivate the account you are currently logged in with.');
      return;
    }

    try {
      await updateData('users', userId, { status: newStatus });
      toast.success(`User ${newStatus}`);
      refreshData(); // Optional: reload data
    } catch (err) {
      console.error(`Error updating user status: ${err}`);
      toast.error('Failed to update status');
    }
  };

  const renderActions = (user) => {
    const nextStatus = user.status === 'active' ? 'inactive' : 'active';

    return (
      <>
        <button
          className={`text-gray-900 bg-white border  focus:outline-none focus:ring-4 font-bold rounded-full text-sm px-4 py-1.5 me-2 dark:bg-slate-900 dark:text-white  dark:hover:bg-slate-950 shadow-lg shadow-slate-900/10 dark:shadow-black/40 flex flex-row gap-1 items-center ${nextStatus === 'active' ? 'dark:focus:ring-green-700 dark:hover:border-green-600 dark:border-green-600 hover:bg-green-100 border-green-300 focus:ring-green-100' : 'dark:focus:ring-red-700 dark:hover:border-red-600 dark:border-red-600 hover:bg-red-100 border-red-300 focus:ring-red-100'
            }`}
          onClick={() => handleStatusChange(user.uid, nextStatus)}
        >
          {nextStatus === 'active' ? (
            <span className='flex flex-row gap-1 items-center'>
              <svg className="w-5 h-5 text-gray-700 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6l-8-6Z" clipRule="evenodd" />
              </svg>


              Activate
            </span>

          ) : (
            <span className='flex flex-row gap-1 items-center'>
              <svg class="w-5 h-5 text-gray-700 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" strokeLinejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Deactivate
            </span>
          )}
        </button>
        <button
          className="text-gray-900 bg-white border border-yellow-300 focus:outline-none hover:bg-yellow-100 focus:ring-4 focus:ring-yellow-100 font-bold rounded-full text-sm px-4 py-1.5 me-2 dark:bg-slate-900 dark:text-white dark:border-yellow-600 dark:hover:bg-slate-950 dark:hover:border-yellow-600 dark:focus:ring-gray-700 shadow-lg shadow-slate-900/10 dark:shadow-black/40 flex flex-row gap-1 items-center"
          onClick={() => setSelectedUser(user)}
        >
          <span>
            <svg className="w-5 h-5 text-gray-700 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeWidth="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z" />
              <path stroke="currentColor" strokeWidth="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>

          </span>
          View
        </button>
      </>
    );
  };

  return (
    <>
      {formattedData.length > 0 && (
        <TableComponent
          ItemData={formattedData}
          headers={Object.keys(formattedData[0])}
          title="Users"
          isLoading={loading}
          excludeFields={filterOut}
          transformFields={transform}
          headerLabels={customHeaders}
          customActions={renderActions}
        />
      )}
      {selectedUser && (
        <ProjectModal
          title={selectedUser.name}
          onClose={() => setSelectedUser(null)}
        >
          <ContactCard userToDisplay={selectedUser} />
        </ProjectModal>
      )}
    </>
  );
};

export default Users;
