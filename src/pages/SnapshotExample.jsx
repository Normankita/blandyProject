import { useData } from "../contexts/DataContext";
import { useEffect, useState } from "react";

const DashboardPage = () => {
  const { data, loading, error, listenToData } = useData();
  const [filters, setFilters] = useState([]);
  const [sort, setSort] = useState(null);

  useEffect(() => {
    const unsubscribe = listenToData({
      path: "users",
      filters,
      sort,
    });

    return () => unsubscribe(); // Clean up the listener
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
