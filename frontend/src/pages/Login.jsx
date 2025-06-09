import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { loginUser } from "../services/userService"
import { FaSpinner } from "react-icons/fa"

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      // Panggil API login
      const response = await loginUser({ email, password })

      // Simpan token DAN seluruh objek user ke localStorage
      localStorage.setItem("token", response.token)
      localStorage.setItem("user", JSON.stringify(response.user))

      // Arahkan ke halaman profil setelah berhasil
      navigate("/author/profile")
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "Failed to login. Please check your credentials."
      setError(errorMsg)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="p-8 bg-white rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-orange-600">
          Welcome Back!
        </h2>
        <p className="text-center text-gray-500 mt-2">
          Login to your Luminara account
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          {error && (
            <p className="text-sm text-center text-red-600 bg-red-50 p-3 rounded-lg">
              {error}
            </p>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 text-white bg-orange-500 rounded-lg hover:bg-orange-600 font-semibold transition disabled:bg-orange-300"
          >
            {loading ? <FaSpinner className="animate-spin" /> : "Login"}
          </button>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-orange-600 hover:underline"
            >
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
