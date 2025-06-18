import { createContext, useContext, useState, useEffect } from "react";

import { db } from "../configs/firebase";
import { storage } from '../configs/externalStorage';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

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
  limit,
  startAfter,
  onSnapshot,
} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [userProfileLoading, setUserProfileLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const { user } = useAuth();

  const fetchSingleDoc = async (path, id) => {
    try {
      const ref = doc(db, path, id);
      const snapshot = await getDoc(ref);
      if (!snapshot.exists()) throw new Error("Document not found");
      return { id: snapshot.id, ...snapshot.data() };
    } catch (err) {
      console.error("Fetch single doc error:", err);
      return null;
    }
  };

  // Fetch Data, but not real time
  const fetchData = async ({
    path,
    filters = [],
    sort = null,
    limitNumber = null,
    startAfterDoc = null,
  }) => {
    let localLoading = true;
    let localError = null;

    try {
      let ref = collection(db, path);
      const constraints = [];

      filters.forEach(({ field, op, value }) =>
        constraints.push(where(field, op, value))
      );

      if (sort) {
        constraints.push(orderBy(sort.field, sort.direction || "asc"));
      }

      if (limitNumber) {
        constraints.push(limit(limitNumber));
      }

      if (startAfterDoc) {
        constraints.push(startAfter(startAfterDoc));
      }

      const q = constraints.length ? query(ref, ...constraints) : ref;
      const snapshot = await getDocs(q);

      const result = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setData(result);
      return {
        data: result,
        error: null,
        loading: false,
        lastVisible: snapshot.docs[snapshot.docs.length - 1] || null,
      };
    } catch (err) {
      console.error("Fetch error:", err);
      localError = err.message;
      return {
        data: [],
        error: localError,
        loading: false,
        lastVisible: null,
      };
    } finally {
      localLoading = false;
    }
  };

  //Fetch real time data

  const fetchSnapshotData = ({
    path,
    filters = [],
    sort = null,
    limitNumber = null,
    startAfterDoc = null,
    onDataChange = () => { },
  }) => {
    let ref = collection(db, path);
    const constraints = [];

    filters.forEach(({ field, op, value }) =>
      constraints.push(where(field, op, value))
    );

    if (sort) {
      constraints.push(orderBy(sort.field, sort.direction || "asc"));
    }

    if (limitNumber) {
      constraints.push(limit(limitNumber));
    }

    if (startAfterDoc) {
      constraints.push(startAfter(startAfterDoc));
    }

    const q = constraints.length ? query(ref, ...constraints) : ref;

    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        const result = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(result);
        onDataChange(result); // optional callback
      },
      error => {
        console.error("Snapshot error:", error);
      }
    );

    return unsubscribe; // Call this to stop listening
  };


  const addData = async (path, newData, id = null) => {
    try {
      if (id) {
        const ref = doc(db, path, id);
        await setDoc(ref, newData);
        return id;
      } else {
        const docRef = await addDoc(collection(db, path), newData);
        return docRef.id;
      }
    } catch (err) {
      console.error("Add error:", err);
      throw new Error("Error adding data.");
    }
  };


  /**
   * Updates a document in the given path with the given ID.
   * @param {string} path - The path to the document to update.
   * @param {string} id - The ID of the document to update.
   * @param {Object} updates - The updates to apply to the document.
   */
  const updateData = async (path, id, updates) => {
    try {
      const ref = doc(db, path, id);
      await updateDoc(ref, updates);
    } catch (err) {
      throw new Error("Update error: " + err.message);
    }
  };


  // Logic to upload files, any file in any path 
  const uploadFile = async (file, path) => {
    try {
      const storageRef = ref(storage, `mzumbeAcademicPortal/${path}`); // e.g., 'profilePics/uid.jpg' or 'projectDocs/file.pdf'
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      return url;
    } catch (err) {
      console.error("File upload error:", err);
      return null;
    }
  };

  // logic to delete file, any file anywhere 
  const deleteFile = async (path) => {
    try {
      const fileRef = ref(storage, path);
      await deleteObject(fileRef);
      return true;
    } catch (err) {
      console.error("File delete error:", err);
      return false;
    }
  };


  const deleteData = async (path, id) => {
    try {
      await deleteDoc(doc(db, path, id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadUserProfile = async () => {
      if (!user) {
        isMounted && setUserProfile(null);
        setUserProfileLoading(false);
        sessionStorage.removeItem("userProfile");
        return;
      }

      setUserProfileLoading(true);

      const cachedProfile = sessionStorage.getItem("userProfile");
      if (cachedProfile) {
        isMounted && setUserProfile(JSON.parse(cachedProfile));
        setUserProfileLoading(false);
        return;
      }

      const profile = await fetchSingleDoc("users", user.uid);
      if (profile) {
        sessionStorage.setItem("userProfile", JSON.stringify(profile));
      }
      isMounted && setUserProfile(profile);
      setUserProfileLoading(false);
    };

    loadUserProfile();

    return () => {
      isMounted = false;
    };
  }, [user]);

  return (
    <DataContext.Provider
      value={{
        data,
        setData,
        fetchData,
        fetchSingleDoc,
        addData,
        updateData,
        deleteData,
        userProfile,
        userProfileLoading,
        setUserProfile,
        uploadFile,
        deleteFile,
        fetchSnapshotData,
        notifications,
        setNotifications,
        loading,
        setLoading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
