import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useState } from "react";

const Signup = () => {
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
    console.log("Signup Data:", data);
    // Signup logic goes here
  };

  return (
    <div className="flex min-h-screen bg-base-200">
      {/* Left Side */}
      <div className="w-1/2 bg-blue-500 flex items-center justify-center p-8">
        <h2 className="text-white text-center text-4xl font-bold leading-relaxed">
          Logo
        </h2>
      </div>

      {/* Right Side */}
      <div className="w-1/2 flex items-center justify-center ">
        <div className="max-w-lg w-full p-16">
          <h2 className="text-2xl font-bold text-center mb-2">
            Sign Up Account
          </h2>
          <p className="text-center text-sm mb-6">
            Already have an Account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign In
            </Link>
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <input
                type="text"
                {...register("name", {
                  required: "Name is required",
                })}
                placeholder="Your name"
                className="w-full border border-blue-200 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email or Phone */}
            <div>
              <input
                type="text"
                {...register("email", {
                  required: "Email or phone number is required",
                })}
                placeholder="Email or Phone Number"
                className="w-full border border-blue-200 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                  })}
                  placeholder="Enter your Password"
                  className="w-full border border-blue-200 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
            </div>

            <button
              type="submit"
              className="btn-primary"
            >
              Sign Up
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 text-center text-gray-500">Or Login with</div>
          {/* Social Login */}
          <button className="flex items-center justify-center w-full px-4 py-2 rounded-md border border-blue-200 outline-none ">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Google
          </button>

          {/* Bottom Signup */}
          <p className="text-center text-sm mt-6">
            Already have an account?{" "}
            <Link to="/signin" className="text-blue-500 hover:underline">
              SignIn here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
