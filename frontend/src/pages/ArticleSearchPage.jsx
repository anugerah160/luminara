import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { searchArticles } from '../services/articleService';
import NewsCard from '../components/NewsCard';
import Navbar from '../components/Navbar';
import AdBanner from '../components/AdBanner';
import Footer from '../components/Footer';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ArticleSearch() {
  const query = useQuery();
  const q = query.get('q') || '';
  const author = query.get('author') || '';
  const category = query.get('category') || '';
  const sort = query.get('sort') || 'latest';

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      try {
        const res = await searchArticles({ q, author, category, sort });
        setArticles(res.data || []);
      } catch (err) {
        console.error('Search error:', err);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
    setPage(1);
  }, [q, author, category, sort]);

  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = articles.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(articles.length / itemsPerPage);
  const placeholders = Array(itemsPerPage - currentItems.length).fill(null);

  return (
    <>
      <Navbar />

      <div className="px-6 py-10 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-12">
          Search Results {q && (
            <span className="text-blue-600">for "{q}"</span>
          )}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 min-h-[600px]">
          {loading ? (
            placeholders.map((_, i) => (
              <div key={i} className="border rounded-md shadow-sm h-[330px] bg-white animate-pulse" />
            ))
          ) : currentItems.length > 0 ? (
            currentItems.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">No articles found.</div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-12 space-x-2">
            <button
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-sm rounded disabled:opacity-50"
              onClick={() => setPage((prev) => prev - 1)}
              disabled={page === 1}
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`px-3 py-1 rounded text-sm transition-all duration-200 ${
                  page === i + 1
                    ? 'bg-blue-500 text-white font-semibold'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-sm rounded disabled:opacity-50"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        )}

        <AdBanner />
        <Footer />
      </div>
    </>
  );
}
