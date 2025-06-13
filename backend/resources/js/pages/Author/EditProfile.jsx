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

export default function EditProfile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({ name: "", email: "" })
  const [passwordData, setPasswordData] = useState({
    password: "",
    password_confirmation: "",
  })
  const [pictureFile, setPictureFile] = useState(null)
  const [preview, setPreview] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    // Fetches initial data to populate the form.
    const fetchInitialData = async () => {
      setLoading(true)
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"))
        if (!storedUser?.id) {
          navigate("/login")
          return
        }

        const fullUser = await getUserById(storedUser.id)
        setUser(fullUser)
        setFormData({ name: fullUser.name, email: fullUser.email })
        // REVISED: Use fullUser.picture for the initial preview.
        setPreview(fullUser.picture)
      } catch (err) {
        setError("Failed to fetch user data.")
      } finally {
        setLoading(false)
      }
    }
    fetchInitialData()
  }, [navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === "password" || name === "password_confirmation") {
      setPasswordData((prev) => ({ ...prev, [name]: value }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPictureFile(file)
      // Creates a temporary local URL for preview.
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    if (
      passwordData.password &&
      passwordData.password !== passwordData.password_confirmation
    ) {
      setError("Passwords do not match.")
      return
    }
    setIsSubmitting(true)

    const data = new FormData()
    data.append("name", formData.name)
    data.append("email", formData.email)
    if (passwordData.password) {
      data.append("password", passwordData.password)
      data.append("password_confirmation", passwordData.password_confirmation)
    }
    if (pictureFile) {
      data.append("picture", pictureFile)
    }

    try {
      const result = await updateUser(user.id, data)
      // The result.user object now has the updated picture URL.
      localStorage.setItem("user", JSON.stringify(result.user))
      setSuccess("Profile updated successfully! Redirecting...")

      setTimeout(() => {
        window.dispatchEvent(new Event("storage")) // Dispatch event to notify other components.
        navigate("/author/profile")
      }, 1500)
    } catch (err) {
      const message =
        err.response?.data?.message || "An unexpected error occurred."
      setError(message)
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
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div
            className="p-4 text-sm text-red-800 rounded-lg bg-red-50"
            role="alert"
          >
            <FaTimesCircle className="inline w-5 h-5 mr-3" />
            {error}
          </div>
        )}
        {success && (
          <div
            className="p-4 text-sm text-green-800 rounded-lg bg-green-50"
            role="alert"
          >
            <FaCheckCircle className="inline w-5 h-5 mr-3" />
            {success}
          </div>
        )}

        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <img
              src={preview || "/images/default.png"}
              alt="Preview"
              className="w-36 h-36 rounded-full object-cover border-4 border-gray-200"
            />
            <label
              htmlFor="picture-upload"
              className="absolute -bottom-2 -right-2 flex items-center justify-center w-12 h-12 bg-orange-500 rounded-full text-white cursor-pointer hover:bg-orange-600 transition-transform transform hover:scale-110"
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

        {/* Form inputs remain the same */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
            />
          </div>
        </div>

        <div className="space-y-6">
          <hr />
          <p className="text-sm text-gray-500 text-center -my-4">
            Update your password (optional)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={passwordData.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="password_confirmation"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm New Password
              </label>
              <input
                id="password_confirmation"
                type="password"
                name="password_confirmation"
                value={passwordData.password_confirmation}
                onChange={handleChange}
                placeholder="Repeat password"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate("/author/profile")}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold disabled:bg-orange-300"
          >
            {isSubmitting && <FaSpinner className="animate-spin -ml-1 mr-3" />}
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </AuthorCard>
  )
}
