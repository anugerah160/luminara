// components/AuthorInfo.jsx
import React from 'react';

export default function AuthorInfo({ author }) {
  return (
    <div className="flex items-center mb-6">
      <img
        src={author?.picture}
        alt={author?.name}
        className="w-10 h-10 rounded-full object-cover mr-4"
      />
      <div>
        <p className="font-medium">{author?.name}</p>
        <p className="text-xs text-gray-500">Journalist</p>
      </div>
    </div>
  );
}
