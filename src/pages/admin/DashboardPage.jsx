import { useData } from "../../contexts/DataContext";
import { useEffect, useState } from "react";
import DashboardPager from '../Dashboard'

const DashboardPage = () => {
  const { fetchData, data, loading, error } = useData();
  const currentFilter = { field: "role", op: "==", value: "Admin" }
  const [filters, setFilters] = useState([currentFilter]);
  const [sort, setSort] = useState(null);

  useEffect(() => {
    
    fetchData({
      path: "users",
      filters,
      sort,
    });
  }, [filters, sort]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>User List</h1>
      <ul>
        {data && data.length !== 0 ? (
          data.map((user) => (
            <li key={user.id}>
              {user.name} ({user.email})
              <DashboardPager/>
            </li>
          ))
        ) : (
          <li>No users found</li>
        )}
      </ul>
    </div>
  );
};

export default DashboardPage;
