import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function NewsCard({ article }) {
  const {
    name,
    thumbnail,
    updated_at,
    is_featured,
    slug,
    content,
    category
  } = article;

  const formattedDate = updated_at
    ? format(new Date(updated_at), 'MMM dd, yyyy')
    : '';

  return (
    <Link to={`/articles/${slug}`} className="relative group h-full">
      <div className="bg-white rounded-2xl shadow hover:shadow-lg transition duration-300 w-auto h-full flex flex-col overflow-hidden">
        <div className="relative h-48 w-full">
          {/* Badge: Category */}
          {category?.name && (
            <div className="absolute top-2 left-2 bg-white/80 text-gray-800 text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm shadow-sm z-10">
              {category.name}
            </div>
          )}

          {/* Badge: Trending */}
          {is_featured?.toLowerCase() === 'yes' && (
            <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full z-10 shadow">
              🔥 Trending
            </div>
          )}

          <img
            src={thumbnail || 'https://via.placeholder.com/400x200?text=No+Image'}
            alt={name}
            className="w-full h-full object-cover rounded-t-2xl"
          />
        </div>

        <div className="flex-1 flex flex-col p-4">
          <h3 className="text-lg font-semibold mb-2 line-clamp-2">{name}</h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {content?.slice(0, 120) || 'No content available'}...
          </p>
          <div className="mt-auto text-xs text-gray-500">{formattedDate}</div>
        </div>
      </div>
    </Link>
  );
}
