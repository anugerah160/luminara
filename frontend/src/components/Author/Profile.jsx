import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Profile({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">👤 Profile</h2>
      <img
        src={user?.picture || 'https://via.placeholder.com/150'}
        alt="Profile"
        className="w-24 h-24 rounded-full object-cover mb-4"
      />
      <p><strong>Name:</strong> {user?.name || 'John Doe'}</p>
      <p><strong>Email:</strong> {user?.email || 'john@example.com'}</p>
      <div className="mt-4 flex gap-3">
        <button
          onClick={() => alert('Edit profile feature coming soon')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Edit Profile
        </button>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
