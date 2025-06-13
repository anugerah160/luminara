import React, { useEffect, useState } from "react";
import { getCategoryByName } from "../services/categoryService";
import { Link } from "react-router-dom";

const LatestForYou = ({ categoryName }) => {
  const [categoryData, setCategoryData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getCategoryByName(categoryName);
        setCategoryData(res);
      } catch (error) {
        console.error("Failed to load category data", error);
      }
    }
    fetchData();
  }, [categoryName]);

  if (!categoryData) {
    return <div className="text-gray-500 px-4 py-8">Loading...</div>;
  }

  const { category, articles } = categoryData;
  const featured = articles.find((a) => a.is_featured === "yes");
  const others = articles.filter((a) => a.id !== featured?.id);

  return (
    <section className="mt-10 px-4">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="text-lg font-bold">Latest For You</h3>
          <p className="font-semibold">in {category.name}</p>
        </div>
        <Link
          to={`/categories/${encodeURIComponent(category.name)}`}
          className="text-sm text-gray-500 hover:underline"
        >
          Explore All
        </Link>
      </div>

      <div className="md:flex gap-4">
        {/* Featured Left */}
        {featured && (
          <div className="relative md:w-1/2">
            <img
              src={featured.thumbnail}
              alt={featured.name}
              className="w-full h-48 md:h-64 object-cover rounded-xl"
            />
            <div className="absolute bottom-3 left-3 text-white">
              <div className="text-xs font-light">Featured</div>
              <div className="text-lg font-bold w-[80%]">{featured.name}</div>
              <div className="text-xs">{new Date(featured.created_at).toLocaleDateString()}</div>
            </div>
          </div>
        )}

        {/* Article List Right */}
        <div className="mt-4 md:mt-0 md:w-1/2 flex flex-col gap-3">
          {others.slice(0, 3).map((item) => (
            <Link
              to={`/articles/${item.slug}`}
              key={item.id}
              className="flex gap-3 items-center bg-white rounded-lg p-2 shadow hover:shadow-md transition"
            >
              <img
                src={item.thumbnail}
                alt={item.name}
                className="w-16 h-12 object-cover rounded"
              />
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <span className="text-xs text-gray-500">
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestForYou;
