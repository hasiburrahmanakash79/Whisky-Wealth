import { createBrowserRouter } from "react-router";
// import Signup from "../Pages/Authentication/Signup";
import SignIn from "../Pages/Authentication/SignIn";
import OtpVerification from "../Pages/Authentication/OtpVerification";
import Dashboard from "../Layouts/Dashboard";
import Setting from "../Pages/Dashboards/Setting/Setting";
import ResetPass from "../Pages/Authentication/ResetPass";
import Home from "../Pages/Dashboards/Home/Home";
// import Notifications from "../Pages/Dashboards/Notification/Notification";
import ProfileInformation from "../Pages/Dashboards/Setting/ProfileInfo";
import Users from "../Pages/Dashboards/Users/Users";
import Challenge from "../Pages/Dashboards/Challenge/Challenge";
import PrivacyPolicy from "../Pages/Dashboards/Setting/PrivacyPolicy";
import Tokens from "../Pages/Dashboards/Tokens/Tokens";
import ForgetPassword from "../Pages/Authentication/ForgetPassword";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/user",
        element: <Users />,
      },
      {
        path: "/token",
        element: <Tokens />,
      },
      {
        path: "/challenge",
        element: <Challenge />,
      },
      {
        path: "/setting",
        element: <Setting />,
      },
      {
        path: "/setting/profile",
        element: <ProfileInformation />,
      },
      {
        path: "/setting/privacy",
        element: <PrivacyPolicy />,
      },
    ],
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  // {
  //   path: "/signup",
  //   element: <Signup />,
  // },
  {
    path: "/otp",
    element: <OtpVerification />,
  },
  {
    path: "/forgot_password",
    element: <ForgetPassword />,
  },
  {
    path: "/reset_password",
    element: <ResetPass />,
  },
]);

export default router;
