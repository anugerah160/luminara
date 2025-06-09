import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  FaUser,
  FaEnvelope,
  FaPen,
  FaSignOutAlt,
  FaNewspaper,
} from "react-icons/fa"
import AuthorCard from "./AuthorCard"
import { getMyArticles } from "../../services/articleService"
import LoadingSpinner from "./LoadingSpinner"

// Ambil URL API dari environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
// Buat URL Aset dengan menghapus '/api' dari URL API
const ASSET_URL = API_BASE_URL.replace("/api", "")

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [articleCount, setArticleCount] = useState(0)
  const [loading, setLoading] = useState(true)

  // Fungsi untuk membuat URL gambar yang absolut dan benar
  const getPictureUrl = (picturePath) => {
    if (
      !picturePath ||
      picturePath === "default.png" ||
      !picturePath.startsWith("/storage")
    ) {
      return "/images/default.png" // Fallback ke gambar default di frontend
    }
    // Gabungkan URL ASET dengan path gambar
    return `${ASSET_URL}${picturePath}`
  }

  useEffect(() => {
    const loadProfileData = async () => {
      setLoading(true)
      const storedUser = JSON.parse(localStorage.getItem("user"))

      if (storedUser) {
        setUser(storedUser)
        try {
          const articles = await getMyArticles()
          setArticleCount(articles.length)
        } catch (error) {
          console.error("Failed to fetch article count", error)
        }
      } else {
        navigate("/login")
      }
      setLoading(false)
    }

    loadProfileData()
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    navigate("/login")
  }

  if (loading || !user) {
    return (
      <AuthorCard icon={<FaUser size={28} />} title="My Profile">
        <LoadingSpinner />
      </AuthorCard>
    )
  }

  return (
    <AuthorCard icon={<FaUser size={28} />} title="My Profile">
      <div className="text-center">
        <img
          src={getPictureUrl(user.picture)}
          alt="Profile"
          className="w-36 h-36 rounded-full object-cover mx-auto mb-4 border-4 border-orange-200 shadow-xl"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = "/images/default.png"
          }}
        />
        <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
        <div className="flex items-center justify-center text-gray-500 mt-2">
          <FaEnvelope className="mr-2" />
          <span>{user.email}</span>
        </div>
      </div>

      <div className="text-center my-8 p-4 bg-gray-50 rounded-lg flex justify-around">
        <div className="flex flex-col items-center">
          <FaNewspaper className="text-3xl text-orange-500" />
          <span className="text-xl font-semibold mt-1">{articleCount}</span>
          <span className="text-sm text-gray-500">Articles</span>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate("/author/edit-profile")}
          className="flex-1 flex items-center justify-center gap-2 w-full px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-transform transform hover:scale-105"
        >
          <FaPen /> Edit Profile
        </button>
        <button
          onClick={handleLogout}
          className="flex-1 flex items-center justify-center gap-2 w-full px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-transform transform hover:scale-105"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </AuthorCard>
  )
}
