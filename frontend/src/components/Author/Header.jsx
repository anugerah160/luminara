import React, { useState, useEffect } from "react"
import { useLocation, useNavigate, NavLink } from "react-router-dom"
import { FaSignOutAlt, FaUserCircle } from "react-icons/fa"

// Ambil URL API dari environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
// Buat URL Aset dengan menghapus '/api' dari URL API
const ASSET_URL = API_BASE_URL.replace("/api", "")

export default function Header() {
  const [user, setUser] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Fungsi untuk membuat URL gambar yang absolut dan benar
  const getPictureUrl = (picturePath) => {
    if (
      !picturePath ||
      picturePath === "default.png" ||
      !picturePath.startsWith("/storage")
    ) {
      return "/images/default.png" // Fallback ke gambar default di /public/images
    }
    // Gabungkan URL ASET dengan path gambar
    return `${ASSET_URL}${picturePath}`
  }

  useEffect(() => {
    const updateUserFromStorage = () => {
      const storedUser = JSON.parse(localStorage.getItem("user"))
      setUser(storedUser)
    }

    updateUserFromStorage()
    window.addEventListener("storage", updateUserFromStorage)
    return () => {
      window.removeEventListener("storage", updateUserFromStorage)
    }
  }, [location])

  const handleLogout = () => {
    localStorage.clear()
    navigate("/login")
  }

  const getPageTitle = () => {
    const path = location.pathname.split("/").pop().replace(/-/g, " ")
    if (path === "author" || !path) return "Profile"
    return path.replace(/\b\w/g, (char) => char.toUpperCase())
  }

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b sticky top-0 z-10">
      <h1 className="text-2xl font-bold text-gray-800">{getPageTitle()}</h1>
      <div className="relative">
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center space-x-3 focus:outline-none"
        >
          <span className="hidden md:inline text-right">
            <span className="font-semibold text-gray-700">{user?.name}</span>
          </span>
          <img
            src={user ? getPictureUrl(user.picture) : "/images/default.png"}
            alt="User"
            className="w-11 h-11 rounded-full object-cover border-2 border-orange-400 p-0.5"
            onError={(e) => {
              e.target.onerror = null
              e.target.src = "/images/default.png"
            }}
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
            >
              <FaUserCircle className="mr-3 text-gray-400" />
              My Profile
            </NavLink>
            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center px-4 py-3 text-sm text-red-600 hover:bg-gray-100"
            >
              <FaSignOutAlt className="mr-3" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
