// hooks/useFetchProfile.js
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";

export const useFetchProfile = () => {
  const { user } = useAuth();
  const { setUserProfile, fetchSingleDoc } = useData();

  // Function to fetch the user profile
  const fetchProfile = async () => {
    if (!user?.uid) throw new Error("User UID is missing");

    const cached = sessionStorage.getItem("userProfile");
    if (cached) {
      const parsed = JSON.parse(cached);
      setUserProfile(parsed); // Set the user profile from cache
      return parsed; // Return the cached profile
    }

    try {
      // Fetch the profile from the database
      const profile = await fetchSingleDoc("users", user.uid);
      if (!profile) throw new Error("No profile found in database.");

      // Cache the profile in sessionStorage
      sessionStorage.setItem("userProfile", JSON.stringify(profile));
      setUserProfile(profile); // Set the fetched profile in state

      return profile;
    } catch (e) {
      console.error("Error fetching user profile:", e);
      throw new Error("Error fetching user profile.");
    }
  };

  return fetchProfile; // Return the fetchProfile function
};
