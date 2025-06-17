// hooks/useTableData.js
import { useEffect, useState, useCallback } from 'react';
import { useData } from '../contexts/DataContext'; // Adjust the path if necessary

const useTableData = ({ path, sort, filters = [], transformData }) => {
  const { fetchData, loading, setLoading } = useData();
  const [formattedData, setFormattedData] = useState([]);

  // Define and memoize the data , setLoading function
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchData({ path, sort, filters });
      if (!res || !res.data) return;

      const cleaned = res.data.map((item) => {
        const formatted = { ...item };

        // Convert Firestore timestamps to readable strings
        for (const key in formatted) {
          const value = formatted[key];
          if (value?.seconds && value?.nanoseconds) {
            formatted[key] = new Date(value.seconds * 1000).toLocaleString();
          }
        }

        return transformData ? transformData(formatted) : formatted;
      });

      setFormattedData(cleaned);
    } catch (error) {
      console.error("Failed to load data in useTableData:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchData, path, sort, filters, transformData]);

  // Load data on mount or dependency change
  useEffect(() => {
    loadData();
  }, []);

  // Return data, , setLoading state, and manual refresh function
  return {
    formattedData,
    loading,
    refreshData: loadData
  };
};

export default useTableData;
