import React from "react"
import { NavLink, useNavigate, useLocation } from "react-router-dom"
import {
  FaUser,
  FaEdit,
  FaPenSquare,
  FaTasks,
  FaSignOutAlt,
} from "react-icons/fa"

const NavItem = ({ to, icon, children }) => (
  <NavLink
    end
    to={to}
    className={({ isActive }) =>
      `flex items-center px-4 py-3 text-base font-medium rounded-xl transition-all duration-300 group ${
        isActive
          ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
          : "text-gray-500 hover:bg-orange-50 hover:text-orange-600"
      }`
    }
  >
    <span className="mr-4 text-xl">{icon}</span>
    <span className="group-hover:translate-x-1 transition-transform duration-300">
      {children}
    </span>
  </NavLink>
)

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    localStorage.clear()
    navigate("/login")
    window.dispatchEvent(new Event("storage"))
  }

  // Logika untuk menampilkan sub-menu "Edit Profile"
  const showEditProfileLink = location.pathname === "/author/edit-profile"

  // REVISI: Logika untuk menampilkan sub-menu "Edit Article"
  // Ini akan true jika path dimulai dengan '/author/manage-articles/'
  // dan memiliki slug (panjang path lebih dari 3 bagian, misal: ['', 'author', 'manage-articles', 'slug'])
  const pathParts = location.pathname.split("/")
  const showEditArticleLink =
    pathParts[1] === "author" &&
    pathParts[2] === "manage-articles" &&
    pathParts.length > 3

  return (
    <aside className="w-64 flex-shrink-0 bg-white p-4 flex flex-col h-screen sticky top-0 shadow-2xl">
      <div className="text-center py-4 mb-4 border-b border-gray-200">
        <h1
          onClick={() => navigate("/")}
          className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 cursor-pointer"
        >
          Luminara
        </h1>
      </div>

      <nav className="flex-grow space-y-1">
        {/* Menu Profile dan Sub-menu Edit Profile */}
        <div>
          <NavItem to="/author/profile" icon={<FaUser />}>
            Profile
          </NavItem>
          {showEditProfileLink && (
            <div className="pl-5 mt-1">
              <NavItem to="/author/edit-profile" icon={<FaEdit />}>
                Edit Profile
              </NavItem>
            </div>
          )}
        </div>

        {/* Menu Manage Articles dan Sub-menu Edit Article */}
        <div>
          <NavItem to="/author/manage-articles" icon={<FaTasks />}>
            Manage Articles
          </NavItem>
          {/* Sub-menu ini hanya muncul saat URL cocok dengan /author/manage-articles/{slug} */}
          {showEditArticleLink && (
            <div className="pl-5 mt-1">
              <NavItem to={location.pathname} icon={<FaEdit />}>
                Edit Article
              </NavItem>
            </div>
          )}
        </div>

        <NavItem to="/author/post-article" icon={<FaPenSquare />}>
          Post Article
        </NavItem>
      </nav>

      {/* Tombol Logout */}
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-base font-medium rounded-xl transition-all duration-300 group text-gray-500 hover:bg-red-50 hover:text-red-600"
        >
          <span className="mr-4 text-xl">
            <FaSignOutAlt />
          </span>
          <span className="group-hover:translate-x-1 transition-transform duration-300">
            Logout
          </span>
        </button>
      </div>

      <div className="text-center p-4 text-xs text-gray-400">
        Luminara Dashboard © 2024
      </div>
    </aside>
  )
}
