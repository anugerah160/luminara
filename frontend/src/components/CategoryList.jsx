import React from "react";

export const CategoryList = () => {
  const categories = [
    { name: "Entertainment", slug: "/categories/entertainment" },
    { name: "Politics", slug: "/categories/politics" },
    { name: "Sports", slug: "/categories/sports" },
    { name: "Business", slug: "/categories/business" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((category, index) => (
        <a
          key={index}
          href={category.slug}
          className="bg-gray-200 hover:bg-gray-300 text-center py-4 rounded-lg shadow-md"
        >
          <span className="text-lg font-bold">{category.name}</span>
        </a>
      ))}
    </div>
  );
};
