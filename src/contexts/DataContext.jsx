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
  setDoc,
} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

const DataContext = createContext();

/**
 * DataProvider component wraps the application and provides data-related state and functions.
 * @param {Object} param0 - Props containing children components.
 * @returns {JSX.Element} - The DataContext.Provider wrapping the children.
 */
export const DataProvider = ({ children }) => {
  const [data, setData] = useState([]); // Stores the fetched data
  const [loading, setLoading] = useState(false); // Indicates whether data is being loaded
  const [error, setError] = useState(null); // Stores any error messages

  const [userProfile, setUserProfile] = useState(null); // Stores the user's profile data
  const [userProfileLoading, setUserProfileLoading] = useState(true); // Indicates whether the user profile is being loaded

  const { user } = useAuth(); // Firebase user from AuthContext

  /**
   * Fetches a single document from Firestore.
   * @param {string} path - The Firestore collection path.
   * @param {string} id - The document ID.
   * @returns {Object|null} - The document data or null if not found.
   */
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

  /**
   * Fetches multiple documents from Firestore with optional filters and sorting.
   * @param {Object} param0 - Options for fetching data.
   * @param {string} param0.path - The Firestore collection path.
   * @param {Array} param0.filters - Array of filter conditions.
   * @param {Object|null} param0.sort - Sorting options.
   * @returns {Array} - The fetched documents.
   */
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

  /**
   * Adds a new document to Firestore.
   * @param {string} path - The Firestore collection path.
   * @param {Object} newData - The data to add.
   * @param {string|null} id - Optional custom document ID.
   * @returns {string|null} - The document ID or null if an error occurs.
   */
  const addData = async (path, newData, id = null) => {
    try {
      if (id) {
        const ref = doc(db, path, id);
        await setDoc(ref, newData); // setDoc allows custom ID
        return id;
      } else {
        const docRef = await addDoc(collection(db, path), newData); // auto-ID
        return docRef.id;
      }
    } catch (err) {
      console.error("Add error:", err);
      setError(err.message);
      return null;
    }
  };

  /**
   * Updates an existing document in Firestore.
   * @param {string} path - The Firestore collection path.
   * @param {string} id - The document ID.
   * @param {Object} updates - The updates to apply.
   */
  const updateData = async (path, id, updates) => {
    try {
      const ref = doc(db, path, id);
      await updateDoc(ref, updates);
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message);
    }
  };

  /**
   * Deletes a document from Firestore.
   * @param {string} path - The Firestore collection path.
   * @param {string} id - The document ID.
   */
  const deleteData = async (path, id) => {
    try {
      await deleteDoc(doc(db, path, id));
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.message);
    }
  };

  /**
   * Loads the user's profile from Firestore or sessionStorage.
   * Automatically triggered on authentication state change.
   */
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) {
        setUserProfile(null);
        setUserProfileLoading(false);
        sessionStorage.removeItem("userProfile");
        return;
      }
  
      setUserProfileLoading(true);
  
      // Check sessionStorage first
      const cachedProfile = sessionStorage.getItem("userProfile");
      if (cachedProfile) {
        setUserProfile(JSON.parse(cachedProfile));
        setUserProfileLoading(false);
        return;
      }
  
      // Fetch from Firestore if not cached
      const profile = await fetchSingleDoc("users", user.uid);
      if (profile) {
        sessionStorage.setItem("userProfile", JSON.stringify(profile));
      }
      setUserProfile(profile);
      setUserProfileLoading(false);
    };
  
    loadUserProfile();
  }, [user]);

  return (
    <DataContext.Provider
      value={{
        data, // The fetched data
        loading, // Loading state for data operations
        error, // Error state for data operations
        fetchData, // Function to fetch multiple documents
        fetchSingleDoc, // Function to fetch a single document
        setData, // Function to manually set the data state
        addData, // Function to add a new document
        updateData, // Function to update an existing document
        deleteData, // Function to delete a document
        userProfile, // The user's profile data
        userProfileLoading, // Loading state for the user's profile
        setUserProfile, // Function to manually set the user's profile
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

/**
 * Custom hook to access the DataContext.
 * @returns {Object} - The data context value.
 */
export const useData = () => useContext(DataContext);
