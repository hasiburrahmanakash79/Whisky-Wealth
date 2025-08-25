/* eslint-disable no-unused-vars */
import { useState, useRef } from "react";
import { IoChevronForwardSharp } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { RiArrowLeftLine } from "react-icons/ri";
import CommonModal from "../../../components/Common/CommonModal";
import apiClient from "../../../lib/api-client";
import toast from "react-hot-toast";

const Setting = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({}); // field-wise errors

  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const {
    formState: { errors: formErrors },
    reset,
    setValue,
  } = useForm();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setValue(field, value); // Sync with react-hook-form
    // Clear field-specific error on change
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      setFieldErrors({}); // reset old errors

      if (
        !formData.currentPassword ||
        !formData.newPassword ||
        !formData.confirmPassword
      ) {
        setFieldErrors({ general: "All fields are required" });
        setIsSubmitting(false);
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        setFieldErrors({ confirmPassword: "Passwords do not match" });
        setIsSubmitting(false);
        return;
      }

      // API request
      await apiClient.post("/auth/change-password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      // Success
      setShowPasswordModal(false);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      reset();
      setIsSubmitting(false);
      toast.success("Password changed successfully!");
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      if (apiErrors) {
        // Convert array to object: { field: message }
        const newErrors = {};
        apiErrors.forEach((e) => {
          newErrors[e.field] = e.message;
        });
        setFieldErrors(newErrors);
      } else {
        setFieldErrors({
          general: err.response?.data?.message || "Something went wrong",
        });
      }
      console.error("API Error:", err.response?.data || err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          className="text-2xl cursor-pointer"
          onClick={() => navigate(-1)}>
          <RiArrowLeftLine />
        </button>
        <h1 className="text-2xl font-semibold">Setting</h1>
      </div>

      {/* Setting Options */}
      <div className="space-y-5">
        <Link
          to="/setting/profile"
          className="bg-[#E4D8B3] p-5 rounded-lg flex justify-between items-center w-full px-7">
          <p>Personal Information</p>
          <IoChevronForwardSharp />
        </Link>

        <button
          onClick={() => setShowPasswordModal(true)}
          className="bg-[#E4D8B3] p-5 rounded-lg flex justify-between items-center w-full px-7">
          <p>Change Password</p>
          <IoChevronForwardSharp />
        </button>

        <Link
          to="/setting/privacy"
          className="bg-[#E4D8B3] p-5 rounded-lg flex justify-between items-center w-full px-7">
          <p>Privacy & Policy</p>
          <IoChevronForwardSharp />
        </Link>
      </div>

      {/* Change Password Modal */}
      <CommonModal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setFieldErrors({});
          setFormData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
          reset();
        }}
        title="Change Password">
        <div className="space-y-4 mt-4">
          {fieldErrors.general && (
            <p className="text-red-500 text-sm text-center">
              {fieldErrors.general}
            </p>
          )}

          <label className="block mb-1">Current Password</label>
          <input
            type="password"
            placeholder="Current Password"
            value={formData.currentPassword}
            required
            onChange={(e) => handleChange("currentPassword", e.target.value)}
            className="w-full border border-gray-300 p-3 rounded"
          />
          {fieldErrors.currentPassword && (
            <p className="text-red-500 text-sm">
              {fieldErrors.currentPassword}
            </p>
          )}

          <label className="block mb-1">New Password</label>
          <input
            type="password"
            placeholder="New Password"
            value={formData.newPassword}
            required
            onChange={(e) => handleChange("newPassword", e.target.value)}
            className="w-full border border-gray-300 p-3 rounded"
          />
          {fieldErrors.newPassword && (
            <p className="text-red-500 text-sm">{fieldErrors.newPassword}</p>
          )}

          <label className="block mb-1">Confirm New Password</label>
          <input
            type="password"
            placeholder="Confirm New Password"
            value={formData.confirmPassword}
            required
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            className="w-full border border-gray-300 p-3 rounded"
          />
          {fieldErrors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {fieldErrors.confirmPassword}
            </p>
          )}

          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="w-full bg-[#B8860B] text-white px-4 py-2 rounded-lg hover:bg-[#a0730b] transition">
            {isSubmitting ? "Submitting..." : "Update Password"}
          </button>
        </div>
      </CommonModal>
    </div>
  );
};

export default Setting;
