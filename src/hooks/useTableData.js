// hooks/useTableData.js
import { useEffect, useState } from 'react';
import { useData } from '../contexts/DataContext'; // Adjust path if needed

const useTableData = ({ path, sort, transformData }) => {
  const { fetchData, loading } = useData();
  const [formattedData, setFormattedData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const res = await fetchData({ path, sort });
      if (!res || !res.data) return;

      const cleaned = res.data.map((item) => {
        const formatted = { ...item };

        for (const key in formatted) {
          if (formatted[key]?.seconds && formatted[key]?.nanoseconds) {
            formatted[key] = new Date(formatted[key].seconds * 1000).toLocaleString();
          }
        }

        return transformData ? transformData(formatted) : formatted;
      });

      setFormattedData(cleaned);
    };

    loadData();
  }, [path, sort, fetchData, transformData]);

  return { formattedData, loading };
};

export default useTableData;
