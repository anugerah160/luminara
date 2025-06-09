/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { updateUser, getUserById } from "../../services/userService"
import {
  FaUserEdit,
  FaCamera,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa"
import AuthorCard from "../../components/Author/AuthorCard"
import LoadingSpinner from "../../components/Author/LoadingSpinner"

// Ambil URL API dari environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
// Buat URL Aset dengan menghapus '/api' dari URL API
const ASSET_URL = API_BASE_URL.replace("/api", "")

export default function EditProfile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  })
  const [pictureFile, setPictureFile] = useState(null)
  const [preview, setPreview] = useState("")

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Fungsi untuk membuat URL gambar yang absolut dan benar
  const getPictureUrl = (picturePath) => {
    if (
      !picturePath ||
      picturePath === "default.png" ||
      !picturePath.startsWith("/storage")
    ) {
      return "/images/default.png"
    }
    return `${ASSET_URL}${picturePath}`
  }

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true)
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"))
        if (!storedUser) {
          navigate("/login")
          return
        }
        const fullUser = await getUserById(storedUser.id)
        setUser(fullUser)
        setFormData({
          name: fullUser.name,
          email: fullUser.email,
          password: "",
          password_confirmation: "",
        })
        setPreview(getPictureUrl(fullUser.picture))
      } catch (err) {
        setError("Failed to fetch user data.")
      } finally {
        setLoading(false)
      }
    }
    fetchInitialData()
  }, [navigate])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith("image/")) {
      setPictureFile(file)
      setPreview(URL.createObjectURL(file))
    } else {
      setError("Please select a valid image file (e.g., PNG, JPG).")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsSubmitting(true)

    if (
      formData.password &&
      formData.password !== formData.password_confirmation
    ) {
      setError("Passwords do not match.")
      setIsSubmitting(false)
      return
    }

    const data = new FormData()
    data.append("_method", "PUT")

    data.append("name", formData.name)
    data.append("email", formData.email)

    if (formData.password) {
      data.append("password", formData.password)
      data.append("password_confirmation", formData.password_confirmation)
    }
    if (pictureFile) {
      data.append("picture", pictureFile)
    }

    try {
      const result = await updateUser(user.id, data)
      localStorage.setItem("user", JSON.stringify(result.user))
      setSuccess("Profile updated successfully! Redirecting...")

      setPreview(getPictureUrl(result.user.picture))
      setPictureFile(null)

      setTimeout(() => {
        window.dispatchEvent(new Event("storage"))
        navigate("/author/profile")
      }, 1500)
    } catch (err) {
      const errorData = err.response?.data
      if (errorData && errorData.errors) {
        const firstError = Object.values(errorData.errors)[0][0]
        setError(firstError)
      } else {
        setError(errorData?.message || "An unexpected error occurred.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <AuthorCard icon={<FaUserEdit size={28} />} title="Edit Profile">
        <LoadingSpinner />
      </AuthorCard>
    )
  }

  return (
    <AuthorCard icon={<FaUserEdit size={28} />} title="Edit Profile">
      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div
            className="flex items-center p-4 text-sm text-red-800 rounded-lg bg-red-50"
            role="alert"
          >
            <FaTimesCircle className="flex-shrink-0 inline w-5 h-5 mr-3" />
            <span className="font-medium">{error}</span>
          </div>
        )}
        {success && (
          <div
            className="flex items-center p-4 text-sm text-green-800 rounded-lg bg-green-50"
            role="alert"
          >
            <FaCheckCircle className="flex-shrink-0 inline w-5 h-5 mr-3" />
            <span className="font-medium">{success}</span>
          </div>
        )}

        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <img
              src={preview || "/images/default.png"}
              alt="Profile Preview"
              className="w-36 h-36 rounded-full object-cover border-4 border-gray-200 shadow-lg"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = "/images/default.png"
              }}
            />
            <label
              htmlFor="picture-upload"
              className="absolute -bottom-2 -right-2 flex items-center justify-center w-12 h-12 bg-orange-500 rounded-full text-white cursor-pointer hover:bg-orange-600 transition-transform transform hover:scale-110 shadow-md"
            >
              <FaCamera className="w-6 h-6" />
              <input
                id="picture-upload"
                name="picture"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
            />
          </div>
        </div>

        <hr />
        <p className="text-sm text-gray-500 text-center -my-4">
          Update your password (optional)
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min. 6 characters"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              placeholder="Repeat password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate("/author/profile")}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold transition disabled:bg-orange-300 disabled:cursor-not-allowed"
          >
            {isSubmitting && (
              <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5" />
            )}
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </AuthorCard>
  )
}
