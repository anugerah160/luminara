import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Search from './Search'

export default function Navbar() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error('Invalid user data in localStorage')
        localStorage.removeItem('user')
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser(null)
    navigate('/login')
  }

  return (
    <header className="w-full bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <h1
          onClick={() => navigate('/')}
          className="text-2xl font-extrabold tracking-tight text-gray-800 cursor-pointer"
        >
          LUMINARA
        </h1>

        {/* Search */}
        <div className="flex-1 mx-6 hidden sm:block">
          <Search />
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-3">
          {user ? (
            <>
              <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                👋 {user.name}
              </span>
              <button
                onClick={() => navigate('/author/profile')}
                className="px-4 py-2 bg-gray-300 text-sm text-gray-800 rounded-full font-semibold hover:bg-gray-400 transition"
              >
                Post
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-full font-semibold hover:bg-blue-700 transition"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
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
