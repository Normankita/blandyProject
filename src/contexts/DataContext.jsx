import { createContext, useContext, useState } from "react";
import { db } from "../configs/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
} from "firebase/firestore";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch once and set global data
  const fetchData = async ({ path, filters = [], sort = null }) => {
    setLoading(true);
    setError(null);
    try {
      let q = collection(db, path);

      if (filters.length > 0 || sort) {
        const constraints = [];

        filters.forEach(({ field, op, value }) =>
          constraints.push(where(field, op, value))
        );

        if (sort) {
          constraints.push(orderBy(sort.field, sort.direction || "asc"));
        }

        q = query(q, ...constraints);
      }

      const snapshot = await getDocs(q);
      const result = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(result); // Store in global state
      return result;
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const addData = async (path, newData) => {
    try {
      const docRef = await addDoc(collection(db, path), newData);
      return docRef.id;
    } catch (err) {
      console.error("Add error:", err);
      setError(err.message);
      return null;
    }
  };

  const updateData = async (path, id, updates) => {
    try {
      const ref = doc(db, path, id);
      await updateDoc(ref, updates);
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message);
    }
  };

  const deleteData = async (path, id) => {
    try {
      await deleteDoc(doc(db, path, id));
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.message);
    }
  };

  return (
    <DataContext.Provider
      value={{
        data,
        loading,
        error,
        fetchData,
        setData, // Export if you ever need to force-set from outside
        addData,
        updateData,
        deleteData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
