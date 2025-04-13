import React from "react";
import { Link } from "react-router-dom";

export const ArticleCard = ({ article }) => {
  if (!article) return null;

  return (
    <div className="border rounded-lg shadow-md overflow-hidden">
      <img
        src={article.thumbnail}
        alt={article.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-bold">{article.name}</h3>
        <p className="text-gray-500 mt-1">
          {article.author?.name} – {new Date(article.created_at).toLocaleDateString()}
        </p>
        <p className="text-gray-700 mt-2 line-clamp-3">{article.content}</p>
        <Link
          to={`/articles/${article.slug}`}
          className="text-orange-500 mt-4 inline-block"
        >
          Read More →
        </Link>
      </div>
    </div>
  );
};
