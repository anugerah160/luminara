import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCategories } from '../services/categoryService';
import { FaSearch } from 'react-icons/fa';

export default function Navbar() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const [categories, setCategories] = useState([]);
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
    <header className="w-full bg-white shadow-md border-b z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <h1
          className="text-2xl font-bold tracking-tight text-black-600 cursor-pointer"
          onClick={() => navigate('/')}
        >
          LUMINARA
        </h1>

        {/* Search */}
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
                placeholder="Ketik nama author yang ingin dicari"
                className="w-full border px-3 py-2 rounded text-sm"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border px-3 py-2 rounded text-sm"
              >
                <option value="">Semua Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-700 font-medium">Urutkan:</span>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="sort"
                    value="latest"
                    checked={sort === 'latest'}
                    onChange={(e) => setSort(e.target.value)}
                  />
                  Terbaru
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="sort"
                    value="oldest"
                    checked={sort === 'oldest'}
                    onChange={(e) => setSort(e.target.value)}
                  />
                  Terlama
                </label>
              </div>
            </div>
          )}
        </form>

        {/* Right Buttons */}
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition">
            Upgrade Pro
          </button>
          <button className="px-4 py-2 bg-orange-500 text-white rounded-full text-sm font-semibold hover:bg-orange-600 transition">
            Post Ads
          </button>
        </div>
      </div>
    </header>
  );
}
