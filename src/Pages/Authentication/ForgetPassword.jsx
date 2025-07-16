import { useForm } from "react-hook-form";
import logo from '../../assets/logo/logo.png'
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
    const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();


  const onSubmit = (data) => {
    console.log("SignIn Data:", data);
    navigate("/otp");
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
            Forget Password
          </h2>
          <p className="text-center">Please enter your email address to reset
your password.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <label className="text-gray-700 ">Email</label>
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
              className="w-full px-4 py-2 mt-2 rounded-full border border-blue-200 outline-none"
            />
            {errors.email && (
              <p className="text-red-600 text-sm">{errors.email.message}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full btn-primary"
            >
              Submit
            </button>
          </form>
          
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
