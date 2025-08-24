/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { FaCamera } from "react-icons/fa";
import { RiArrowLeftLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../lib/api-client";

const ProfileInformation = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null); // Track selected file for upload

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    profileImage: "", // Default placeholder
  });

  const navigate = useNavigate();

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/auth/profile");
        const userData = response.data.data.user;
        console.log("userData.avatar", userData.avatar);
        setFormData({
          name: userData.fullName || "",
          email: userData.email || "",
          phone: userData.phone || "",
          role: userData.role || "",
          profileImage: userData.avatar,
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch profile data. Please try again.");
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); // Store file for upload
      const imageUrl = URL.createObjectURL(file); // Local preview
      setFormData((prev) => ({
        ...prev,
        profileImage: imageUrl,
      }));
    }
  };

  const uploadAvatar = async (file) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const response = await apiClient.post("/auth/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("response", response.data);
      return response.data.data.avatarUrl; // Assuming response contains avatar URL
    } catch (e) {
      throw new Error("Failed to upload avatar. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let avatarUrl = formData.profileImage;

      // Upload new avatar if a file was selected
      if (selectedFile) {
        avatarUrl = await uploadAvatar(selectedFile);
      }

      // Prepare data for profile update
      const updateData = {
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        avatar: avatarUrl !== "https://i.pravatar.cc/100" ? avatarUrl : null, // Send null if using placeholder
      };

      await apiClient.put("/auth/profile", updateData);
      setFormData((prev) => ({ ...prev, profileImage: avatarUrl }));
      setSelectedFile(null); // Clear selected file
      setIsEditing(false);
      setLoading(false);
      alert("Profile updated successfully!");
    } catch (err) {
      alert(
        err.response.data.errors[0].message ||
          "Failed to update profile. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="">
      <div className="flex justify-between items-center mb-6 pb-4">
        <div className="flex items-center gap-3">
          <button
            className="text-2xl cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              navigate(-1);
            }}>
            <RiArrowLeftLine />
          </button>
          <h2 className="font-semibold text-2xl">Personal Information</h2>
        </div>
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="bg-[#B8860B] text-white py-2 px-4 rounded flex items-center gap-2">
            ✎ Edit Profile
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 py-5 px-20">
        {/* Left (Profile Image & Role) */}
        <div className="w-full lg:w-1/4 flex flex-col items-center bg-[#E4D8B3] border border-[#E4D8B3] p-14 rounded-md relative">
          <div className="relative">
            <img
              src={formData.profileImage}
              alt="profile"
              className="w-32 h-32 rounded-full object-cover"
            />
            {isEditing && (
              <>
                <div
                  className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center cursor-pointer"
                  onClick={() => fileInputRef.current.click()}>
                  <FaCamera className="text-white text-2xl" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleImageChange}
                />
              </>
            )}
          </div>
          <p className="mt-4 text-gray-700">Profile</p>
          <p className="text-2xl font-semibold mt-3">{formData.role}</p>
        </div>

        {/* Right (Form Fields) */}
        <div className="w-full lg:w-3/4 space-y-4">
          <div>
            <label className="block mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              disabled={!isEditing}
              className="w-full bg-[#E4D8B3] rounded-lg p-5 outline-none"
            />
          </div>

          <div>
            <label className="block mb-1">E-mail</label>
            <input
              type="email"
              value={formData.email}
              disabled={!isEditing}
              readOnly
              className="w-full bg-[#E4D8B3] rounded-lg p-5 outline-none"
            />
          </div>

          <div>
            <label className="block mb-1">Phone Number</label>
            <PhoneInput
              country={"us"}
              value={formData.phone}
              onChange={(value) => handleChange("phone", value)}
              disabled={!isEditing}
              inputClass="!w-full p-7 rounded-lg"
              containerClass="!w-full"
              inputStyle={{
                backgroundColor: "#E4D8B3",
                border: 0,
              }}
            />
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-[#B8860B] text-white px-6 py-2 rounded"
            disabled={loading}>
            {loading ? "Saving..." : "Save Info"}
          </button>
        </div>
      )}
    </form>
  );
};

export default ProfileInformation;
