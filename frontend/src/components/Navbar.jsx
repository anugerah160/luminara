import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 cursor-pointer" onClick={() => navigate('/')}>
          LUMINARA
        </h1>

        {/* Search Bar */}
        <div className="flex-1 mx-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search hot trendy news today..."
              className="w-full border border-gray-300 rounded-full py-2 px-5 pr-12 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition">
              🔍
            </button>
          </div>
        </div>

        {/* Right Buttons */}
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition">
            Upgrade Pro
          </button>
          <button className="px-4 py-2 bg-orange-500 text-white rounded-full text-sm font-medium hover:bg-orange-600 transition">
            Post Ads
          </button>
        </div>
      </div>
    </header>
  );
}
