/* eslint-disable no-unused-vars */
import { createContext, useContext, useState, useEffect } from "react";
import apiClient from "./api-client";

// Context তৈরি
const UserContext = createContext();

// Provider
export const UserProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    profileImage:
      "https://www.freeiconspng.com/thumbs/profile-icon-png/profile-icon-9.png", // Default placeholder
  });
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/auth/profile");
      const userData = response.data.data.user;
      console.log("userData.avatar", userData.avatar);
      setProfileData({
        name: userData.fullName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        role: userData.role || "",
        profileImage:
          userData.avatar ||
          "https://www.freeiconspng.com/thumbs/profile-icon-png/profile-icon-9.png",
      });
    } catch (err) {
      console.log("Failed to fetch profile data. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  // localStorage থেকে user load করবো
  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <UserContext.Provider
      value={{ profileData, setProfileData, fetchProfile, loading }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom Hook
export const useUser = () => useContext(UserContext);
