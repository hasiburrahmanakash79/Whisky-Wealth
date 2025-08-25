import { Navigate, Outlet } from "react-router-dom";
import { getCookie } from "../lib/cookie-utils";

const PublicRoute = () => {
  const token = getCookie("accessToken");

  return token ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
