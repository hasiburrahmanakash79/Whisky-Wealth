import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaLeftLong } from "react-icons/fa6";
import logo from "../../assets/logo/logo.png";
import apiClient from "../../lib/api-client";
import toast from "react-hot-toast"; // ✅ correct import

const OtpVerification = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email || "";

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(0);
  const [resendEnabled, setResendEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      navigate("/forgot_password");
    }
  }, [email, navigate]);

  // Load timer from localStorage
  // Load timer from localStorage or start new timer
  useEffect(() => {
    const expiry = localStorage.getItem("otpExpiry");
    if (expiry) {
      const remaining = Math.floor((parseInt(expiry) - Date.now()) / 1000);
      if (remaining > 0) {
        setTimer(remaining);
        setResendEnabled(false);
      } else {
        localStorage.removeItem("otpExpiry");
        setTimer(60); // start fresh 60s
        setResendEnabled(false);
        localStorage.setItem("otpExpiry", (Date.now() + 60000).toString());
      }
    } else {
      setTimer(60); // first time page load, start 60s
      setResendEnabled(false);
      localStorage.setItem("otpExpiry", (Date.now() + 60000).toString());
    }
  }, []);

  // Countdown
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            setResendEnabled(true);
            localStorage.removeItem("otpExpiry");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isComplete = otp.every((v) => v.trim().length === 1);
    if (!isComplete) {
      toast.error("Please fill all OTP fields");
      return;
    }

    const otpCode = otp.join("");
    setIsLoading(true);
    try {
      await apiClient.post("/auth/verify-password-reset-otp", {
        email,
        otp: otpCode,
      });
      toast.success("OTP verified successfully!");
      navigate("/reset_password", { state: { email, otp: otpCode } });
    } catch (error) {
      console.error(
        "OTP Verification Error:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message || "Invalid OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (resendEnabled && !isLoading) {
      setIsLoading(true);
      try {
        await apiClient.post("/auth/forgot-password", { email });
        toast.success("New OTP sent successfully!");
        const expiryTime = Date.now() + 60 * 1000;
        localStorage.setItem("otpExpiry", expiryTime.toString());
        setTimer(60);
        setResendEnabled(false);
      } catch (error) {
        console.error(
          "Resend OTP Error:",
          error.response?.data || error.message
        );
        toast.error(
          error.response?.data?.message ||
            "Failed to resend OTP. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Input change
  const handleInputChange = (e, index) => {
    const { value } = e.target;
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // auto move next
      if (value && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  // Backspace to previous input
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center border border-[#B8860B] justify-center w-full max-w-md sm:max-w-lg lg:max-w-xl bg-[#EDEAD8] rounded-lg shadow-md p-6 sm:p-8 lg:p-10">
        <div className="w-full">
          <div className="flex flex-col items-center">
            <img src={logo} alt="Logo" className="w-24 sm:w-28 lg:w-36 mb-5" />
            <h2 className="text-center text-2xl sm:text-3xl font-semibold mb-4 text-gray-800">
              Verify Email
            </h2>
            <p className="text-center text-gray-600 text-sm sm:text-base mb-6">
              Please enter the OTP sent to your email.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-2 sm:gap-4">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={otp[index]}
                  onChange={(e) => handleInputChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="w-12 sm:w-14 h-12 sm:h-14 text-center border border-[#B0B0B0] rounded-full text-lg sm:text-xl focus:outline-none focus:ring-2 focus:ring-[#B8860B]"
                />
              ))}
            </div>

            <p className="text-center text-xs sm:text-sm mt-4">
              {resendEnabled ? (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-[#B8860B] hover:underline disabled:text-gray-400"
                  disabled={isLoading}>
                  Resend OTP
                </button>
              ) : (
                <span className="text-gray-500">Resend OTP in {timer}s</span>
              )}
            </p>

            <button
              type="submit"
              className="w-full bg-[#B8860B] text-white py-2 rounded-full hover:bg-[#A67C00] focus:outline-none focus:ring-2 focus:ring-[#B8860B] disabled:bg-[#A67C00]/60 text-sm sm:text-base"
              disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          <div className="flex justify-center mt-4">
            <button
              onClick={() => navigate("/forgot_password")}
              className="text-[#B8860B] flex items-center hover:underline text-sm sm:text-base">
              <FaLeftLong className="mr-2" /> Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
