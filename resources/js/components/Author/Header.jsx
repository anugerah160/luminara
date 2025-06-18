import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import { FaSignOutAlt, FaUserCircle, FaBars } from "react-icons/fa";

export default function Header({ toggleSidebar }) {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const updateUserFromStorage = () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);
    };

    updateUserFromStorage();
    window.addEventListener("storage", updateUserFromStorage);
    return () => {
      window.removeEventListener("storage", updateUserFromStorage);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setDropdownOpen(false);
    navigate("/login");
    window.dispatchEvent(new Event("storage"));
  };

  const getPageTitle = () => {
    const path = location.pathname.split("/").pop().replace(/-/g, " ");
    if(location.pathname.includes('/author/manage-articles/') && path !== 'manage articles') {
      return "Edit Article";
    }
    if (path === "author" || !path) return "Profile";
    return path.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "https://storage.googleapis.com/luminara-bucket/thumbnail/default.png";
  };

  const imageUrl = user?.picture || "https://storage.googleapis.com/luminara-bucket/thumbnail/default.png";

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b sticky top-0 z-10">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="text-gray-600 focus:outline-none"
          aria-label="Toggle sidebar"
        >
          <FaBars size={20} />
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 ml-4">
          {getPageTitle()}
        </h1>
      </div>
      <div className="relative">
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center space-x-3 focus:outline-none"
        >
          <span className="hidden md:inline text-right">
            <span className="font-semibold text-gray-700">{user?.name}</span>
          </span>
          <img
            key={imageUrl + user?.updated_at}
            src={`${imageUrl}?t=${new Date().getTime()}`}
            alt="User"
            className="w-11 h-11 rounded-full object-cover border-2 border-orange-400 p-0.5"
            onError={handleImageError}
          />
        </button>
        {dropdownOpen && (
          <div
            className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-xl py-2 z-50 animate-fadeIn"
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <div className="px-4 py-2 border-b">
              <p className="text-sm font-semibold text-gray-800">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <NavLink
              to="/author/profile"
              className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setDropdownOpen(false)}
            >
              <FaUserCircle className="mr-3 text-gray-400" /> My Profile
            </NavLink>
            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center px-4 py-3 text-sm text-red-600 hover:bg-gray-100"
            >
              <FaSignOutAlt className="mr-3" /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}