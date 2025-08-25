import { createBrowserRouter } from "react-router";
import SignIn from "../Pages/Authentication/SignIn";
import OtpVerification from "../Pages/Authentication/OtpVerification";
import Dashboard from "../Layouts/Dashboard";
import Setting from "../Pages/Dashboards/Setting/Setting";
import ResetPass from "../Pages/Authentication/ResetPass";
import Home from "../Pages/Dashboards/Home/Home";
import Notifications from "../Pages/Dashboards/Notification/Notification";
import ProfileInformation from "../Pages/Dashboards/Setting/ProfileInfo";
import Users from "../Pages/Dashboards/Users/Users";
import PrivacyPolicy from "../Pages/Dashboards/Setting/PrivacyPolicy";
import ForgetPassword from "../Pages/Authentication/ForgetPassword";
import Offers from "../Pages/Dashboards/Offers/Offers";
import Referrals from "../Pages/Dashboards/Referrals/Referrals";
import Orders from "../Pages/Dashboards/Orders/Orders";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

const router = createBrowserRouter([
  {
    element: <PrivateRoute />, // সব Dashboard route protected
    children: [
      {
        path: "/",
        element: <Dashboard />,
        children: [
          { path: "/", element: <Home /> },
          { path: "/user", element: <Users /> },
          { path: "/offers", element: <Offers /> },
          { path: "/orders", element: <Orders /> },
          { path: "/referrals", element: <Referrals /> },
          { path: "/notifications", element: <Notifications /> },
          { path: "/setting", element: <Setting /> },
          { path: "/setting/profile", element: <ProfileInformation /> },
          { path: "/setting/privacy", element: <PrivacyPolicy /> },
        ],
      },
    ],
  },
  {
    element: <PublicRoute />, // login না করলে শুধু এগুলো দেখতে পারবে
    children: [
      { path: "/signin", element: <SignIn /> },
      { path: "/otp", element: <OtpVerification /> },
      { path: "/forgot_password", element: <ForgetPassword /> },
      { path: "/reset_password", element: <ResetPass /> },
    ],
  },
]);

export default router;
