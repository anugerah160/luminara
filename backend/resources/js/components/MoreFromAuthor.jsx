// components/MoreFromAuthor.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function MoreFromAuthor({ authorName, articles }) {
  if (!articles || articles.length === 0) return null;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">More From {authorName}</h3>
      <div className="space-y-4">
        {articles.slice(0, 4).map((item) => (
          <Link key={item.id} to={`/articles/${item.slug}`} className="flex gap-3 hover:bg-gray-100 rounded-lg p-2 transition">
            <img
              src={item.thumbnail || '/default-thumbnail.jpg'}
              alt={item.name}
              className="w-20 h-14 object-cover rounded-md"
            />
            <div className="flex-1">
              <p className="text-sm font-medium leading-snug line-clamp-2">{item.name}</p>
              <p className="text-xs text-gray-500 mt-1">{new Date(item.created_at).toLocaleDateString()}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
