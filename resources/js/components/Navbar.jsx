import React, { useState, useEffect } from "react"
import { NavLink, useNavigate, useLocation } from "react-router-dom"
import { FaSignOutAlt, FaUserCircle, FaFeatherAlt } from "react-icons/fa"
import Search from "./Search"

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const updateUserState = () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"))
        setUser(storedUser)
      } catch (e) {
        console.error("Gagal mem-parsing data user dari localStorage", e)
        setUser(null)
      }
    }

    updateUserState()
    window.addEventListener("storage", updateUserState)

    return () => {
      window.removeEventListener("storage", updateUserState)
    }
  }, [location.pathname])

  const handleLogout = () => {
    localStorage.clear()
    setUser(null)
    setDropdownOpen(false)
    navigate("/")
    window.dispatchEvent(new Event("storage"))
  }

  const handleImageError = (e) => {
    e.target.onerror = null
    e.target.src = "https://storage.googleapis.com/luminara-bucket/thumbnail/default.png"
  }

  return (
    <header className="w-full bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-extrabold tracking-tight text-gray-800 cursor-pointer"
        >
          LUMINARA
        </h1>

        {/* Komponen Search di tengah */}
        <div className="flex-1 mx-6 hidden sm:block">
          <Search />
        </div>

        {/* Tombol Aksi di Kanan */}
        <div className="flex items-center space-x-3">
          {user ? (
            // Tampilan untuk pengguna yang sudah login
            <>
              <button
                onClick={() => navigate("/author/post-article")}
                className="flex items-center px-4 py-2 bg-orange-400 text-sm text-white rounded-full font-semibold hover:bg-orange-500 transition"
              >
                <FaFeatherAlt className="h-4 w-4 mr-2" /> Post Article
              </button>

              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center focus:outline-none"
                >
                  <img
                    key={user.picture}
                    src={user.picture || "https://storage.googleapis.com/luminara-bucket/thumbnail/default.png"}
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 hover:border-orange-400 transition"
                    onError={handleImageError}
                  />
                </button>
                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-xl py-2 z-50 animate-fadeIn"
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                    <NavLink
                      to="/author/profile"
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
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
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-full font-semibold hover:bg-blue-700 transition"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-4 py-2 bg-orange-500 text-white text-sm rounded-full font-semibold hover:bg-orange-600 transition"
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
