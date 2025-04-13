import React from "react";
import { useParams } from "react-router-dom";

const ArticleDetail = () => {
  const { slug } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Detail Artikel</h1>
      <p className="text-gray-600">Slug: {slug}</p>
    </div>
  );
};

export default ArticleDetail;
