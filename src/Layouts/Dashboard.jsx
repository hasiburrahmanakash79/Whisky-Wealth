import logo from "../assets/logo/logo.png";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Home, Users, Settings, Wine, Gift, Flag, UserPlus, ShoppingCart, Bell, LogOut, Menu, X } from "lucide-react";
import Swal from "sweetalert2";
import { removeAuthTokens } from "../lib/cookie-utils";
import { useUser } from "../lib/UserContext";
import { useState } from "react";

const Dashboard = () => {
  const location = useLocation();
  const { profileData } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to logout!", 
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout!",
      cancelButtonText: "No, Cancel!",
      customClass: {
        confirmButton: "bg-yellow-600 text-white px-4 py-2 rounded-md",
        cancelButton: "bg-gray-200 text-gray-800 px-4 py-2 rounded-md",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("User logged out");
        removeAuthTokens();
        window.location.href = "/signin";
      }
    });
  };

  const iconMappings = {
    Home: Home,
    User: Users,
    Settings: Settings,
    Cask: Wine,
    Offer: Gift,
    Challenge: Flag,
    Referrals: UserPlus,
    orders: ShoppingCart,
    Notification: Bell,
  };

  const Menus = [
    { title: "Dashboard", path: "/", icon: iconMappings.Home, gap: true },
    { title: "User", path: "/user", icon: iconMappings.User },
    { title: "Cask", path: "/cask", icon: iconMappings.Cask },
    { title: "Offers", path: "/offers", icon: iconMappings.Offer },
    { title: "Orders", path: "/orders", icon: iconMappings.orders },
    { title: "Referrals", path: "/referrals", icon: iconMappings.Referrals },
    { title: "Notifications", path: "/notifications", icon: iconMappings.Notification },
    { title: "Settings", path: "/setting", icon: iconMappings.Settings },
  ];


  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-[#F6F0E1] shadow-lg transition-all duration-300 ease-in-out z-50 ${
          isSidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#d8c491]">
          {isSidebarOpen && (
            <div className="flex items-center gap-3">
              <img src={logo} alt="logo" className="w-16 " />
              <h1 className="text-xl font-semibold text-gray-800">Admin</h1>
            </div>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-gray-600 hover:text-[#B8860B]"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <ul className="py-4">
          {Menus.map((Menu, index) => (
            <Link
              to={Menu.path}
              key={index}
              className={`flex items-center p-3 mx-2 mt-1 rounded-lg text-gray-600 hover:bg-[#f7eac9] hover:text-[#B8860B] transition-colors duration-200 ${
                location.pathname === Menu.path ? "bg-[#B8860B] text-white" : ""
              }`}
            >
              <Menu.icon size={20} className="min-w-[20px]" />
              {isSidebarOpen && (
                <span className="ml-3 text-sm font-medium">{Menu.title}</span>
              )}
            </Link>
          ))}
        </ul>

        <div className="absolute bottom-0 w-full border-t border-[#d8c491] bg-[#F6F0E1] ">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-3 px-5 text-gray-600 hover:bg-[#f7eac9] hover:text-[#B8860B] transition-colors duration-200"
          >
            <LogOut size={20} className="min-w-[20px]" />
            {isSidebarOpen && <span className="ml-3 text-sm font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-16"
        } p-6`}
      >
        <div className="flex justify-between items-center mb-6">
          {/* Left Section */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome, {profileData.name} 👋
            </h1>
            <p className="text-sm text-gray-500">Have a wonderful day!</p>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <Link to="/setting/profile">
              <img
                src={profileData.profileImage}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
              />
            </Link>
            <div>
              <span className="font-medium text-gray-800">{profileData.name}</span>
              <p className="text-sm text-gray-500">Admin</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;