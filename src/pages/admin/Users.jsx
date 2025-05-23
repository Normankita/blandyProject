import TableComponent from './components/TableComponent';
import useTableData from '../../hooks/useTableData';
import { useData } from '@/contexts/DataContext';
import { toast } from 'react-toastify';

const Users = () => {
  const { formattedData, loading, refreshData } = useTableData({
    path: 'users',
    sort: { field: 'createdAt', direction: 'desc' },
  });

  const { updateData, userProfile } = useData(); // Assumes userProfile.id or userProfile.uid is available

  const transform = {
    email: (value) => (
      <a href={`mailto:${value}`} className="text-blue-600 underline">
        {value}
      </a>
    ),
    role: (value) => <span className="capitalize">{value}</span>,
    status: (value) => (
      <span
        className={`px-2 py-1 rounded text-xs ${
          value === 'active'
            ? 'bg-green-500/60'
            : value === 'inactive'
            ? 'bg-red-500/60'
            : 'bg-yellow-500/60'
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

  const filterOut = ['password', 'repassword', 'createdBy', 'updatedBy', 'lastLoginAt', 'id', 'githubUrl', 'photoUrl', 'isActive','gitHubUrl','uid','doB', 'supervisorId','registrationNumber','mobNo','email','department','gender','program' ];

  const handleStatusChange = async (userId, newStatus) => {
   

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
      <button
        className={`px-3 py-1 rounded text-sm ${
          nextStatus === 'active' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}
        onClick={() => handleStatusChange(user.uid, nextStatus)}
      >
        {nextStatus === 'active' ? 'Activate' : 'Deactivate'}
      </button>
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
    </>
  );
};

export default Users;
