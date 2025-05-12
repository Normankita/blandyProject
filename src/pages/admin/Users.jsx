import React, { useState, useEffect } from 'react';
import TableComponent from './components/TableComponent';
import { useData } from '../../contexts/DataContext';

const Users = () => {
  const { fetchData, data, loading } = useData();
  const [formattedData, setFormattedData] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      const res = await fetchData({ path: 'users', sort: { field: "createdAt", direction: "desc" } });
      const cleaned = res.data.map((user) => {
        const formatted = { ...user };

        // Format all timestamp fields
        for (const key in formatted) {
          if (formatted[key]?.seconds && formatted[key]?.nanoseconds) {
            formatted[key] = new Date(formatted[key].seconds * 1000).toLocaleString();
          }
        }

        return formatted;
      });

      setFormattedData(cleaned);
    };

    getUsers();
  }, []);

  return (
    <>
      {formattedData.length > 0 && (
        <TableComponent
          ItemData={formattedData}
          headers={Object.keys(formattedData[0])}
          title="Users"
          isLoading={loading}
        />
      )}
    </>
  );
};

export default Users;
