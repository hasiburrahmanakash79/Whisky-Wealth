import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo/logo.png";
import apiClient from "../../lib/api-client";
import { setAuthTokens, removeAuthTokens } from "../../lib/cookie-utils";

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post("/auth/login", {
        email: data.email,
        password: data.password,
      });
      console.log(response.data.data);

      const { accessToken, refreshToken } = response.data.data;
      setAuthTokens(accessToken, refreshToken);
      navigate("/");
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      removeAuthTokens();
      alert(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      {/* Form Container */}
      <div className="flex items-center justify-center border border-[#B8860B] w-full max-w-md sm:max-w-lg lg:max-w-xl bg-[#EDEAD8] rounded-lg shadow-md p-6 sm:p-8 lg:p-10">
        <div className="w-full">
          <div className="flex flex-col items-center">
            <img src={logo} alt="Logo" className="w-24 sm:w-28 lg:w-36 mb-5" />
            <h2 className="text-center text-2xl sm:text-3xl font-semibold mb-6 text-gray-800">
              Sign In
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-gray-600 text-sm sm:text-base">
                Username
              </label>
              <input
                type="email"
                placeholder="Enter Username"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid username",
                  },
                })}
                className="w-full px-4 py-2 rounded-[12px] border border-[#B0B0B0] outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
              {errors.email && (
                <p className="text-red-600 text-xs sm:text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <label className="text-gray-600 text-sm sm:text-base">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                })}
                placeholder="Enter your Password"
                className="w-full px-4 py-2 rounded-[12px] border border-[#B0B0B0] outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-3 top-6 flex items-center text-gray-500 hover:text-gray-700">
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">
                {errors.password.message}
              </p>
            )}

            {/* Remember Me & Forgot Password */}
            <div className="flex flex-row items-center justify-between text-xs sm:text-sm mb-6 sm:mb-10 gap-2 sm:gap-0">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register("remember")}
                  className="accent-[#B8860B] h-4 w-4"
                />
                Remember me
              </label>
              <a
                href="/forgot_password"
                className="text-[#B8860B] hover:underline">
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#B8860B] text-white py-2 rounded-[12px] hover:bg-[#B8860B] focus:outline-none  disabled:bg-blue-400 text-sm sm:text-base"
              disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
