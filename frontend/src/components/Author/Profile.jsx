// components/author/Profile.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-orange-600 mb-6 flex items-center">
        👤 <span className="ml-2">My Profile</span>
      </h2>

      <div className="flex items-center gap-6 mb-6">
        <img
          src={'/luminara/default.png'}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border-4 border-orange-200"
        />
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{user?.name || 'John Doe'}</h3>
          <p className="text-gray-500">{user?.email || 'john@example.com'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => alert('Edit profile feature coming soon')}
          className="w-full px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
        >
          ✏️ Edit Profile
        </button>
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}
