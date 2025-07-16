import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import router from "./Routers/Router.jsx";
import  { Toaster } from 'react-hot-toast';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="font-inter  ">
      <RouterProvider router={router} />
      <Toaster position="top-center" />
    </div>
  </StrictMode>
);
