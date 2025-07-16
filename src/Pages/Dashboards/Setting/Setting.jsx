import { IoChevronForwardSharp } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import CommonModal from "../../../components/Common/CommonModal";
import { useForm } from "react-hook-form";
import { RiArrowLeftLine } from "react-icons/ri";

const Setting = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [timer, setTimer] = useState(60);
  const [resendEnabled, setResendEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRefs = useRef([]);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const navigate = useNavigate();

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

  const handleResendOtp = () => {
    setResendEnabled(false);
    setTimer(60);
    alert("OTP resent to your email!");
    // TODO: Add actual resend API call
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // TODO: Add password change API call
    console.log("Password Data:", formData);
    setShowPasswordModal(false);
    setTimeout(() => setShowOtpModal(true), 300);
  };

  // OTP field logic (copied from OtpVerification)
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

  const onSubmit = (data) => {
    setIsSubmitting(true);
    const otp = Object.values(data).join("");
    console.log("OTP Submitted:", otp);

    // Simulate verify
    setTimeout(() => {
      setShowOtpModal(false);
      reset();
      setIsSubmitting(false);
      alert("OTP Verified!");
    }, 1000);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button className="text-2xl cursor-pointer" onClick={() => navigate(-1)}>
          <RiArrowLeftLine />
        </button>
        <h1 className="text-2xl font-semibold">Setting</h1>
      </div>

      {/* Setting Options */}
      <div className="space-y-5">
        <Link
          to="/setting/profile"
          className="bg-[#B7C8FF] p-5 rounded-lg flex justify-between items-center w-full px-7"
        >
          <p>Personal Information</p>
          <IoChevronForwardSharp />
        </Link>

        <button
          onClick={() => setShowPasswordModal(true)}
          className="bg-[#B7C8FF] p-5 rounded-lg flex justify-between items-center w-full px-7"
        >
          <p>Change Password</p>
          <IoChevronForwardSharp />
        </button>

        <Link
          to="/setting/privacy"
          className="bg-[#B7C8FF] p-5 rounded-lg flex justify-between items-center w-full px-7"
        >
          <p>Privacy & Policy</p>
          <IoChevronForwardSharp />
        </Link>
      </div>

      {/* Change Password Modal */}
      <CommonModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change Password"
      >
        <div className="space-y-4 mt-4">
          <label className="block mb-1">Current Password</label>
          <input
            type="password"
            placeholder="Current Password"
            value={formData.currentPassword}
            onChange={(e) => handleChange("currentPassword", e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          />

          <label className="block mb-1">New Password</label>
          <input
            type="password"
            placeholder="New Password"
            value={formData.newPassword}
            onChange={(e) => handleChange("newPassword", e.target.value)}
            className="w-full border border-gray-300 p-3 rounded"
          />

          <label className="block mb-1">Confirm New Password</label>
          <input
            type="password"
            placeholder="Confirm New Password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            className="w-full border border-gray-300 p-3 rounded"
          />

          <button onClick={handleSave} className="w-full btn-primary">
            Update Password
          </button>
        </div>
      </CommonModal>

      {/* OTP Modal */}
      <CommonModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        title="Email Verification"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex space-x-4 justify-center">
            {[...Array(6)].map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                {...register(`otp${index}`, {
                  required: "Required",
                  pattern: {
                    value: /^[0-9]$/,
                    message: "Must be a digit",
                  },
                })}
                ref={(el) => (inputRefs.current[index] = el)}
                onChange={(e) => handleInputChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 text-center border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
              />
            ))}
          </div>

          {Object.keys(errors).length > 0 && (
            <p className="text-red-500 text-sm text-center">
              Please fill all OTP fields correctly
            </p>
          )}

          <h2 className="text-xl font-bold text-center">Verify Your Email</h2>
          <p className="text-center text-sm">
            A 6-digit verification code has been sent to your email.
          </p>

          <p className="text-center text-sm mt-4">
            {resendEnabled ? (
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-blue-500 hover:underline"
              >
                Resend OTP
              </button>
            ) : (
              <span className="text-gray-500">Resend OTP in {timer}s</span>
            )}
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary"
          >
            {isSubmitting ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </CommonModal>
    </div>
  );
};

export default Setting;
