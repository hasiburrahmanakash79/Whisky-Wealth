import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo/logo.png";
import apiClient from "../../lib/api-client";
import { toast } from "react-toastify";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await apiClient.post("/auth/forgot-password", {
        email: data.email,
      });
      toast.success("Password reset email sent successfully!");
      navigate("/otp", { state: { email: data.email } });
    } catch (error) {
      console.error(
        "Forgot Password Error:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message ||
          "Failed to send reset email. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-center w-full max-w-md sm:max-w-lg lg:max-w-xl bg-[#EDEAD8] border border-[#B8860B] rounded-lg shadow-md p-6 sm:p-8 lg:p-10">
        <div className="w-full">
          <div className="flex flex-col items-center">
            <img src={logo} alt="Logo" className="w-24 sm:w-28 lg:w-36 mb-5" />
            <h2 className="text-center text-2xl sm:text-3xl font-semibold mb-4 text-gray-800">
              Forgot Password
            </h2>
            <p className="text-center text-gray-600 text-sm sm:text-base mb-6">
              Please enter your email address to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-gray-700 text-sm sm:text-base">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid Email",
                  },
                })}
                className="w-full px-4 py-2 mt-2 rounded-full border border-[#B0B0B0] outline-none focus:ring-2 focus:ring-[#B8860B] text-sm sm:text-base"
              />
              {errors.email && (
                <p className="text-red-600 text-xs sm:text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#B8860B] text-white py-2 rounded-full hover:bg-[#A67C00] focus:outline-none focus:ring-2 focus:ring-[#B8860B] disabled:bg-[#A67C00]/60 text-sm sm:text-base"
              disabled={isLoading}>
              {isLoading ? "Sending..." : "Next"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
