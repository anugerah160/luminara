import React from 'react';

export default function AuthorSidebar({ selectedMenu, setSelectedMenu }) {
  const menuItems = [
    { key: 'profile', label: 'Profile' },
    { key: 'post', label: 'Post Article' },
    { key: 'manage', label: 'Manage Articles' },
  ];

  return (
    <aside className="w-64 bg-white p-6 shadow-md h-screen sticky top-20">
      <h2 className="text-lg font-semibold mb-4">Dashboard</h2>
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.key}>
            <button
              onClick={() => setSelectedMenu(item.key)}
              className={`w-full text-left px-3 py-2 rounded ${
                selectedMenu === item.key
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'hover:bg-gray-100'
              }`}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
