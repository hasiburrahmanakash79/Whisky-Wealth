import { useState, useRef } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { FaCamera } from "react-icons/fa";
import { RiArrowLeftLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const ProfileInformation = () => {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "Sharon",
    email: "alkhahsalkgsalkgsalk@gmail.com",
    phone: "12423000597212",
    role: "Admin",
    profileImage: "https://i.pravatar.cc/100",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        profileImage: imageUrl,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    console.log(formData); // Save API call here
  };

  const navigate = useNavigate();


  return (
    <form onSubmit={handleSubmit} className="">
      <div className="flex justify-between items-center mb-6 pb-4">
        <div className="flex items-center gap-3">
          <button className="text-2xl cursor-pointer" onClick={() => navigate(-1)}>
          <RiArrowLeftLine />
        </button>
        <h2 className="font-semibold text-2xl">Personal Information</h2>
        </div>
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white py-2 px-4 rounded flex items-center gap-2"
          >
            ✎ Edit Profile
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 py-5 px-20">
        {/* Left (Profile Image & Role) */}
        <div className="w-full lg:w-1/4 flex flex-col items-center  bg-[#B7C8FF] border border-blue-300 p-14 rounded-md relative">
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
                  onClick={() => fileInputRef.current.click()}
                >
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
              className="w-full  bg-[#B7C8FF] rounded-lg p-5 outline-none"
            />
          </div>

          <div>
            <label className="block mb-1">E-mail</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              disabled={!isEditing}
              className="w-full  bg-[#B7C8FF] rounded-lg p-5 outline-none"
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
                backgroundColor: "#B7C8FF",
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
            className="bg-blue-500 text-white px-6 py-2 rounded"
          >
            Save Info
          </button>
        </div>
      )}
    </form>
  );
};

export default ProfileInformation;
