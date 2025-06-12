import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  FaUser,
  FaEdit,
  FaPenSquare,
  FaTasks,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

// Komponen NavItem yang di-refactor
const NavItem = ({ to, icon, children, isOpen }) => (
  <NavLink
    end
    to={to}
    className={({ isActive }) =>
      `flex items-center px-4 py-3 text-base font-medium rounded-xl transition-all duration-300 group ${
        isActive
          ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
          : "text-gray-500 hover:bg-orange-50 hover:text-orange-600"
      } ${!isOpen ? "justify-center" : ""}`
    }
  >
    <span className={`text-xl transition-all duration-300 ${isOpen ? "mr-4" : "mr-0"}`}>{icon}</span>
    <span
      className={`whitespace-nowrap transition-all duration-200 ${
        isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
      }`}
    >
      {children}
    </span>
  </NavLink>
);

export default function Sidebar({ isOpen, toggleSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    window.dispatchEvent(new Event("storage"));
  };

  const showEditProfileLink = location.pathname === "/author/edit-profile";
  const pathParts = location.pathname.split("/");
  const showEditArticleLink =
    pathParts.length > 3 && pathParts[2] === "manage-articles";

  return (
    <aside
      className={`relative bg-white flex flex-col h-screen sticky top-0 shadow-2xl transition-all duration-300 ease-in-out z-20 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="flex items-center justify-center py-4 mb-4 border-b border-gray-200 h-20 overflow-hidden">
        {/* Logo when expanded */}
        <h1
          onClick={() => navigate("/")}
          className={`text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 cursor-pointer transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        >
          Luminara
        </h1>
        {/* Logo when collapsed */}
        {!isOpen && (
            <h1
                onClick={() => navigate("/")}
                className={`absolute text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 cursor-pointer transition-opacity duration-300`}
            >
                L
            </h1>
        )}
      </div>

      <nav className="flex-grow space-y-2 px-2">
        <div>
          <NavItem to="/author/profile" icon={<FaUser />} isOpen={isOpen}>
            Profile
          </NavItem>
          {showEditProfileLink && (
            <div className={`transition-all duration-300 overflow-hidden ${isOpen ? 'pl-5 mt-1' : 'h-0'}`}>
              <NavItem to="/author/edit-profile" icon={<FaEdit />} isOpen={isOpen}>
                Edit Profile
              </NavItem>
            </div>
          )}
        </div>
        <div>
          <NavItem to="/author/manage-articles" icon={<FaTasks />} isOpen={isOpen}>
            Manage Articles
          </NavItem>
          {showEditArticleLink && (
             <div className={`transition-all duration-300 overflow-hidden ${isOpen ? 'pl-5 mt-1' : 'h-0'}`}>
              <NavItem to={location.pathname} icon={<FaEdit />} isOpen={isOpen}>
                Edit Article
              </NavItem>
            </div>
          )}
        </div>
        <NavItem to="/author/post-article" icon={<FaPenSquare />} isOpen={isOpen}>
          Post Article
        </NavItem>
      </nav>

      <div className="mt-auto px-2 mb-2">
        <button
          onClick={handleLogout}
          className={`flex items-center w-full px-4 py-3 text-base font-medium rounded-xl transition-all duration-300 group text-gray-500 hover:bg-red-50 hover:text-red-600 ${!isOpen ? "justify-center" : ""}`}
        >
          <span className={`text-xl ${isOpen ? 'mr-4' : 'mr-0'}`}>
            <FaSignOutAlt />
          </span>
          <span className={`whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            Logout
          </span>
        </button>
      </div>

       <div
          onClick={toggleSidebar}
          className="absolute top-8 -right-3 cursor-pointer"
        >
          <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-gray-600 shadow-md border hover:bg-gray-100 focus:outline-none">
            {isOpen ? <FaChevronLeft size={12}/> : <FaChevronRight size={12}/>}
          </div>
      </div>

      <div className={`text-center p-2 text-xs text-gray-400 overflow-hidden whitespace-nowrap transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}>
        Luminara © {new Date().getFullYear()}
      </div>
    </aside>
  );
}