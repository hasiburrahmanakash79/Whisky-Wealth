import { Navigate, Outlet } from "react-router-dom";
import { getCookie } from "../lib/cookie-utils";

const PrivateRoute = () => {
  const token = getCookie("accessToken");

  return token ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default PrivateRoute;
