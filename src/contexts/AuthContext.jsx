import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../configs/firebase";

// Creates a React context for authentication
const AuthContext = createContext();

/**
 * AuthProvider component wraps the application and provides authentication-related state and functions.
 * @param {Object} param0 - Props containing children components.
 * @returns {JSX.Element} - The AuthContext.Provider wrapping the children.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores the currently authenticated user
  const [token, setToken] = useState(null); // Stores the user's authentication token
  const [loading, setLoading] = useState(true); // Indicates whether authentication state is being loaded

  /**
   * useEffect hook to listen for authentication state changes.
   * Updates the user and token state when the auth state changes.
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      try {
        if (firebaseUser) {
          const freshToken = await firebaseUser.getIdToken(); // Fetches a fresh token for the user
          setUser(firebaseUser); // Sets the authenticated user
          setToken(freshToken); // Sets the user's token
        } else {
          setUser(null); // Clears the user state if not authenticated
          setToken(null); // Clears the token state if not authenticated
        }
      } catch (error) {
        console.error("Error in auth state change:", error);
      } finally {
        setLoading(false); // Marks loading as complete
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  /**
   * Registers a new user with email and password.
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   * @returns {Object} - The registered user and their token.
   * @throws {Error} - Throws an error if registration fails.
   */
  const register = async (email, password) => {
    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      const token = await user.getIdToken(); // Fetches the token for the new user
      setUser(user); // Sets the authenticated user
      setToken(token); // Sets the user's token
      return { user, token };
    } catch (error) {
      console.error("Registration error:", error);
      throw error; // Propagates the error to the caller
    } finally {
      setLoading(false); // Ensure loading is set to false
    }
  };

  /**
   * Logs in a user with email and password.
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   * @returns {Object} - The logged-in user and their token.
   * @throws {Error} - Throws an error if login fails.
   */
  const login = async (email, password) => {
    setLoading(true);
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const token = await user.getIdToken(); // Fetches the token for the logged-in user
      setUser(user); // Sets the authenticated user
      setToken(token); // Sets the user's token
      return { user, token };
    } catch (error) {
      console.error("Login error:", error);
      throw error; // Propagates the error to the caller
    } finally {
      setLoading(false); // Ensure loading is set to false
    }
  };

  /**
   * Logs in a user using Google authentication.
   * @returns {Object} - The logged-in user and their token.
   * @throws {Error} - Throws an error if login fails.
   */
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider); // Opens a popup for Google login
      const token = await res.user.getIdToken(); // Fetches the token for the logged-in user
      setUser(res.user); // Sets the authenticated user
      setToken(token); // Sets the user's token
      return { user: res.user, token };
    } catch (error) {
      console.error("Google login error:", error);
      throw error; // Propagates the error to the caller
    } finally {
      setLoading(false); // Ensure loading is set to false
    }
  };

  /**
   * Logs out the currently authenticated user.
   * Resets the user and token state to null.
   * @throws {Error} - Throws an error if logout fails.
   */
  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth); // Signs out the user
      setUser(null); // Clears the user state
      setToken(null); // Clears the token state
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      throw error; // Propagates the error to the caller
    } finally {
      setLoading(false); // Ensure loading is set to false
    }
  };

  /**
   * Retrieves the current authentication token.
   * @returns {string|null} - The current token or null if not authenticated.
   */
  const getToken = () => token;

  return (
    <AuthContext.Provider
      value={{
        user, // The currently authenticated user
        token, // The authentication token
        loading, // Loading state for authentication
        register, // Function to register a new user
        login, // Function to log in a user
        logout, // Function to log out the user
        loginWithGoogle, // Function to log in with Google
        getToken, // Function to retrieve the current token
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access the AuthContext.
 * @returns {Object} - The authentication context value.
 */
export const useAuth = () => useContext(AuthContext);
