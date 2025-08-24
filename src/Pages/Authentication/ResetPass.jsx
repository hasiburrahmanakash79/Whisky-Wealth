import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logo/logo.png";
import apiClient from "../../lib/api-client";
import { toast } from "react-toastify";

const ResetPass = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email || "";
  const otp = state?.otp || "";
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
  });
  const [isLoading, setIsLoading] = useState(false);
  const password = watch("password");

  // // Redirect if no email or OTP
  // useEffect(() => {
  //   if (!email || !otp) {
  //     navigate("/forgot_password");
  //   }
  // }, [email, otp, navigate]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await apiClient.post("/auth/reset-password", {
        email,
        otp,
        newPassword: data.password,
      });
      toast.success("Password reset successfully!");
      navigate("/signin");
    } catch (error) {
      console.error(
        "Reset Password Error:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message ||
          "Failed to reset password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center border border-[#B8860B] justify-center w-full max-w-md sm:max-w-lg lg:max-w-xl bg-[#EDEAD8] rounded-lg shadow-md p-6 sm:p-8 lg:p-10">
        <div className="w-full">
          <div className="flex flex-col items-center">
            <img src={logo} alt="Logo" className="w-24 sm:w-28 lg:w-36 mb-5" />
            <h2 className="text-center text-2xl sm:text-3xl font-semibold mb-4 text-gray-800">
              Reset Password
            </h2>
            <p className="text-center text-gray-600 text-sm sm:text-base mb-6">
              Your password must be 8–10 characters long.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm sm:text-base mb-1">
                New Password
              </label>
              <input
                type="password"
                placeholder="New Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Minimum 8 characters" },
                  maxLength: { value: 10, message: "Maximum 10 characters" },
                })}
                className={`w-full px-4 py-2 rounded-full border ${
                  errors.password ? "border-red-500" : "border-[#B0B0B0]"
                } outline-none focus:ring-2 focus:ring-[#B8860B] text-sm sm:text-base`}
              />
              {errors.password && (
                <p className="text-red-600 text-xs sm:text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm sm:text-base mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="Confirm Password"
                {...register("confirmPassword", {
                  required: "Please re-enter password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                className={`w-full px-4 py-2 rounded-full border ${
                  errors.confirmPassword ? "border-red-500" : "border-[#B0B0B0]"
                } outline-none focus:ring-2 focus:ring-[#B8860B] text-sm sm:text-base`}
              />
              {errors.confirmPassword && (
                <p className="text-red-600 text-xs sm:text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#B8860B] text-white py-2 rounded-full hover:bg-[#A67C00] focus:outline-none focus:ring-2 focus:ring-[#B8860B] disabled:bg-[#A67C00]/60 text-sm sm:text-base"
              disabled={isLoading || !isValid}>
              {isLoading ? "Resetting..." : "Confirm"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPass;
