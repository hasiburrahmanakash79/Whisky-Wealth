/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { IoChevronForwardSharp } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { RiArrowLeftLine } from "react-icons/ri";
import CommonModal from "../../../components/Common/CommonModal";
import apiClient from "../../../lib/api-client";

const Setting = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [timer, setTimer] = useState(60);
  const [resendEnabled, setResendEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const {
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Resend OTP timer
  useEffect(() => {
    let interval;
    if (!resendEnabled && showOtpModal) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setResendEnabled(true);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendEnabled, showOtpModal]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setValue(field, value); // Sync with react-hook-form
  };

  const handleSave = async () => {
    try {
      setError(null);
      setIsSubmitting(true);
      if (
        !formData.newPassword ||
        !formData.currentPassword ||
        !formData.confirmPassword
      ) {
        setError("All field is required");
        setIsSubmitting(false);
        return;
      }

      // Validate passwords
      if (formData.newPassword !== formData.confirmPassword) {
        setError("New password and confirm password do not match.");
        setIsSubmitting(false);
        return;
      }
      if (formData.newPassword.length < 8) {
        setError("New password must be at least 8 characters long.");
        setIsSubmitting(false);
        return;
      }

      // Send password change request
      await apiClient.post("/auth/change-password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setShowPasswordModal(false);
      setShowOtpModal(true);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      reset();
      setIsSubmitting(false);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to initiate password change. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setError(null);
      await apiClient.post("/auth/resend-otp"); // Hypothetical endpoint
      setResendEnabled(false);
      setTimer(60);
      alert("OTP resent to your email!");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to resend OTP. Please try again."
      );
    }
  };

  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]?$/.test(value)) {
      setValue(`otp${index}`, value, { shouldValidate: true });
      if (index < 5 && value) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const otp = Object.values(data).join("");

      // Verify OTP
      await apiClient.post("/auth/verify-otp", { otp }); // Hypothetical endpoint
      setShowOtpModal(false);
      reset();
      setIsSubmitting(false);
      alert("Password updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
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
          setError(null);
          setFormData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
          reset();
        }}
        title="Change Password">
        <div className="space-y-4 mt-4">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <label className="block mb-1">Current Password</label>
          <input
            type="password"
            placeholder="Current Password"
            value={formData.currentPassword}
            required
            onChange={(e) => handleChange("currentPassword", e.target.value)}
            className="w-full border border-gray-300 p-3 rounded"
          />

          <label className="block mb-1">New Password</label>
          <input
            type="password"
            placeholder="New Password"
            value={formData.newPassword}
            required
            onChange={(e) => handleChange("newPassword", e.target.value)}
            className="w-full border border-gray-300 p-3 rounded"
          />

          <label className="block mb-1">Confirm New Password</label>
          <input
            type="password"
            placeholder="Confirm New Password"
            value={formData.confirmPassword}
            required
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            className="w-full border border-gray-300 p-3 rounded"
          />

          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="w-full bg-[#B8860B] text-white px-4 py-2 rounded-lg hover:bg-[#a0730b] transition">
            {isSubmitting ? "Submitting..." : "Update Password"}
          </button>
        </div>
      </CommonModal>

      {/* OTP Modal */}
    </div>
  );
};

export default Setting;
