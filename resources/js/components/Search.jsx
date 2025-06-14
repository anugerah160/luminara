import React, { useRef, useEffect, useState } from 'react';
import { getAllCategories } from '../services/categoryService';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

export default function Search() {
  const [search, setSearch] = useState('');
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    getAllCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setFiltersVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.append('q', search);
    if (author) params.append('author', author);
    if (category) params.append('category', category);
    if (sort) params.append('sort', sort);
    setFiltersVisible(false); // Close filter
    navigate(`/search?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      ref={searchRef}
      className="relative flex-1 mx-6 max-w-2xl"
    >
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setFiltersVisible(true)}
          placeholder="Search hot trendy news today..."
          className="w-full border border-gray-300 rounded-full py-2 px-5 pr-12 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition"
        >
          <FaSearch />
        </button>
      </div>

      {filtersVisible && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white border rounded-2xl shadow-xl p-4 z-50 space-y-4 animate-fadeIn">
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Type the author's name to search"
            className="w-full border px-3 py-2 rounded text-sm"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border px-3 py-2 rounded text-sm"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-700 font-medium">Sort by:</span>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="sort"
                value="latest"
                checked={sort === 'latest'}
                onChange={(e) => setSort(e.target.value)}
              />
              Latest
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="sort"
                value="oldest"
                checked={sort === 'oldest'}
                onChange={(e) => setSort(e.target.value)}
              />
              Oldest
            </label>
          </div>
        </div>
      )}
    </form>
  )
}