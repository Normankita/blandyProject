import TableComponent from './components/TableComponent';
import useTableData from '../../hooks/useTableData'; // Adjust the path accordingly

const Users = () => {
  const { formattedData, loading } = useTableData({
    path: 'users',
    sort: { field: 'createdAt', direction: 'desc' },
  });

  const transform = {
    email: (value) => (
      <a href={`mailto:${value}`} className="text-blue-600 underline">
        {value}
      </a>
    ),
    role: (value) => <span className="capitalize">{value}</span>,
    status: (value) => value,
    createdAt: (value) => <span className="text-xs text-gray-500">{value}</span>,
  };

  const customHeaders = {
    registrationNumber: 'Registration Number',
    createdAt: 'Created',
    updatedAt: 'Updated',
    role: 'User Role',
  };

  const filterOut = ['password', 'repassword', 'createdBy', 'updatedBy','lastLoginAt', 'id', 'githubUrl', 'photoUrl'];

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
      headerLabels={customHeaders} // <- corrected prop name
    />
      )}
    </>
  );
};

export default Users;
