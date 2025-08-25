import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import router from "./Routers/Router.jsx";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "./lib/UserContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="font-inter  ">
      <UserProvider>
        <RouterProvider router={router} />
        <Toaster position="top-center" />
      </UserProvider>
    </div>
  </StrictMode>
);
