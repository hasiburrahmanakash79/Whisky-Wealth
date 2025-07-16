import { useForm } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import { FaLeftLong } from "react-icons/fa6";
import logo from "../../assets/logo/logo.png";

const OtpVerification = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm();

  const [timer, setTimer] = useState(60);
  const [resendEnabled, setResendEnabled] = useState(false);
  const inputRefs = useRef([]);

  // Submit handler
  const onSubmit = (data) => {
    const values = Object.values(data);
    const isComplete = values.every((v) => v && v.length === 1);
    if (!isComplete) return;

    const otp = values.join("");
    console.log("OTP Entered:", otp);

    // TODO: Call your verify API here
  };

  // Countdown Timer
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else {
      setResendEnabled(true);
    }
  }, [timer]);

  // Handle resend
  const handleResendOtp = () => {
    if (resendEnabled) {
      console.log("Resend OTP triggered");
      setTimer(60);
      setResendEnabled(false);
      // TODO: Trigger resend OTP API
    }
  };

  // Auto move next and clear errors
  const handleInputChange = (e, index) => {
    const { value } = e.target;
    if (/^[0-9]$/.test(value) && value.length === 1 && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
    clearErrors();
  };

  // Backspace to previous
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-100 px-4">
      <div className="flex items-center justify-center px-8 py-12 w-full max-w-md bg-[#DEE5FF] rounded-lg shadow-md">
        <div className="w-full">
          {/* Logo + Heading */}
          <div className="flex flex-col items-center">
            <img src={logo} alt="Logo" className="w-32 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Verify Email
            </h2>
            <p className="text-sm text-gray-600 text-center mb-6">
              Please enter the OTP sent to your email.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* OTP Fields */}
            <div className="flex justify-center gap-4">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  {...register(`otp${index}`, { required: true })}
                  ref={(el) => (inputRefs.current[index] = el)}
                  onInput={(e) => handleInputChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-14 h-12 text-center border border-blue-400 rounded-full text-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              ))}
            </div>

            {/* Error Message */}
            {Object.keys(errors).length > 0 && (
              <p className="text-red-500 text-sm text-center mt-2">
                Please fill all OTP fields
              </p>
            )}

            {/* Resend Button / Timer */}
            <p className="text-center text-sm mt-4">
              {resendEnabled ? (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-blue-600 hover:underline"
                >
                  Resend OTP
                </button>
              ) : (
                <span className="text-gray-500">Resend OTP in {timer}s</span>
              )}
            </p>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md"
            >
              Verify OTP
            </button>
          </form>

          {/* Back Button */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => window.history.back()}
              className="text-blue-500 flex items-center hover:underline"
            >
              <FaLeftLong className="mr-2" /> Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
