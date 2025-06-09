import React from "react"
import { NavLink } from "react-router-dom"
import { FaUser, FaEdit, FaPenSquare, FaTasks } from "react-icons/fa"

const NavItem = ({ to, icon, children }) => (
  <NavLink
    end // 'end' prop penting agar rute induk tidak aktif saat sub-rute aktif
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
  return (
    <aside className="w-64 flex-shrink-0 bg-white p-4 flex flex-col h-screen sticky top-0 shadow-2xl">
      <div className="text-center py-4 mb-4 border-b border-gray-200">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
          Luminara
        </h1>
      </div>
      <nav className="flex-grow space-y-3">
        <NavItem to="/author/profile" icon={<FaUser />}>
          Profile
        </NavItem>
        <NavItem to="/author/edit-profile" icon={<FaEdit />}>
          Edit Profile
        </NavItem>
        <NavItem to="/author/post-article" icon={<FaPenSquare />}>
          Post Article
        </NavItem>
        <NavItem to="/author/manage-articles" icon={<FaTasks />}>
          Manage Articles
        </NavItem>
      </nav>
      <div className="mt-auto text-center p-4 text-xs text-gray-400">
        Luminara Dashboard © 2024
      </div>
    </aside>
  )
}
