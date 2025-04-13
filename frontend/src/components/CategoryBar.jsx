import React, { useEffect, useState } from 'react';
import { getAllCategories } from '../services/categoryService';
import { useNavigate, useLocation } from 'react-router-dom';

export default function CategoryBar() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const currentCategoryId = location.pathname.startsWith('/categories/')
    ? location.pathname.split('/')[2]
    : null;

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchCategories();
  }, []);

  const handleClick = (id) => {
    navigate(`/categories/${id}`);
  };

  return (
    <div className="w-full bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center overflow-x-auto py-4">
          <div className="flex gap-3 flex-wrap justify-center">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleClick(cat.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border shadow-sm hover:shadow-md hover:-translate-y-0.5
                  ${
                    String(cat.id) === currentCategoryId
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'
                  }
                `}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
