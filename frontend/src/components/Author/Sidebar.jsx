import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const linkClasses = ({ isActive }) =>
    `flex items-center px-4 py-2 rounded-lg transition ${
      isActive
        ? 'bg-orange-100 text-orange-600 font-semibold'
        : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <div className="w-64 bg-white shadow-md p-4 space-y-2">
      <NavLink to="/author/profile" className={linkClasses}>
        👤 <span className="ml-2">Profile</span>
      </NavLink>
      <NavLink to="/author/post-article" className={linkClasses}>
        ✍️ <span className="ml-2">Post Article</span>
      </NavLink>
      <NavLink to="/author/manage-articles" className={linkClasses}>
        🛠 <span className="ml-2">Manage Articles</span>
      </NavLink>
    </div>
  );
}
