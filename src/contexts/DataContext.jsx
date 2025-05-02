import { createContext, useContext, useState, useEffect } from "react";
import { db } from "../configs/firebase";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [userProfile, setUserProfile] = useState(null);
  const [userProfileLoading, setUserProfileLoading] = useState(true);

  const { user } = useAuth(); // Firebase user

  const fetchSingleDoc = async (path, id) => {
    setLoading(true);
    setError(null);
    try {
      const ref = doc(db, path, id);
      const snapshot = await getDoc(ref);

      if (!snapshot.exists()) {
        throw new Error("Document not found");
      }

      return { id: snapshot.id, ...snapshot.data() };
    } catch (err) {
      console.error("Fetch single doc error:", err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

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
      setData(result);
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

  // Load user profile on auth state change
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) {
        setUserProfile(null);
        setUserProfileLoading(false);
        return;
      }

      setUserProfileLoading(true);
      const profile = await fetchSingleDoc("users", user.uid);
      setUserProfile(profile); // null if not found
      setUserProfileLoading(false);
    };

    loadUserProfile();
  }, [user]);

  return (
    <DataContext.Provider
      value={{
        data,
        loading,
        error,
        fetchData,
        fetchSingleDoc,
        setData,
        addData,
        updateData,
        deleteData,
        userProfile,
        userProfileLoading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
