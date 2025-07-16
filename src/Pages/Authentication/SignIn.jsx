import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import logo from '../../assets/logo/logo.png'

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = (data) => {
    console.log("SignIn Data:", data);
    // Sign-in logic here
  };

  return (
    <div className="flex min-h-screen justify-center items-center ">
      

      {/* Right Side */}
      <div className="flex items-center justify-center px-10 py-16 w-1/4 bg-[#DEE5FF] rounded-lg shadow-md">
        <div className="max-w-xl w-full relative">
          <div className="flex flex-col items-center">
            <img src={logo} alt="" className="w-36 mb-5" />
          <h2 className="text-center text-3xl font-semibold mb-6 text-gray-800">
            Sign In
          </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <label className="text-gray-400">Username</label>
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
              className="w-full px-4 py-2 rounded-full border border-blue-200 outline-none"
            />
            {errors.email && (
              <p className="text-red-600 text-sm">{errors.email.message}</p>
            )}

            <div className="relative">
              <label className="text-gray-400">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                })}
                placeholder="Enter your Password"
                className="w-full px-4 py-2 rounded-full border border-blue-200 outline-none"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-3 flex items-center text-gray-300"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm mb-10">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register("remember")}
                  className="accent-blue-500"
                />
                Remember me
              </label>
              <a
                href="/forgot_password"
                className="text-blue-500 hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full btn-primary"
            >
              Sign In
            </button>
          </form>
          
        </div>
      </div>
    </div>
  );
};

export default SignIn;
